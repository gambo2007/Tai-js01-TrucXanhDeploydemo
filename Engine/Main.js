import { Game } from './Game.js';
const body = document.body;

body.style.position = 'absolute';
document.documentElement.style.height = '100%';
document.documentElement.style.margin = '0';

const imagePath = 'images/bg.jpeg';
body.style.backgroundImage = `url(${imagePath})`;
body.style.backgroundSize = 'cover';
body.style.backgroundRepeat = 'no-repeat';
body.style.backgroundPosition = 'center center';

// const backgroundMusic = new Audio('music/music.mp3');
// backgroundMusic.loop = true;
// backgroundMusic.volume = 1;
// backgroundMusic.addEventListener('canplaythrough', () => {
//     backgroundMusic.play();
// });
// document.addEventListener('click', () => {
//     backgroundMusic.play();
// });
// body.appendChild(backgroundMusic);

const game = new Game(body);
const gameBoard = game.getGameBoard();

if (gameBoard) {
    gameBoard.appendTo(document.body);
} else {
    console.error('Unable to get gameBoard from Game instance.');
}
