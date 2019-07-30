const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

import {Player} from "./player/player";
import {GameCenter} from "./Game";

const center = new GameCenter();

io.on("connection", (socket: any) => {
    console.log("a user connected");
    const player = new Player(socket);
    player.on("login", msg => {
        center.joinPlayer(player);
    });
})

http.listen(12345, () => {
    console.log("server started at 12345");
})