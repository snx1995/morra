import {Socket} from "socket.io";
import {EventHandler, EventCenter} from "../event/Event";

enum PlayerState {
    CONNECTED,
    LOGINED,
    OFFLINE,
    LOGOUTED
}

interface LoginData {
    account: string,
    password: string
}

/**
 * event [login, logout, disconnect, ready]
 */

class Player {
    state: PlayerState;
    client: Socket;
    eventCenter: EventCenter;
    account: string;
    constructor(client: Socket) {
        this.client = client;
        this.state = PlayerState.CONNECTED;
        this.eventCenter = new EventCenter();
        client.on("login", (data: LoginData) => {
            if (data.account && data.password) {
                client.emit("echo", {
                    op: "login",
                    msg: "success",
                    code: 0
                });
                this.account = data.account;
                this.state = PlayerState.LOGINED;
                this.eventCenter.emit("login", data);
            }
        });

        client.on("disconnect", () => {
            this.state = PlayerState.OFFLINE;
            this.eventCenter.emit("disconnect");
        });

        client.on("logout", () => {
            this.eventCenter.emit("logout");
        });

        client.on("ready", () => {
            this.eventCenter.emit("ready");
        });

        client.on("guess", (msg: any) => {
            this.eventCenter.emit("guess", msg);
        })
    }

    on(event: string, handler: EventHandler) {
        this.eventCenter.reg(event, handler);
    }

    echo(data: any) {
        this.client.emit("echo", data);
    }
}

export {Player};