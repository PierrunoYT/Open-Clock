// Global variables
let stopwatchInterval, timerInterval, alarmTimeout;
let stopwatchRunning = false;
let stopwatchTime = 0;
let lapTimes = [];
let lapStart = 0;
let timerTime = 0;
let alarmTime = null;

// DOM elements
const currentTimeDisplay = document.getElementById('current-time');
const stopwatchDisplay = document.getElementById('stopwatch-display');
const startStopButton = document.getElementById('start-stop');
const lapResetButton = document.getElementById('lap-reset');
const lapTimesDisplay = document.getElementById('lap-times');
const themeToggleButton = document.getElementById('theme-toggle');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const timerDisplay = document.getElementById('timer-display');
const timerStartButton = document.getElementById('timer-start');
const timerResetButton = document.getElementById('timer-reset');
const alarmDisplay = document.getElementById('alarm-display');
const alarmSetButton = document.getElementById('alarm-set');
const alarmClearButton = document.getElementById('alarm-clear');

// Theme toggle
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

// Tab functionality
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        button.classList.add('active');
        document.getElementById(button.dataset.tab).classList.add('active');
    });
});

// Time formatting functions
function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
}

function formatTimerTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Current time display
function updateCurrentTime() {
    const now = new Date();
    currentTimeDisplay.textContent = now.toLocaleTimeString();
}

setInterval(updateCurrentTime, 1000);
updateCurrentTime();

// Stopwatch functionality
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

// Timer functionality
function updateTimer() {
    if (timerTime > 0) {
        timerTime--;
        timerDisplay.textContent = formatTimerTime(timerTime);
    } else {
        clearInterval(timerInterval);
        timerStartButton.textContent = 'Start';
        alert('Timer finished!');
    }
}

timerStartButton.addEventListener('click', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerStartButton.textContent = 'Start';
    } else {
        const hours = parseInt(document.getElementById('hours').value) || 0;
        const minutes = parseInt(document.getElementById('minutes').value) || 0;
        const seconds = parseInt(document.getElementById('seconds').value) || 0;
        timerTime = hours * 3600 + minutes * 60 + seconds;
        if (timerTime > 0) {
            timerInterval = setInterval(updateTimer, 1000);
            timerStartButton.textContent = 'Pause';
        }
    }
});

timerResetButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerTime = 0;
    timerDisplay.textContent = '00:00:00';
    timerStartButton.textContent = 'Start';
    document.getElementById('hours').value = '';
    document.getElementById('minutes').value = '';
    document.getElementById('seconds').value = '';
});

// Alarm functionality
function updateAlarmDisplay() {
    if (alarmTime) {
        const now = new Date();
        const timeUntilAlarm = alarmTime - now;
        if (timeUntilAlarm > 0) {
            const hours = Math.floor(timeUntilAlarm / (1000 * 60 * 60));
            const minutes = Math.floor((timeUntilAlarm % (1000 * 60 * 60)) / (1000 * 60));
            alarmDisplay.textContent = `Alarm in ${hours}h ${minutes}m`;
        } else {
            alarmDisplay.textContent = 'Alarm!';
            alert('Alarm!');
            clearAlarm();
        }
    } else {
        alarmDisplay.textContent = 'No alarm set';
    }
}

function setAlarm() {
    const alarmTimeInput = document.getElementById('alarm-time').value;
    if (alarmTimeInput) {
        const [hours, minutes] = alarmTimeInput.split(':');
        const now = new Date();
        alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
        if (alarmTime <= now) {
            alarmTime.setDate(alarmTime.getDate() + 1);
        }
        updateAlarmDisplay();
        alarmTimeout = setTimeout(() => {
            updateAlarmDisplay();
        }, alarmTime - now);
    }
}

function clearAlarm() {
    alarmTime = null;
    clearTimeout(alarmTimeout);
    updateAlarmDisplay();
}

alarmSetButton.addEventListener('click', setAlarm);
alarmClearButton.addEventListener('click', clearAlarm);

// Update alarm display every minute
setInterval(updateAlarmDisplay, 60000);
