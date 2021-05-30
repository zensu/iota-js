class gameHandler {
    handle(data) {
        console.log("Handle request", data)
        switch (data.method) {
            case "create":
                const gameId = uuid.v4().slice(0,8)
                games[gameId] = [new Player(data.playerName, data.clientId)]
                ws.send(JSON.stringify({"method": "create", "gameId": gameId}))
                console.log("Created new game: "+gameId)
        }
    }
}
