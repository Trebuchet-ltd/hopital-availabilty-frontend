import {ArrayBufferUtils} from "./arraybuffer";
import {AES_EXTRACTABLE, AES_KEY_LENGTH, AES_TAG_LENGTH} from "./index";
import {Device} from "./device";
import { Store } from "./store";

export class Peer
{
    private readonly jid: string;
    private readonly store: Store;
    private readonly devices: Record<string, Device>;
    private static ownJid: string;
    private static ownDevices: Record<string, Device>;

    constructor(jid: string, store: Store)
    {
        this.jid = jid;
        this.store = store;
        this.devices = {};
    }

    async encrypt(plaintext: string)
    {
        const remoteDeviceIds = this.store.getDeviceList(this.jid);
        const ownDeviceIds = this.store.getOwnDeviceList().filter((id) =>id !== this.store.getDeviceId());

        const aes = await this.encryptWithAES(plaintext);
        const promises = [];

        for (const id of remoteDeviceIds) 
        {
            const device = this.getDevice(id);

            promises.push(device.encrypt(aes.keydata));
        }

        for (const id of ownDeviceIds)
        {
            const device = this.getOwnDevice(id);

            promises.push(device.encrypt(aes.keydata));
        }

        let keys = await Promise.all(promises);

        keys = keys.filter(key => key !== null);

        if (keys.length === 0)
            throw "Could not encrypt data with any Signal session";

        return {
            keys: keys,
            iv: aes.iv,
            payload: aes.payload
        };
    }

    decrypt(deviceId: number, ciphertext: string, preKey = false)
    {
        const device = this.getDevice(deviceId);

        return device.decrypt(ciphertext, preKey);
    }

    getDevice(id: number)
    {
        if (!this.devices[id])
            this.devices[id] = new Device(this.jid, id, this.store);

        return this.devices[id];
    }

    getOwnDevice(id: number)
    {
        if (!Peer.ownDevices[id])
            Peer.ownDevices[id] = new Device(Peer.ownJid, id, this.store);

        return Peer.ownDevices[id];
    }

    static setOwnJid(jid: string)
    { //@REVIEW
        Peer.ownJid = jid;
        Peer.ownDevices = {};
    }

    async encryptWithAES(plaintext: string)
    {
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const key = await this.generateAESKey();
        const encrypted = await this.generateAESencryptedMessage(iv, key, plaintext);

        const ciphertext = encrypted.ciphertext;
        const authenticationTag = encrypted.authenticationTag;

        const keydata = await window.crypto.subtle.exportKey("raw", key);

        return {
            keydata: ArrayBufferUtils.concat(keydata, authenticationTag),
            iv: iv,
            payload: ciphertext
        };
    }

    async generateAESKey() 
    {
        const algo = {
            name: "AES-GCM",
            length: AES_KEY_LENGTH,
        };
        const keyUsage: KeyUsage[] = ["encrypt", "decrypt"];

        return await window.crypto.subtle.generateKey(algo, AES_EXTRACTABLE, keyUsage);
    }

    async generateAESencryptedMessage(iv: Uint8Array, key: CryptoKey, plaintext: string)
    {
        const encryptOptions = {
            name: "AES-GCM",
            iv: iv,
            tagLength: AES_TAG_LENGTH
        };
        const encodedPlaintext = ArrayBufferUtils.encode(plaintext);

        const encrypted = await window.crypto.subtle.encrypt(encryptOptions, key, encodedPlaintext);
        const ciphertextLength = encrypted.byteLength - ((128 + 7) >> 3);
        const ciphertext = encrypted.slice(0, ciphertextLength);
        const authenticationTag = encrypted.slice(ciphertextLength);

        return {
            ciphertext: ciphertext,
            authenticationTag: authenticationTag
        };
    }
}
