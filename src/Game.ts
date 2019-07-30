import {Player} from "./player/Player";
import {EventHandler, EventCenter} from "./event/Event";

const VAR = {
    nextID: 0,
}

/***
 * 0 -> p p r0
 * 1 -> p p r1
 * if r0 == r1
 *      winner -> end
 * else
 *      2 -> p p r2
 */

enum GameState {
    waitingBothReady,
    waitingP1Ready,
    waitingP2Ready,
    waitingBoth,
    waitingP1,
    waitingP2
}

interface GameRecord {
    player?: string,
    guess?: string,
    result?: string,
    winner?: string
}

/**
 * guess c = st, b = jd, a = bu
 */
class Game {
    id: number;
    p1: Player;
    p2: Player;
    game: Array<GameRecord>;
    step: number;
    state: GameState;
    round: number;
    constructor(p: Player) {
        this.id = VAR.nextID ++;
        this.p1 = p;
        this.step = 0;
        this.state = GameState.waitingBothReady;
        this.round = -1;
        this.game = [];

        this.p1.on("ready", msg => {
            if (this.state == GameState.waitingP1Ready) {
                this.start();
            } else if (this.state == GameState.waitingBothReady) {
                this.state = GameState.waitingP2Ready;
                this.echoBoth("p1 is ready");
            }
        });
    }

    p2Join(p2: Player) {
        this.p2 = p2;
        this.p2.on("ready", msg => {
            if (this.state == GameState.waitingP2Ready) {
                this.start();
            } else if (this.state == GameState.waitingBothReady) {
                this.state = GameState.waitingP1Ready;
                this.echoBoth("p2 is ready");
            }
        });
    }

    start() {
        this.p1.emit("gamestart");
        this.p2.emit("gamestart");
        this.round = 0;
        this.echoBoth("round 0 started")

        this.state = GameState.waitingBoth;

        this.echoBoth("please guess");

        this.p1.on("guess", (msg: any) => {
            switch (this.state) {
                case GameState.waitingBoth:
                    this.game.push({
                        player: "p1",
                        guess: msg
                    });
                    this.state = GameState.waitingP2;
                    this.echoBoth("p1 has guessed");
                break;
                case GameState.waitingP1:
                    this.game.push({
                        player: "p1",
                        guess: msg
                    });
                    const result = this.calcResult();

                    this.echoBoth(`round ${this.round} finished.`);
                    this.echoBoth(`p1 ${msg} p2 ${this.game[this.game.length - 2].guess} -> result ${result.result}`);

                    this.game.push(result);
                    if (this.round >= 1) {
                        const winner = this.winner();
                        if (winner != null) {
                            this.finish(winner);
                            return;
                        }
                    }
                    this.echoBoth(`round ${this.round} finished, no winner yet`);
                    this.round ++;
                    this.state = GameState.waitingBoth;
                    this.echoBoth(`round ${this.round} started, please guess`);
                break;
            }
        })
        this.p2.on("guess", (msg: any) => {
            switch (this.state) {
                case GameState.waitingBoth:
                    this.game.push({
                        player: "p2",
                        guess: msg
                    });
                    this.state = GameState.waitingP1;
                    this.echoBoth("p2 has guessed");
                break;
                case GameState.waitingP2:
                    this.game.push({
                        player: "p2",
                        guess: msg
                    });
                    const result = this.calcResult();

                    this.echoBoth(`round ${this.round} finished.`);
                    this.echoBoth(`p1 ${this.game[this.game.length - 2].guess} p2 ${msg} -> result ${result.result}`);

                    this.game.push(result);
                    if (this.round >= 1) {
                        const winner = this.winner();
                        if (winner != null) {
                            this.finish(winner);
                            return;
                        }
                    }
                    this.echoBoth(`round ${this.round} finished, no winner yet`);
                    this.round ++;
                    this.state = GameState.waitingBoth;
                    this.echoBoth(`round ${this.round} started, please guess`);
                break;
            }
        })
    }

    finish(winner: string) {
        this.game.push({winner});
        this.p1.emit("gamefinish", `game finished, winner is ${winner}`);
        this.p2.emit("gamefinish", `game finished, winner is ${winner}`);
        this.echoBoth("---end---")
        this.round = 0;
        this.state = GameState.waitingBothReady;
    }

    echoBoth(msg: any) {
        if (this.p1 != null) this.p1.echo(msg);
        if (this.p2 != null) this.p2.echo(msg);
    }

    // 0 1 2 3 4 5
    calcResult() {
        const game = this.game;
        const g1 = game[game.length - 1];
        const g2 = game[game.length - 2];
        if (g1.guess == "st" && g2.guess == "bu") return {result: g2.player};
        else if (g1.guess == "bu" && g2.guess == "st") return {result: g1.player};
        else if (g1.guess > g2.guess) return {result: g1.player};
        else if (g1.guess == g2.guess) return {result: "平"};
        else return {result: g2.player};
    }

    winner() {
        const game = this.game;
        const r1 = game[game.length - 1].result;
        const r2 = game[game.length - 4].result;
        if (r1 != "平" && r1 == r2) {
            if (r1 == "p1") return this.p1.account;
            return this.p2.account;
        }
        return null;
    }
}

class GameCenter {
    gameStore: {[index: number]: Game};
    nextGame: Game;
    constructor() {
        this.gameStore = {};
        this.nextGame = null;
    }
    joinPlayer(player: Player) {
        let game: Game;
        if (this.nextGame == null) {
            game = new Game(player);
            this.nextGame = game;
            player.echo(`you have joined game ${game.id}, waiting another player`)
        }
        else {
            game = this.nextGame;
            this.nextGame.p2Join(player);
            this.gameStore[this.nextGame.id] = this.nextGame;
            this.nextGame = null;
            game.p1.echo(`${game.p2.account} has joined the game`);
            game.p2.echo(`you have joined game ${game.id}, playing with ${game.p1.account}`);
        }
    }
}

export {GameCenter};