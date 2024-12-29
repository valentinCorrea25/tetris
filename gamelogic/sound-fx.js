
function playSoundMovement() {
    const movementSound = document.getElementById('movement');
    movementSound.volume = sound_volume;
    movementSound.currentTime = 0;
    movementSound.play();
}

function playSoundHardDrop() {
    const harddrop = document.getElementById('harddrop');
    harddrop.volume = sound_volume;
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
        lineCompleted.volume = sound_volume;
        lineCompleted.currentTime = 0;
        lineCompleted.play();
    }
}
function playSoundPause(isPaused) {
    const sound = document.getElementById(isPaused ? 'pause' : 'unpause');
    sound.volume = sound_volume;
    sound.currentTime = 0;
    sound.play();
}