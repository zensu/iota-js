

class Cell {
    constructor(x, y, element) {
        this.x = x;
        this.y = y;
        this.element = element;
        this.img_element = element.children[0]
    }

    setCard(card) {
        // this.img_element.src = card.image
        this.element.style.backgroundImage = `url('${card.image}')`
    }
}

class Card {
    constructor(id, digit, form, color) {
        this.id = id;
        this.digit = digit;
        this.form = form;
        this.color = color;
        this.image = `public/images/cards/${digit}_${form}_${color}.png`;
    }
}


class Table {
    constructor() {
        this.cells = {}
        this.deck = []
        this.drawGrid()
        this.populateCells()
        // this.makeDeck()
    }

    drawGrid() {
        for (let i=1; i<1025; i++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            board.appendChild(cell);
        }
    }
    
    populateCells() {
        let cells = document.getElementsByClassName('cell')
        let i = 0;
        for (let y=1; y<33; y++) {
            for (let x=1; x<33; x++) {
                cells[i].setAttribute("pos_x", x)
                cells[i].setAttribute("pos_y", y)
                cells[i].addEventListener("dragover", dragOver)
                cells[i].addEventListener("dragenter", dragEnter)
                cells[i].addEventListener("dragleave", dragLeave)
                cells[i].addEventListener("drop", dragDrop)
                cells[i].id = "" + x + y
                // let img = new Image(64, 64);
                // cells[i].appendChild(img)
                this.cells[cells[i].id] = new Cell(x, y, cells[i])
                i++
            }
        }
    }
    getCardsFromDeck() {
        // TODO WS
    }
    
    // makeDeck() {
    //     // let cards = []
    //     const digits = ['one', 'two', 'three', 'four'];
    //     const forms = ['triangle', 'circle', 'square', 'plus'];
    //     const colors = ['red', 'green', 'blue', 'yellow'];
    //     let i = 1
    //     for (let d=0; d<digits.length; d++) {
    //         for (let f=0; f<forms.length; f++) {
    //             for (let c=0; c<colors.length; c++) {
    //                 this.deck.push(new Card(i+1000, digits[d], forms[f], colors[c]))
    //                 i++
    //             }
    //         }
    //     }
    // }
}
