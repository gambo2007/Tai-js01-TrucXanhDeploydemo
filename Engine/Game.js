import { Node } from './Node.js';
import { Card } from './Card.js';
import { Message } from './Message.js';
import { Label} from './Label.js';
export class Game {
    constructor(body) {
        this.gameBoard = new Node('div', 'game-board');
        this.allCards = this.getAllCards();
        this.coins = 10000;
        this.openedCards = [];
        this.matchedPairs = 0;
        this.shuffledCards = this.shuffle(this.allCards);
        this.createGameBoard();
        this.body = body;
    }

    getAllCards() {
        const allCards = ['img1.jpeg', 'img2.jpeg', 'img3.jpeg', 'img4.jpeg', 'img5.jpeg', 'img6.jpeg', 'img7.jpeg', 'img8.jpeg', 'img9.jpeg', 'img10.jpeg'];
        return allCards.concat(allCards);
    }

    shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    createGameBoard() {
        if (!this.gameBoard) {
            this.gameBoard = new Node('div', 'game-board');
            document.body.appendChild(this.gameBoard.element);
        }

        this.gameBoard.element.innerHTML = '';
        this.createCoinText();
        this.gameBoard.element.appendChild(this.coin.element);
        const rows = 4;
        const cols = 5;

        const cardWidth = 100;
        const cardHeight = 100;

        const gap = 10;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const centerLeft = (windowWidth - cols * (cardWidth + gap)) / 2;
        const centerTop = (windowHeight - rows * (cardHeight + gap)) / 2;
        this.gameBoard.element.style.position = 'absolute';
        this.gameBoard.element.style.left = `${centerLeft}px`;
        this.gameBoard.element.style.top = `${centerTop}px`;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const index = row * cols + col;
                if (index < this.shuffledCards.length) {
                    const cardNumber = index + 1;
                    const frontImagePath = 'front.png';
                    const card = new Card(cardNumber, frontImagePath, this.shuffledCards[index], this.flipCard.bind(this));
                    card.setBackgroundImage();
                    const left = col * (cardWidth + gap);
                    const top = row * (cardHeight + gap);
                    card.element.style.position = 'absolute';
                    card.element.style.left = `${left}px`;
                    card.element.style.top = `${top}px`;
                    card.appendTo(this.gameBoard.element);
                }
            }
        }
    }

    createCoinText() {
        if (this.gameBoard) {
            this.coin = new Label(`Coins: ${this.coins}`, {
                fontFamily: 'sans-serif',
                fontSize: '45px',
                webkitTextFillColor: 'transparent',
                backgroundImage: 'url(images/vutru.jpeg)',
                webkitBackgroundClip: 'text',
                fontWeight: 'bold',
                transform: 'translate(49%,-120%)',
                width: '300px',
            });

            this.gameBoard.element.appendChild(this.coin.element);
        }
    }

    flipCard(index) {
        if (this.openedCards.length < 2 && !this.openedCards.includes(index)) {
            const card = document.querySelector(`.card[data-index="${index}"]`);
            const image = new Image();
            image.src = `images/${this.shuffledCards[index - 1]}`;

            image.onload = function () {
                card.style.backgroundImage = `url(${image.src})`;
                card.innerHTML = '';
                this.openedCards.push(index);
                if (this.openedCards.length === 2) {
                    setTimeout(this.checkMatch.bind(this), 500);
                }
            }.bind(this);
        }
    }

    checkMatch() {
        const [index1, index2] = this.openedCards;
        const card1 = document.querySelector(`.card[data-index="${index1}"]`);
        const card2 = document.querySelector(`.card[data-index="${index2}"]`);
        if (this.shuffledCards[index1 - 1] === this.shuffledCards[index2 - 1]) {
            card1.removeEventListener('click', this.flipCard);
            card2.removeEventListener('click', this.flipCard);
            this.openedCards = [];
            this.matchedPairs++;
            this.coins += 1000;
            card1.style.visibility = 'hidden';
            card2.style.visibility = 'hidden';
            if (this.matchedPairs === this.shuffledCards.length / 2) {
                this.gameBoard.element.style.display = 'none';
                const winMessage = new Message('Congratulations! You won the game!', 'green');
                document.body.appendChild(winMessage.element); 
                setTimeout(() => {
                    winMessage.element.style.display = 'none';
                    this.gameBoard.element.style.display = 'grid';
                    this.resetGame();
                }, 3000);
            }
        } else {
            setTimeout(() => {
                card1.style.backgroundImage = 'none';
                card2.style.backgroundImage = 'none';
                card1.innerHTML = card1.dataset.initialValue;
                card2.innerHTML = card2.dataset.initialValue;
                this.flipCardBack(index1);
                this.flipCardBack(index2);
            }, 500);
            this.openedCards = [];
            this.coins -= 500;

            if (this.coins <= 0) {
                this.gameBoard.element.style.display = 'none';
                const losingMessage = new Message('Game Over! You ran out of coins.', 'black');
                this.body.appendChild(losingMessage.element);

                setTimeout(() => {
                    losingMessage.element.style.display = 'none';
                    this.gameBoard.element.style.display = 'grid';
                    this.resetGame();
                }, 3000);
            }
        }
        this.updateCoin();
    }

    flipCardBack(index) {
        const card = document.querySelector(`.card[data-index="${index}"]`);
        card.style.backgroundImage = `url(images/front.png)`;
        card.innerHTML = '';
    }

    updateCoin() {
        if (!this.coin) {
            console.error('Coin element not found.');
            return;
        }
        console.log('Current coins:', this.coins);
        this.coin.element.textContent = `Coins: ${this.coins}`;
        this.coin.element.style.fontFamily = 'sans-serif';
        this.coin.element.style.fontSize = '45px';
        this.coin.element.style.webkitTextFillColor = 'transparent';
        const textImg = 'images/vutru.jpeg';
        this.coin.element.style.backgroundImage = `url(${textImg})`;
        this.coin.element.style.webkitBackgroundClip = 'text';
        this.coin.element.style.fontWeight = 'bold';
    }

    getGameBoard() {
        return this.gameBoard;
    }

    resetGame() {
        this.shuffledCards = this.shuffle([...this.allCards]);
        this.openedCards = [];
        this.matchedPairs = 0;
        this.coins = 10000;
        this.createGameBoard();
        this.updateCoin();
    }
}
