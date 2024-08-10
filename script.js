// Current Time
function updateCurrentTime() {
    const currentTimeElement = document.getElementById('current-time');
    const now = new Date();
    currentTimeElement.textContent = now.toLocaleTimeString();
}

setInterval(updateCurrentTime, 1000);
updateCurrentTime();

// Stopwatch
let stopwatchInterval;
let stopwatchRunning = false;
let stopwatchTime = 0;

const stopwatchDisplay = document.getElementById('stopwatch-display');
const startStopButton = document.getElementById('start-stop');
const resetButton = document.getElementById('reset');

function formatTime(ms) {
    const date = new Date(ms);
    return date.toISOString().substr(11, 8);
}

function updateStopwatch() {
    stopwatchTime += 1000;
    stopwatchDisplay.textContent = formatTime(stopwatchTime);
}

startStopButton.addEventListener('click', () => {
    if (stopwatchRunning) {
        clearInterval(stopwatchInterval);
        startStopButton.textContent = 'Start';
    } else {
        stopwatchInterval = setInterval(updateStopwatch, 1000);
        startStopButton.textContent = 'Stop';
    }
    stopwatchRunning = !stopwatchRunning;
});

resetButton.addEventListener('click', () => {
    clearInterval(stopwatchInterval);
    stopwatchTime = 0;
    stopwatchDisplay.textContent = formatTime(stopwatchTime);
    startStopButton.textContent = 'Start';
    stopwatchRunning = false;
});
