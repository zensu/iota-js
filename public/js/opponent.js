
class Opponent {
    constructor(name=null, id=null, avatar=null) {
        this.name = name;
        this.id = id;
        this.cardsAmount = 4;
        this._totalScore = 0;
        this._turnScore = 0;
        this.avatarSrc = 'public/images/logo-iota.png';
        this.cardSheetSrc = 'public/images/card_facedown.png';
        this.avatarImg = new Image(96, 96);
        this.widget = null;
        this.drawOpponentDiv()
        // this.cardSheetImg = new Image(58, 58);
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

    drawCards() {
        // const current_cards = document.querySelectorAll('.cardsOpponent')
        for (let i=0; i<this.cardsAmount; i++) {
            const card = document.createElement('div')
            card.classList.add('cardSheet')
            const cardImg = new Image(36, 36);
            cardImg.src = this.cardSheetSrc
            card.appendChild(cardImg)
            const cardsOpponent = document.querySelectorAll(`#opponent_${this.id} div.cardsOpponent`)[0]
            cardsOpponent.appendChild(card)
        }
    }

    drawOpponentDiv() {
        const opponent = document.createElement('div')
        // opponent.classList.add('opponentWidget')
        opponent.classList.add('opponentWidget')
        opponent.id = `opponent_${this.id}`
        const cardsOpponent = document.createElement('div')
        cardsOpponent.classList.add('cardsOpponent')
        const opponentName = document.createElement('div')
        opponentName.classList.add('opponentName')
        opponentName.textContent = this.name
        const avatar = document.createElement('div')
        avatar.classList.add('avatarOpponent')
        avatar.appendChild(this.avatarImg)
        const score = document.createElement('div')
        score.classList.add('scoreOpponent')
        const totalScore = document.createElement('p')
        const turnScore = document.createElement('p')
        totalScore.textContent = `Total Score: ${this.totalScore}`
        turnScore.textContent = `Turn Score: ${this._turnScore}`
        score.appendChild(totalScore)
        score.appendChild(turnScore)
        opponent.appendChild(avatar)
        opponent.appendChild(cardsOpponent)
        opponent.appendChild(opponentName)
        opponent.appendChild(score)
        otherPlayersDiv.appendChild(opponent)
        this.setAvatar()
        this.drawCards()
        this.widget = opponent
    }
}