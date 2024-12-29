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
    if (!piece) {
        console.log("Invalid piece passed to isValidMove:", piece);
        return false;
    }
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
