import { Game } from './Game.js';
const body = document.body;

body.style.position = 'absolute';
document.documentElement.style.height = '100%';
document.documentElement.style.margin = '0';

const imagePath = 'images/bg.jpg';
body.style.backgroundImage = `url(${imagePath})`;
body.style.backgroundSize = 'cover';
body.style.backgroundRepeat = 'no-repeat';
body.style.backgroundPosition = 'center center';

const game = new Game(body);
const gameBoard = game.getGameBoard();

if (gameBoard) {
    gameBoard.appendTo(document.body);
} else {
    console.error('Unable to get gameBoard from Game instance.');
}
