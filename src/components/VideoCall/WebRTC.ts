import {
    DEFAULT_CONSTRAINTS,
    DEFAULT_ICE_SERVERS,
    TYPE_ANSWER, TYPE_CALL_END,
    TYPE_CALL_REJECT,
    TYPE_DESCRIPTION,
    TYPE_ICECANDIDATE,
    TYPE_OFFER, TYPE_REGISTER,
    WEBSOCKET_URL
} from "./constants";
import {ready} from "localforage";
import { getAuth } from "../../api/auth";
import { Events } from "./event";

interface WsMessage
{
    type: string;
    data: unknown;
    error?: string;
}

export default class WebRTC
{
    private readonly localVideo: HTMLVideoElement;
    private readonly remoteVideo: HTMLVideoElement;
    private readonly remoteAudio: HTMLAudioElement;

    private readonly send: (type: string, data: unknown) => void;
    private readonly peer: RTCPeerConnection;
    private peerReady: Promise<unknown>;
    private audioRTCRtpSender?: RTCRtpSender;
    private videoRTCRtpSender?: RTCRtpSender;

    private readonly mediaStream: MediaStream = new MediaStream();
    readonly media: Media = new Media();
    private readonly notifyUser: (msg?: string) => Promise<boolean>;
    private connected = false;
    private makingOffer = false;
    readonly tearDown: () => void;
    private polite = false;
 
    constructor(token: string, to: string, localVideo: HTMLVideoElement, remoteVideo: HTMLVideoElement, remoteAudio: HTMLAudioElement, notifyUser: (msg?: string) => Promise<boolean>)
    {
        this.localVideo = localVideo;
        this.remoteVideo = remoteVideo;
        this.remoteAudio = remoteAudio;
        this.notifyUser = notifyUser;

        const metadata = {token, to};

        const socket = new WebSocket(WEBSOCKET_URL + getAuth());
        const opened = new Promise<void>((resolve) => socket.onopen = () =>
        {
            socket.send(JSON.stringify({type: TYPE_REGISTER, metadata}));
            resolve();
        });

        socket.onmessage = ({data}) => 
        {
            console.log(JSON.parse(data), "recieved");this.onMessage(JSON.parse(data));
        };

        this.send = (type, data: unknown) => opened.then(() => 
        {
            socket.send(JSON.stringify({type, data, metadata}));console.log({type, data, metadata}, "sent");
        });

        this.peer = new RTCPeerConnection({iceServers: DEFAULT_ICE_SERVERS});
        this.peerReady = new Promise((resolve) => this.peer.onnegotiationneeded = resolve);

        this.peer.onicecandidate = ({candidate}) => candidate && this.send(TYPE_ICECANDIDATE, candidate);
        this.peer.ontrack = ({streams}) => 
        {
            console.log("got stream", streams[0]);
            if(streams[0])
            {
                this.remoteAudio.srcObject = new MediaStream([streams[0].getAudioTracks()[0]]);
                this.remoteVideo.srcObject  = new MediaStream([streams[0].getVideoTracks()[0]]);
            }
        };

        this.media.on("newStream", (type)=>this.handleTrackFromMedia(type));

        this.setUpMedia();
        socket.onclose = this.tearDown = (...args) =>
        {
            console.log((args as any)[0]);
            this.media.end();
            socket.close();
            this.peer.close();
        };
        this.peer.addEventListener("connectionstatechange", event => 
        {
            console.log(this.peer.connectionState);
            if (this.peer.connectionState === "connected") 
            {
                this.connected = true;
                console.log("yaay connected");
            }
            else
                this.connected = false;
            
        });
    }

    async makeCall()
    {
        this.peer.addEventListener("negotiationneeded", ()=>this.createOffer());
        this.createOffer();
        this.polite = true;
    }

    async createOffer()
    {
        try 
        {
            this.makingOffer = true;
            const offer = await this.peer.createOffer();
            if (this.peer.signalingState != "stable") return;
            await this.peer.setLocalDescription(offer);
            this.send(TYPE_DESCRIPTION, this.peer.localDescription);
        }
        catch (e) 
        {
            console.log(`ONN ${e}`);
        }
        finally 
        {
            this.makingOffer = false;
        }
    }

    private async handleDescription(description: RTCSessionDescriptionInit)
    {
        if (description) 
        {
            const offerCollision = description.type == "offer" &&
                (this.makingOffer || this.peer.signalingState != "stable");

            const ignoreOffer = !this.polite && offerCollision;
            if (ignoreOffer) 
                return;
            
            if (offerCollision) 
                await Promise.all([
                    this.peer.setLocalDescription({ type: "rollback" }),
                    this.peer.setRemoteDescription(description)
                ]);
            else 
                await this.peer.setRemoteDescription(description);
            
            if (description.type == "offer") 
            {
                await this.peer.setLocalDescription(await this.peer.createAnswer());
                this.send(TYPE_DESCRIPTION, this.peer.localDescription);
            }
        }
    }

