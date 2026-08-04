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

// PLAYER INPUT CAPUTRE EVENTS ////////
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft': movePiece(-1, 0); playSoundMovement(); break;
        case 'ArrowRight': movePiece(1, 0); playSoundMovement(); break;
        case 'ArrowDown': movePiece(0, 1); playSoundMovement(); break;
        case 'ArrowUp': rotatePiece(); playSoundMovement(); break;
        case ' ': movePiceAllDown(); playSoundHardDrop(); break; // ' ' es la barra espaciadora 
        case 'Escape': pauseGame(); break;
    }
});

document.addEventListener('click', (event) => {
    switch (event.target.id) {
        case 'play':
            startGame();
            break;
        case 'restart':
            resetGame();
            break;
    }
})
