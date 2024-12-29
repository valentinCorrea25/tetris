// Constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30; // LA RELACION DE 100 con el block size, es decir, si el canvas de largo mide 450 el block size es de 45 Y el heigth del canvas es el doble de el ancho
const BASE_MOVE_GAME_SPEED = 800;
const REFRESH_RATE = 50; // no hace nada
const DECREASING_OF_TIME_PERCENT = 0.15;
const canvas = document.getElementById("canvasMap");
const ctx = canvas.getContext("2d");

// let sound_volume = 0.025;
let isPaused = false;
let gameStart = false;

const INITIAL_DIFFICULT = [700, 500, 300];

const TETROMINOES = {
    square: [[1, 1],
    [1, 1]],
    snake: [[0, 1, 1],
    [1, 1, 0]],
    snakeInverse: [[1, 1, 0],
    [0, 1, 1]],
    stick: [[1],
    [1],
    [1],
    [1]],
    elle: [[1, 0],
    [1, 0],
    [1, 1]],
    elleInverse: [[0, 1],
    [0, 1],
    [1, 1]],
    tee: [[0, 1, 0],
    [1, 1, 1]]
};

let board = initializeBoard();
let currentPiece = null;
let currentPiecePosition = { x: 0, y: 0 };
let currentPieceName;
let lastMoveDownTime = 0;
let score = 0;
let move_game_speed = BASE_MOVE_GAME_SPEED;

// INIT GAME CONFIG //////
function initializeBoard() {
    return Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
}
function setStyle(ctx) {
    const pieceStyles = tetrisPiecesStyling(currentPieceName);
    ctx.fillStyle = pieceStyles.fill;
    ctx.strokeStyle = pieceStyles.stroke;
    ctx.lineWidth = pieceStyles.strokeWidth;
}


// GAME FUNCTIONS /////////
function pauseGame() {
    if (!gameStart) {
        return
    }
    isPaused = !isPaused;
    requestAnimationFrame(gameLoop);

    // Mostrar cartel de pause
    document.querySelector("#paused-message").style.display = isPaused ? 'inline' : 'none';
    playSoundPause(isPaused);
}

function startGame() {
    gameStart = true;
    document.getElementById('menu').style.display = 'none';
    requestAnimationFrame(gameLoop);
}

function resetGame() {
    board = initializeBoard();
    currentPiece = null;
    currentPiecePosition = { x: Math.floor(BOARD_WIDTH / 2), y: 0 };
    lastMoveDownTime = 0;
    move_game_speed = BASE_MOVE_GAME_SPEED;
    score = 0;
    gameStart = true;
    isPaused = false;

    document.getElementById('menu').style.display = 'none';
    document.getElementById('menu-gameover').style.display = 'none';
    document.querySelector("#paused-message").style.display = 'none';

    createNewPiece();
    drawBoard(ctx);
    drawPiece(ctx);

    requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
    if (!isPaused && gameStart) {
        if (!currentPiece) {
            createNewPiece();
        }
        updateLogs();
        if (timestamp - lastMoveDownTime >= move_game_speed) {
            if (!movePiece(0, 1)) {
                mergePiece();
                clearLines();
                createNewPiece();
                if (!isValidMove(currentPiece, currentPiecePosition)) {
                    document.getElementById('menu-gameover').style.display = 'inline';
                    gameStart = false;
                }
            }
            lastMoveDownTime = timestamp;
        }
        drawBoard(ctx);
        drawPiece(ctx);
        checkSpeedMoveGameSpeed();

        // Solicitar la siguiente actualización del ciclo del juego
        setTimeout(() => {
            requestAnimationFrame(gameLoop);
        }, REFRESH_RATE);
    }
}