    private async setUpMedia() 
    {
        await this.media.setMediaStream("video");
        await this.media.setMediaStream("audio");
        this.handleTrackFromMedia("video");
        this.handleTrackFromMedia("audio");
    }

    private handleTrackFromMedia(type: MediaTypes)
    {
        if (type === "video" && this.media.videoTrack) 
        {
            this.videoRTCRtpSender = this.addTrack(this.media.videoTrack);
            this.localVideo.srcObject = new MediaStream([this.media.videoTrack]);
        }
        if (type === "audio" && this.media.audioTrack) 
            this.audioRTCRtpSender = this.addTrack(this.media.audioTrack);
        
    }

    private addTrack(track: MediaStreamTrack) 
    {
        console.log(this.mediaStream, track);
        console.log(this.peer.connectionState);
        return this.peer.addTrack(track, this.mediaStream);
    }

    private removeStream(type: MediaTypes)
    {
        if(type === "video" && this.videoRTCRtpSender)
            this.peer.removeTrack(this.videoRTCRtpSender);
        else if(type === "audio"&& this.audioRTCRtpSender)
            this.peer.removeTrack(this.audioRTCRtpSender);
        
    }

    private async onMessage({type, data, error}: WsMessage)
    {
        console.log(type);
        switch (type)
        {
        case TYPE_ICECANDIDATE:
            await this.peer.addIceCandidate(data as RTCIceCandidateInit | undefined);
            break;
        case TYPE_CALL_REJECT:
        case TYPE_DESCRIPTION:
            this.handleDescription(data as RTCSessionDescriptionInit);
            break;
        case TYPE_CALL_END:
            this.tearDown();
            this.notifyUser(data as string).then();
            break;
        default:
            console.warn("Unknown message type", type);
        }
    }

}


type MediaEvents = {
    newStream: (type: MediaTypes)=>void,
    streamEnd: (type: MediaTypes)=>void,
    replaceStream: (type: MediaTypes)=>void,
    videoToggle: (state: boolean) => void,
    audioToggle: (state: boolean) => void,
    permissionDenied: (devType: MediaTypes) => void
}

export type MediaTypes = "video" | "audio"
class Media
{
    videoTrack?: MediaStreamTrack;
    audioTrack?: MediaStreamTrack;
    private deniedSources: {audio?: boolean, video?: boolean} = {};
    private emitter: Events<MediaEvents> = new Events();
    private devices:{video?:string, audio?:string} = {};

    async setMediaStream(type:MediaTypes)
    {
        if (type === "video")
        {
            this.videoTrack = await this.getTrack("video", this.devices["video"]);
            if (this.videoTrack) 
            {
                this.videoTrack.addEventListener("ended", () => 
                {
                    delete this.videoTrack;
                    this.emitter.emit("videoToggle", false);
                    this.emitter.emit("streamEnd", "video");
                });
                this.emitter.emit("videoToggle", true);
            }
            return this.videoTrack;
        }
        else if (type === "audio")
        {
            this.audioTrack = await this.getTrack("audio", this.devices["audio"]);   
            if (this.audioTrack) 
            {
                this.audioTrack.addEventListener("ended", () => 
                {
                    delete this.videoTrack;
                    this.emitter.emit("audioToggle", false);
                    this.emitter.emit("streamEnd", "audio");
                });
                this.emitter.emit("audioToggle", true);
            }
            return this.audioTrack; 
        }
    }


    on<E extends keyof MediaEvents>(event: E, callback: MediaEvents[E]) 
    {
        return this.emitter.on(event, callback);
    }

    private async getTrack(type: MediaTypes, devId?: string)
    {
        try
        {
            const stream = await navigator.mediaDevices.getUserMedia({ [type]: devId ? { deviceId: { exact: devId } } : true });
            if(this.deniedSources[type])
                this.deniedSources[type] = false;
            return stream.getTracks()[0];
        }
        catch(e: any)
        {
            if(e.name === "NotAllowedError" || e.name == "SecurityError")
            {
                this.deniedSources[type] = true;
                this.emitter.emit("permissionDenied", type);
            }
            else
                throw e;
            
        }
    }
    

    async toggleCamera(state:boolean)
    {
        if(this.videoTrack)
        {
            this.videoTrack.enabled = state;
            this.emitter.emit("videoToggle", state);
        }
        else
        if(await this.setMediaStream("video"))
        {
            this.emitter.emit("newStream", "video");
            this.emitter.emit("videoToggle", true);
        }
        
    }

    async toggleMic(state:boolean)
    {
        if(this.audioTrack)
        {
            this.audioTrack.enabled = state;
            this.emitter.emit("audioToggle", state);
        }
        else
        if(await this.setMediaStream("audio"))
        {
            this.emitter.emit("newStream", "audio");
            this.emitter.emit("audioToggle", true);
        }
        
    }  

    end()
    {
        this.videoTrack?.stop();
        this.audioTrack?.stop();
        delete this.audioTrack;
        delete this.videoTrack;
    }
}
