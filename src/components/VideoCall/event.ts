interface EventsMap {
  [event: string]: (...args: any) => void
}

export class Events<Events extends EventsMap>
{
    events: Partial<{[E in keyof Events]: Events[E][]} > = {};

    emit<K extends keyof Events>(event: K, ...args: [...Parameters<Events[K]>]) 
    {
        const callbacks = this.events[event] || [];
        for (let i = 0, length = callbacks.length; i < length; i++) 
            callbacks[i](...args);
        
    }

    on<K extends keyof Events>(event: K, cb: Events[K]) 
    {
        this.events[event]?.push(cb) || (this.events[event] = [cb]);
        return () => 
        {
            this.events[event] = this.events[event]?.filter(i => cb !== i);
        };
    }
}
