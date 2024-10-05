// Constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30; // LA RELACION DE 100 con el block size, es decir, si el canvas de largo mide 450 el block size es de 45 Y el heigth del canvas es el doble de el ancho
const BASE_MOVE_GAME_SPEED = 800;
const REFRESH_RATE = 50; // no hace nada
const DECREASING_OF_TIME_PERCENT = 0.15;

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

let board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
let currentPiece = null;
let currentPiecePosition = { x: 0, y: 0 };
let currentPieceName;
let lastMoveDownTime = 0;
let score = 0;
let move_game_speed = BASE_MOVE_GAME_SPEED;

function createNewPiece() {
    const shapes = Object.keys(TETROMINOES);
    const randomShapeName = shapes[Math.floor(Math.random() * shapes.length)];
    currentPiece = TETROMINOES[randomShapeName];
    currentPieceName = randomShapeName;
    currentPiecePosition = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };
}

function drawBoard(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board[y][x]) {
                ctx.fillStyle = board[y][x] === 2 ? 'grey' : "null";
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
                ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function setStyle(ctx) {
    const pieceStyles = tetrisPiecesStyling(currentPieceName);
    ctx.fillStyle = pieceStyles.fill;
    ctx.strokeStyle = pieceStyles.stroke;
    ctx.lineWidth = pieceStyles.strokeWidth;
}

function drawPiece(ctx) {
    setStyle(ctx);
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x]) {
                const blockX = (currentPiecePosition.x + x) * BLOCK_SIZE;
                const blockY = (currentPiecePosition.y + y) * BLOCK_SIZE;

                // Dibuja el relleno
                ctx.fillRect(blockX, blockY, BLOCK_SIZE, BLOCK_SIZE);

                // Dibuja el contorno
                ctx.strokeRect(blockX, blockY, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function isValidMove(piece, position) {
    for (let y = 0; y < piece.length; y++) {
        for (let x = 0; x < piece[y].length; x++) {
            if (piece[y][x]) {
                const newX = position.x + x;
                const newY = position.y + y;
                if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT || (newY >= 0 && board[newY][newX])) {
                    return false;
                }
            }
        }
    }
    return true;
}
// SOUND FX
function playSoundMovement() {
    const movementSound = document.getElementById('movement');
    movementSound.currentTime = 0;
    movementSound.play();
}
function playSoundHardDrop() {
    const harddrop = document.getElementById('harddrop');
    harddrop.currentTime = 0;
    harddrop.play();
}
function playSoundLineCompleted(amountOfLines) {
    if (amountOfLines != 0) {
        let lineCompleted;
        if (amountOfLines == 1) {
            lineCompleted = document.getElementById('lineCompleted');
        }
        else if (amountOfLines == 2) {
            lineCompleted = document.getElementById('lineCompleted2');
        }
        else if (amountOfLines == 3) {
            lineCompleted = document.getElementById('lineCompleted3');
        }
        else if (amountOfLines == 4) {
            lineCompleted = document.getElementById('lineCompleted4');
        }
        lineCompleted.currentTime = 0;
        lineCompleted.play();
    }
}




function movePiece(dx, dy) {
    const newPosition = { x: currentPiecePosition.x + dx, y: currentPiecePosition.y + dy };
    if (isValidMove(currentPiece, newPosition)) {
        currentPiecePosition = newPosition;
        return true;
    }
    return false;
}

function movePiceAllDown() {
    for (i = 0; i < 20; i++) {
        const result = movePiece(0, 1);
        if (!result) {
            break;
        }
    }
    lastMoveDownTime = move_game_speed;

}

function rotatePiece() {
    const rotated = currentPiece[0].map((_, index) =>
        currentPiece.map(row => row[index]).reverse()
    );
    if (isValidMove(rotated, currentPiecePosition)) {
        currentPiece = rotated;
    }
}

function mergePiece() {
    for (let y = 0; y < currentPiece.length; y++) {
        for (let x = 0; x < currentPiece[y].length; x++) {
            if (currentPiece[y][x]) {
                board[currentPiecePosition.y + y][currentPiecePosition.x + x] = 2;
            }
        }
    }
}

function incrementScore(linesCompleted) {
    if (linesCompleted != 1) {
        score = score + ((100 * linesCompleted) * 1.5);
    } else {
        score = score + 100;
    }
}

function checkSpeedMoveGameSpeed() {
    move_game_speed = BASE_MOVE_GAME_SPEED - DECREASING_OF_TIME_PERCENT * (score - 100);
}

function clearLines() {
    let amountOfLinesCompleted = 0;
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        if (board[y].every(cell => cell !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(BOARD_WIDTH).fill(0));
            amountOfLinesCompleted++
            y++;
        }
    }
    playSoundLineCompleted(amountOfLinesCompleted);
    incrementScore(amountOfLinesCompleted);
}

function updateLogs() {
    document.getElementById('score').innerText = score
    document.getElementById('speed').innerText = move_game_speed
}

function gameLoop(timestamp) {
    const canvas = document.getElementById("canvasMap");
    const ctx = canvas.getContext("2d");

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
                // alert("Game Over!");
                return;
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

// Iniciar el ciclo del juego
requestAnimationFrame(gameLoop);

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft': movePiece(-1, 0); playSoundMovement(); break;
        case 'ArrowRight': movePiece(1, 0); playSoundMovement(); break;
        case 'ArrowDown': movePiece(0, 1); playSoundMovement(); break;
        case 'ArrowUp': rotatePiece(); playSoundMovement(); break;
        case ' ': movePiceAllDown(); playSoundHardDrop(); break; // es la barra espaciadora CUALQUIERAAAAAA
    }
});

gameLoop();