var table = null;
let myPlayerName = null
const main = document.getElementsByClassName('main')[0];

const otherPlayersDiv = document.createElement('div');
const playerDiv = document.createElement('div');
const viewArea = document.createElement('div');
const board = document.createElement('div');
const k = window.innerWidth / window.innerHeight
otherPlayersDiv.classList.add('otherPlayers');
playerDiv.classList.add('playerDiv')
board.classList.add('board');
viewArea.classList.add('viewArea');
viewArea.appendChild(board);
viewArea.scrollIntoView();

if (window.innerWidth > window.innerHeight) {
    console.log(window.innerWidth / window.innerHeight)
    height = window.innerHeight * 0.60
} else {
    console.log(window.innerWidth, window.innerHeight)
    height = window.innerHeight * 0.75
}

viewArea.style.height = `${height}px`
main.appendChild(otherPlayersDiv);
main.appendChild(viewArea);

function getInputValue(id) {
    return document.getElementById(id).value
}

const inputName = document.getElementById("btn-accept-name")
inputName.onclick = function() {
    // document.getElementById("modal-start").style.display = "none";
    const payload = {"method": "join", "playerName": getInputValue("input-1"), "clientId": clientId}
    myPlayerName = payload.playerName
    createOrJoinWindow()
    // ws.send(JSON.stringify(payload))
}


function createOrJoinWindow() {
    console.log("window2")
    document.getElementsByClassName("modal-footer")[0].style.display = "none"
    const createGameP = document.getElementById("modal-text-1")
    const createGameInput = document.getElementById("input-1")
    const joinGameP = document.createElement("p")
    const joinGameInput = document.createElement("input")
    const modal = document.getElementById("modal-body-enter")
    const buttonCreate = document.createElement("button")
    const buttonJoin = document.createElement("button")
    createGameP.textContent = "Создать игру"
    createGameInput.value = ""
    joinGameP.textContent = "Войти в игру"
    joinGameP.classList.add("h4", "enter")
    joinGameInput.setAttribute("type", "text")
    createGameInput.setAttribute("placeholder", "Введите название для новой игры")
    joinGameInput.setAttribute("placeholder", "Введите название существующей игры")
    joinGameInput.id = "input-2"
    buttonCreate.classList.add("btn", "btn-primary")
    buttonCreate.textContent = "Создать"
    buttonJoin.classList.add("btn", "btn-primary")
    buttonJoin.textContent = "Присоединиться"
    modal.appendChild(buttonCreate)
    modal.appendChild(joinGameP)
    modal.appendChild(joinGameInput)
    modal.appendChild(buttonJoin)
    buttonCreate.onclick = function() {
        ws.send(JSON.stringify({"method": "create", "playerName": myPlayerName, "clientId": clientId, "gameName": getInputValue("input-1")}))
    }
    buttonJoin.onclick = function() {
        ws.send(JSON.stringify({"method": "join", "playerName": myPlayerName, "clientId": clientId, "gameName": getInputValue("input-2")}))
    }
}

table = new Table();

//Dummies
// function drawPlayers(count=3) {
//     for (let i=1; i<count+1; i++) {
//         const opponent = new Opponent(
//             name=`Denzel Washington ${i}`,
//             id=i,
//             avatar=null)
//         opponent.drawOpponentDiv()
//     }
//     const player = new Player(
//         name='Thomas Cook',
//         id=1001,
//         table=table,
//         avatar=null)
// }

// drawPlayers(count=3)
// let cell = table.cells[11]
// let card = table.deck[15]

// cell.setCard(card)
//End of dummies