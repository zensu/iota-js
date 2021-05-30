
const WebSocket = require("ws");
class WebSocketServer {
    constructor() {
        this.ws = new WebSocket('ws://127.0.0.1:8888/iota');
        this.ws.onopen = function () {
            this.send(JSON.stringify({'action': 'connect', 'args': {'name': username, 'clientId': clientId}}))
            console.log('Connected')
        };
        this.ws.onclose = function () {
            console.log('Disconnected')
        };
        this.ws.onmessage = function (event) {
            const response = JSON.parse(event.data)
            console.log(`Receive data: ${response}`)
            if (response.action === 'join') {
                if ("lobby_guid" in response) {
                    lobby_guid = response.lobby_guid;
                } else { 
                    console.log(response)
                }
                join()
            }
        };
        this.sendJSON = function (data) {
            const payload = JSON.stringify(data)
            this.ws.send(payload)
    }
    }
}

const websocket = new WebSocketServer();
let lobby_guid;
const createButton = document.getElementById("create-button")
const createField = document.getElementById("create-field")
const leaveButton = document.getElementsByClassName("leaveLobby")[0]
createButton.onclick = function () {
    const lobbyName = createField.value
    websocket.ws.send(`{"action": "create_lobby", "args": {"name": "${lobbyName}"}}`)
}

leaveButton.onclick = function () {
    console.log('clicked leave')
    const lobby = document.getElementById('lobby')
    const divChoosing = document.getElementsByClassName("choosing")[0]
    const divLeaving = document.getElementsByClassName("leaving")[0]
    // divLeaving.classList.add("right-out")
    // divChoosing.classList.add("left-in")
    divChoosing.classList.remove("out")
    divLeaving.classList.remove("in")
    lobby.classList.add("leave")
    lobby.classList.remove("join")
}


function join() {
    const lobby = document.getElementById('lobby')
    const divChoosing = document.getElementsByClassName("choosing")[0]
    const divLeaving = document.getElementsByClassName("leaving")[0]
    console.log(divChoosing)
    divChoosing.classList.add("out")
    divLeaving.classList.add("in")
    // divChoosing.classList.remove("right-out", "right-in")
    // divLeaving.classList.remove("left-in", "left-out")
    lobby.classList.add("join")
    lobby.classList.remove("leave")
}
