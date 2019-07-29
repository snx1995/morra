import net from "net";

class Server {
    server: net.Server;
    constructor(port: number) {
        this.server = net.createServer((socket: net.Socket) => {
             socket.on("connect", () => {
                 
             })
        })
    }
}