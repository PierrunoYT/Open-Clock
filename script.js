let stopwatchInterval;
let stopwatchRunning = false;
let stopwatchTime = 0;
let lapTimes = [];
let lapStart = 0;

const stopwatchDisplay = document.getElementById('stopwatch-display');
const startStopButton = document.getElementById('start-stop');
const lapResetButton = document.getElementById('lap-reset');
const lapTimesDisplay = document.getElementById('lap-times');
const themeToggleButton = document.getElementById('theme-toggle');

function toggleTheme() {
    document.body.classList.toggle('light-mode');
    const isLightMode = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
}

themeToggleButton.addEventListener('click', toggleTheme);

// Set initial theme based on user's preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
}

function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
}

function updateStopwatch() {
    stopwatchTime += 10;
    stopwatchDisplay.textContent = formatTime(stopwatchTime);
}

function updateLapTimes() {
    lapTimesDisplay.innerHTML = '';
    lapTimes.forEach((lap, index) => {
        const lapElement = document.createElement('div');
        lapElement.textContent = `Lap ${lapTimes.length - index}: ${formatTime(lap)}`;
        lapTimesDisplay.appendChild(lapElement);
    });
}

startStopButton.addEventListener('click', () => {
    if (stopwatchRunning) {
        clearInterval(stopwatchInterval);
        startStopButton.textContent = 'Start';
        startStopButton.classList.remove('stop');
        lapResetButton.textContent = 'Reset';
    } else {
        stopwatchInterval = setInterval(updateStopwatch, 10);
        startStopButton.textContent = 'Stop';
        startStopButton.classList.add('stop');
        lapResetButton.textContent = 'Lap';
        if (stopwatchTime === 0) {
            lapStart = 0;
        }
    }
    stopwatchRunning = !stopwatchRunning;
});

lapResetButton.addEventListener('click', () => {
    if (stopwatchRunning) {
        const lapTime = stopwatchTime - lapStart;
        lapTimes.unshift(lapTime);
        lapStart = stopwatchTime;
        updateLapTimes();
    } else {
        clearInterval(stopwatchInterval);
        stopwatchTime = 0;
        lapStart = 0;
        lapTimes = [];
        stopwatchDisplay.textContent = formatTime(stopwatchTime);
        updateLapTimes();
    }
});
