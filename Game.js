import { Node } from './Engine/Node.js';
import { Card } from './Card.js';
import { Label } from './Engine/Label.js';
export class Game {
    constructor(body) {
        this.gameBoard = new Node('div', 'game-board');
        this.allCards = this.getAllCards();
        this.coins = 10000;
        this.openedCards = [];
        this.matchedPairs = 0;
        this.body = body;
        this.flipsThisTurn = 0;
        this.currentlyFlipped = []
        this.playButton = new Node('button', 'play-button');
        this.playButton.element.textContent = 'Play Game';
        this.playButton.element.style.position = 'absolute';
        this.playButton.element.style.width = '300px';
        this.playButton.element.style.fontSize = '45px';
        this.playButton.element.style.fontFamily = 'cursive';
        this.playButton.element.style.backgroundColor = 'transparent';
        this.playButton.element.style.border = 'none';
        this.playButton.element.style.left = `${window.innerWidth / 2.5}px`;
        this.playButton.element.style.top = `${window.innerHeight / 1.5}px`;
        this.playButton.element.addEventListener('click', () => this.startGame());
        document.body.appendChild(this.playButton.element);
        this.isFlipping = false;
    }

    startGame() {
        this.createGameBoard();
        this.playButton.element.style.display = 'none';
        this.gameBoard.element.style.display = 'grid';

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
        const initialCardZIndex = -1
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const index = row * cols + col;
                if (index < this.allCards.length) {
                    const cardNumber = index + 1;
                    const frontImagePath = 'front.png';
                    const card = new Card(cardNumber, frontImagePath, this.allCards[index], this.flipCard.bind(this));
                    card.setBackgroundImage();
                    card.element.style.position = 'absolute';
                    card.element.style.left = `${windowWidth / 8}px`
                    card.element.style.top = `${windowHeight / 5}px`
                    this.gameBoard.element.appendChild(card.element);
                    card.element.style.zIndex = initialCardZIndex;
                    gsap.to(card.element, {
                        left: col * (cardWidth + gap),
                        top: row * (cardHeight + gap),
                        duration: 1,
                        delay: 0.1 * index,
                        onStart: () => {
                            card.element.style.zIndex = 'auto';
                        },
                    });

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
        if (this.currentlyFlipped.length < 2 && !this.currentlyFlipped.includes(index) && !this.openedCards.includes(index) && !this.isFlipping) {
            this.isFlipping = true;
            const card = document.querySelector(`.card[data-index="${index}"]`);
            const image = new Image();
            image.src = `images/${this.allCards[index - 1]}`;

            image.onload = function () {
                gsap.to(card, { scaleX: 0, onComplete: () => this.finishFlip(card, image.src, index) });
            }.bind(this);
        }
    }
    finishFlip(card, imageUrl, index) {
        card.style.backgroundImage = `url(${imageUrl})`;
        gsap.to(card, { scaleX: 1, duration: 0.5 });
        card.innerHTML = '';
        this.openedCards.push(index);
        this.currentlyFlipped.push(index);
        this.isFlipping = false;
        if (this.currentlyFlipped.length === 2) {
            const startTime = performance.now();
            const checkMatchAfterDelay = (timestamp) => {
                if (timestamp - startTime < 1000) {
                    requestAnimationFrame(checkMatchAfterDelay);
                } else {
                    this.checkMatch();
                }
            };
            requestAnimationFrame(checkMatchAfterDelay);
        }
    }

    checkMatch() {
        const [index1, index2] = this.currentlyFlipped;
        const card1 = document.querySelector(`.card[data-index="${index1}"]`);
        const card2 = document.querySelector(`.card[data-index="${index2}"]`);

        if (this.allCards[index1 - 1] === this.allCards[index2 - 1]) {
            card1.removeEventListener('click', () => this.flipCard(index1));
            card2.removeEventListener('click', () => this.flipCard(index2));
            this.openedCards = [];
            this.currentlyFlipped = [];
            this.matchedPairs++;
            this.coins += 1000;
            gsap.to(card1, {
                scale: 2, opacity: 0,
                duration: 1,
                onComplete: () => {
                    card1.style.visibility = 'hidden';
                },
            });
            gsap.to(card2, {
                scale: 2,
                opacity: 0,
                duration: 1,
                onComplete: () => {
                    card2.style.visibility = 'hidden';
                    if (this.matchedPairs === this.allCards.length / 2) {
                        gsap.to({}, {
                            onComplete: () => {
                                this.gameBoard.element.style.display = 'none';
                                const winMessage = Label.createMessage(`Congratulations! You won the game with ${this.coins} Coins!`, 'green');
                                document.body.appendChild(winMessage.element);
                                gsap.to(winMessage.element, {
                                    duration: 3,
                                    onComplete: () => {
                                        winMessage.element.style.display = 'none';
                                        this.gameBoard.element.style.display = 'grid';
                                        this.resetGame();
                                    },
                                });
                            },
                        });
                    }
                },
            });
        } else {
            this.flipCardBackHandler(index1);
            gsap.to({}, {
                duration: 0, onComplete: () => {
                    this.flipCardBackHandler(index2);
                    this.openedCards = [];
                    this.currentlyFlipped = [];
                    if (this.openedCards.length === 2) {
                        this.openedCards = [];
                    }
                    this.openedCards = [];
                    this.coins -= 500;
                }
            });

            if (this.coins <= 0) {
                this.gameBoard.element.style.display = 'none';
                const losingMessage = Label.createMessage('Game Over! You ran out of coins.', 'black');
                this.body.appendChild(losingMessage.element);

                const hideMessage = () => {
                    losingMessage.element.style.display = 'none';
                    this.gameBoard.element.style.display = 'grid';
                    this.resetGame();
                };
                const start = performance.now();

                const animate = (timestamp) => {
                    if (timestamp - start < 3000) {
                        requestAnimationFrame(animate);
                    } else {
                        hideMessage();
                    }
                };
                requestAnimationFrame(animate);
            }
        }
        this.updateCoin();

    }
    flipCardBackHandler(index) {
        const card = document.querySelector(`.card[data-index="${index}"]`);
        gsap.to(card, { scaleX: 0, duration: 0.5, onComplete: () => this.finishFlipBack(card) });
    }

    finishFlipBack(card) {
        card.style.backgroundImage = 'url(images/front.png)';
        gsap.to(card, { scaleX: 1, duration: 0.5 });
        card.innerHTML = '';
        this.openedCards.pop();
        this.flipsThisTurn--;
    }

    updateCoin() {
        if (!this.coin) {
            console.error('Coin element not found.');
            return;
        }
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
        this.allCards = this.getAllCards();
        this.openedCards = [];
        this.matchedPairs = 0;
        this.coins = 10000;
        this.createGameBoard();
        this.updateCoin();
    }
}