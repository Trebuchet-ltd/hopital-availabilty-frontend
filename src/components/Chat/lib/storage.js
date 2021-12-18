const PREFIX = "jsxc2";

const SEP = ":";

const IGNORE_KEY = ["rid"];

const BACKEND = localStorage;

export class Storage
{
    static clear(name)
    {
        let prefix = PREFIX + SEP;

        if (prefix)

            prefix = prefix + name + SEP;

        for (const key in BACKEND)
        {
            if (!BACKEND.hasOwnProperty(key))

                continue;

            if (key.startsWith(prefix))

                BACKEND.removeItem(key);

        }
    }

    constructor()
    {
        this.hooks = {};

        if (Storage.tested === undefined)
        {
            Storage.tested = false;
            Storage.storageNotConform = false;
            Storage.toSNC = undefined;
        }

        if (!Storage.tested)
        {
            Storage.tested = true;

            this.testStorage();
        }

        window.addEventListener("storage", this.onStorageEvent, false);

    }

    getName()
    {
        return this.name;
    }

    generateKey(...args)
    {
        let key = "";

        args.forEach(function (arg)
        {
            if (key !== "")

                key += SEP;

            key += arg;
        });

        return key;
    }

    testStorage()
    {
        const randomNumber = Math.round(Math.random() * 1000000000) + "";
        const key = this.getPrefix() + randomNumber;

        const listenerFunction = function (ev)
        {
            if (ev.newValue === randomNumber)
            {
                clearTimeout(timeout);
                cleanup();
                Storage.storageNotConform = true;
            }
        };

        const cleanup = function ()
        {
            window.removeEventListener("storage", listenerFunction, false);
            BACKEND.removeItem(key);
        };

        window.addEventListener("storage", listenerFunction, false);

        const timeout = setTimeout(function ()
        {
            cleanup();
        }, 20);

        BACKEND.setItem(key, randomNumber);
    }

    getPrefix()
    {
        let prefix = PREFIX + SEP;

        if (this.name)
            prefix += this.name + SEP;

        return prefix;
    }

    getBackend()
    {
        return BACKEND;
    }

    setItem()
    {
        let key, value;

        if (arguments.length === 2)
        {
            key = arguments[0];
            value = arguments[1];
        }
        else if (arguments.length === 3)
        {
            key = arguments[0] + SEP + arguments[1];
            value = arguments[2];
        }

        //@REVIEW why do we just stringify objects?
        if (typeof (value) === "object")

            // exclude jquery objects, because otherwise safari will fail
            try
            {
                value = JSON.stringify(value, function (key, val)
                {
                    return val;
                });
            }
            catch (err)
            {
                console.warn("Could not stringify value", err);
            }

        const pre_key = this.getPrefix() + key;
        const oldValue = BACKEND.getItem(pre_key);

        BACKEND.setItem(pre_key, value);

        if (!Storage.storageNotConform && oldValue !== value)
            this.onStorageEvent({
                key: pre_key,
                oldValue: oldValue,
                newValue: value
            });

    }

    getItem()
    {
        let key;

        if (arguments.length === 1)

            key = arguments[0];

        else if (arguments.length === 2)

            key = arguments[0] + SEP + arguments[1];

        key = this.getPrefix() + key;

        return this.parseValue(BACKEND.getItem(key));
    }

    removeItem()
    {
        let key;

        if (arguments.length === 1)

            key = arguments[0];

        else if (arguments.length === 2)

            key = arguments[0] + SEP + arguments[1];

        BACKEND.removeItem(this.getPrefix() + key);
    }

    updateItem()
    {
        let key, variable, value;

        if (arguments.length === 4 || (arguments.length === 3 && typeof variable === "object"))
        {
            key = arguments[0] + SEP + arguments[1];
            variable = arguments[2];
            value = arguments[3];
        }
        else
        {
            key = arguments[0];
            variable = arguments[1];
            value = arguments[2];
        }

        const data = this.getItem(key) || {};

        if (typeof (variable) === "object")
            $.each(variable, function (key, val)
            {
                if (typeof (data[key]) === "undefined")
                    Log.debug("Variable " + key + " doesn't exist in " + variable + ". It was created.");

                data[key] = val;
            });

        else
        {
            if (typeof data[variable] === "undefined")

                Log.debug("Variable " + variable + " doesn't exist. It was created.");

            data[variable] = value;
        }

        this.setItem(key, data);
    }

    increment(key)
    {
        const value = Number(this.getItem(key));

        this.setItem(key, value + 1);
    }

    removeElement()
    {
        let key, name;

        if (arguments.length === 2)
        {
            key = arguments[0];
            name = arguments[1];
        }
        else if (arguments.length === 3)
        {
            key = arguments[0] + SEP + arguments[1];
            name = arguments[2];
        }

        var item = this.getItem(key);

        if ($.isArray(item))

            item = $.grep(item, function (e)
            {
                return e !== name;
            });

        else if (typeof (item) === "object" && item !== null)

            delete item[name];

        this.setItem(key, item);
    }

    registerHook(eventName, func)
    {
        if (!this.hooks[eventName])

            this.hooks[eventName] = [];

        this.hooks[eventName].push(func);
    }

    removeHook(eventName, func)
    {
        let eventNameList = this.hooks[eventName] || [];

        if (typeof func === "undefined")

            eventNameList = [];

        else if (eventNameList.indexOf(func) > -1)

            eventNameList = $.grep(eventNameList, function (i)
            {
                return func !== i;
            });

        this.hooks[eventName] = eventNameList;
    }

    onStorageEvent = (ev) =>
    {
        const hooks = this.hooks;
        const key = ev.key.replace(new RegExp("^" + this.getPrefix()), "");
        const oldValue = this.parseValue(ev.oldValue);
        const newValue = this.parseValue(ev.newValue);

        if (IGNORE_KEY.indexOf(key) > -1)

            return;

        const eventNames = Object.keys(hooks);
        eventNames.forEach(function (eventName)
        {
            if (key.match(new RegExp("^" + eventName + "(:.+)?$")))
            {
                const eventNameHooks = hooks[eventName] || [];
                eventNameHooks.forEach(function (hook)
                {
                    hook(newValue, oldValue, key);
                });
            }
        });
    };

    parseValue(value)
    {
        try
        {
            return JSON.parse(value);
        }
        catch (e)
        {
            return value;
        }
    }
}
