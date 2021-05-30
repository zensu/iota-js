class Player {
    constructor(name=null, id=null, table=null, avatar=null) {
        this.name = name;
        this.id = id;
        this.table = table;
        this.hand = [];
        this.cardAmount = 4;
        this._totalScore = 0;
        this._turnScore = 0;
        this.avatarImg = new Image(96, 96);
        this.avatarSrc = 'public/images/logo-iota.png';
        this.widget = null;
        this.drawDiv();
    }

    get totalScore() { 
        return this._totalScore 
    }

    set totalScore(score) {
        this._totalScore = this._totalScore + score
    }

    setAvatar(src=null) {
        if (src !== null) {
            this.avatarSrc = src
        } else {
            src = this.avatarSrc
        }
        this.avatarImg.src = src
    }
    appendHand(hand) {
        hand.forEach(c => {
            const card = new Card(c.id, c.digit, c.form, c.color)
            this.hand.push(card)
        })
        this.drawCards();
    }

    drawCards() {
        for (let i=0; i<this.hand.length; i++) {
            // let cardSrc = this.hand[i].image
            // let cardImg = new Image(64, 64);

            const card = document.createElement('div')
            const cell = document.getElementById(`cell${i}`)

            card.style.backgroundImage = `url('${this.hand[i].image}')`
            card.classList.add('player-card')
            card.setAttribute("draggable", "true")
            card.setAttribute("card", this.hand[i].id)
            card.addEventListener("dragstart", dragStart)
            card.addEventListener("dragend", dragEnd)
            cell.appendChild(card)
        }
    }

    takeCardsFromDeck() { // TODO into websocket
        for (let i=1; i<this.cardAmount+1; i++) {
            this.hand.push(this.table.deck.shift())
        }
        this.drawCards()
    }

    drawDiv() {
        //create player div
        const player = document.createElement('div')
        player.classList.add('playerWidget')
        player.id = `player_${this.id}`

        //player cards
        const playerCards = document.createElement('div')
        playerCards.classList.add('playerCards')
        player.appendChild(playerCards)

        //player name
        const playerName = document.createElement('div')
        playerName.classList.add('playerName')
        playerName.textContent = this.name
        player.appendChild(playerName)

        //set avatar
        const avatar = document.createElement('div')
        avatar.classList.add('avatarPlayer')
        avatar.appendChild(this.avatarImg)
        // player.appendChild(avatar) 

        //score
        const score = document.createElement('div')
        const totalScore = document.createElement('p')
        const turnScore = document.createElement('p')
        const button = document.createElement('input')
        score.classList.add('scorePlayer')
        player.appendChild(score)
        button.type = 'button'
        button.value = 'Закончить ход'
        button.classList.add('playerEndMove')
        totalScore.textContent = `Total Score: ${this.totalScore}`
        turnScore.textContent = `Turn Score: ${this._turnScore}`
        score.appendChild(button)
        score.appendChild(totalScore)
        score.appendChild(turnScore)

        for (let i=0; i<this.cardAmount; i++) {
            const cardCell = document.createElement('div')
            cardCell.classList.add('player-cell', 'empty')
            cardCell.id = "cell"+i
            playerCards.appendChild(cardCell)
            console.log("_"+playerCards)
        }
        
        main.appendChild(player)
        this.setAvatar()
        this.widget = player
    }
};
