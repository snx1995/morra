interface EventHandler {
    (msg?: any) : void
}

interface EventRegister {
    [propName: string]: Array<EventHandler>
}

class EventCenter {
    register: EventRegister;
    constructor() {
        this.register = {};
    }

    reg(event: string, handler: EventHandler) {
        if (this.register[event]) {
            this.register[event].push(handler);
            return;
        }
        this.register[event] = [handler];
    }

    emit(event: string, msg?: any) {
        const handlers = this.register[event];
        if (handlers) {
            handlers.forEach(handler => {
                handler(msg);
            })
        }
    }
}

export {EventHandler, EventCenter}