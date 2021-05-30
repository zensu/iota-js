const ws = new WebSocket("ws://localhost:8888");
let clientId = null;
let playerName = null;
let clientPlayer = null;
let opponents = {};


function getRandomInt(max=10000) {
    return Math.floor(Math.random() * Math.floor(max));
}

ws.onmessage = message => {
    const response = JSON.parse(message.data);
    const game = response.game
    console.log(`Reply from srv: ${response}`)
    switch (response.method) {
        case "connect":
            clientId = response.clientId
            // console.log("My client id:" + response.clientId);
            break
        case "join":
            game.players.forEach(p => {
                // you are joined to the game
                if (p.clientId == clientId && !clientPlayer) {
                    clientPlayer = new Player(name=p.name, id=p.clientId, table=table, avatar=null)
                    document.getElementById("modal-start").style.display = "none";
                }
                // opponent joined to the game
                if (p.clientId != clientId && !(p.clientId in opponents)) {
                    console.log(`opponent ${p.name}, ${p.clientId}`)
                    opponents[p.clientId] = new Opponent(name=p.name, id=p.clientId, table=table, avatar=null)
                }
            }) 
            break
        case "create":
            // you create the game
            clientPlayer = new Player(name=game.players[0].name, id=clientId, table=table, avatar=null)
            clientPlayer.appendHand(response.hand)
            document.getElementById("modal-start").style.display = "none";
            break    
        case "leave":
            delete opponents[response.clientId]
            document.getElementById(`opponent_${response.clientId}`).remove()
            break
        case "setcard":
            break
        default:
            console.log("default case")
    }
}