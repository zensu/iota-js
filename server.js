const http = require("http")
const express = require("express");
const uuid = require("uuid");
const app = express();
const root = { root: __dirname };
const wsPort = 8888;
const httpPort = 8080;
const httpServer = http.createServer();
const webSocket = require("websocket");
app.use("/public", express.static("public"));
app.get("/", (req, res) => res.sendFile("/game.html", root));
app.listen(httpPort, () => console.log("Listening http on " + httpPort))

httpServer.listen(wsPort, () => console.log("Listening on " + wsPort))

const wss = new webSocket.server({
    "httpServer": httpServer
})
const clients = {};
const games = {};
const cardAmount = 4;

class Client {
    constructor(ws, id) {
        this.ws = ws
        this.name = null
        this.clientId = id
        this.hand = []
    }
    toJSON() {
        return {
            name: this.name,
            clientId: this.clientId
        }
    }
}


class Cell {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.card = null;
    }

    setCard(card) {
        this.card = card
    }
}

class Card {
    constructor(id, digit, form, color) {
        this.id = id;
        this.digit = digit;
        this.form = form;
        this.color = color;
        // this.image = `public/images/cards/${digit}_${form}_${color}.png`;
    }
}


class Table {
    constructor() {
        this.cells = {}
        this.deck = []
        this.populateCells()
        this.makeDeck()
    }
    shuffle() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }
    populateCells() {
        for (let y=1; y<33; y++) {
            for (let x=1; x<33; x++) {
                const id = `${x}${y}`
                this.cells[id] = new Cell(x, y, id)
            }
        }
    }
    makeDeck() {
        const digits = ['one', 'two', 'three', 'four'];
        const forms = ['triangle', 'circle', 'square', 'plus'];
        const colors = ['red', 'green', 'blue', 'yellow'];
        let i = 1
        for (let d=0; d<digits.length; d++) {
            for (let f=0; f<forms.length; f++) {
                for (let c=0; c<colors.length; c++) {
                    this.deck.push(new Card(i+1000, digits[d], forms[f], colors[c]))
                    i++
                }
            }
        }
        this.shuffle()
    }
    getCardsFromDeck(player) {
        const count = cardAmount - player.hand.length
        for (let i=1; i<=count; i++) {
            player.hand.push(this.deck.pop())
        }
    }
}


class gameHandler {
    constructor(gameId, players) {
        this.gameId = gameId
        this.players = players
        this.table = new Table()
    }
    handle(data) {
        console.log("Handle request", data)
        const gameName = data.gameName
        const player = clients[data.clientId]
        if (data.method === "join") {
            if (gameName in games) {
                const playerName = data.playerName
                const players = games[gameName].players
                if (players.length < 6) {
                    player["name"] = playerName
                    player["gameName"] = gameName
                    players.push(player)
                    this.broadcast({"method": "join", "game": games[data.gameName]})
                } else {
                    ws.send(JSON.stringify({"method": "error", "message": `Game ${gameName} is full`}))
                }
            } else {
                ws.send(JSON.stringify({"method": "error", "message": `The game ${gameName} you are joined doesn't exists`}))
            }
        }
    }
    leave(clientId) {
        const p = clients[clientId]
        const i = this.players.indexOf(p)
        this.players.splice(i, 1)
        console.log(`Players: ${this.players}`)
        this.broadcast({"method": "leave", "clientId": clientId})
    }
    send(ws, payload) {
        ws.send(JSON.stringify(payload))
    }
    broadcast(payload) {
        this.players.forEach(p => {
            p.ws.send(JSON.stringify(payload)) 
        })
    }
    toJSON() {
        return {
            gameId: this.gameId,
            players: this.players
        }
    }
}

function createGame(ws, data) {
    const clientId = data.clientId
    const playerName = data.playerName
    const player = clients[clientId]
    if (data.method === "create") {
        if (!(data.gameName in games)) {
            player["name"] = playerName
            player["gameName"] = data.gameName
            const gameId = uuid.v4().slice(0, 8)
            games[data.gameName] = new gameHandler(gameId, [player])
            games[data.gameName].table.getCardsFromDeck(player)
            ws.send(JSON.stringify({"method": "create", "hand": player.hand, "game": games[data.gameName]}))
        } else {
            ws.send(JSON.stringify({"method": "error", "message": `Game ${data.gameName} is already exists`}))
        }                   
    }
}


wss.on("request", request => {
    //connect
    const ws = request.accept(null, request.origin)
    ws.on("open", () => {
        console.log("Client has connected")
    });
    ws.on("message", msg => {
        const data = JSON.parse(msg.utf8Data)
        console.log(`Received data: ${data}`)
        if (data.method === "create") {
            createGame(ws, data)
        } else if (data.gameName in games) {
            const handler = games[data.gameName]
            handler.handle(data)
        }
    });
    ws.on("close", () => {
        const client = clients[clientId]
        const handler = games[client.gameName]
        if (handler) {
            handler.leave(clientId)
        }
        console.log(`Client ${clientId} has disconnected`)
    });
    const clientId = uuid.v4();
    clients[clientId] = new Client(ws, clientId)
    const payload = {"method": "connect", "clientId": clientId};
    ws.send(JSON.stringify(payload))
})



