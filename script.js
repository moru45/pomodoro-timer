class PomodoroTimer {
    constructor() {
        this.timer = document.getElementById('timer');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.pomodoroBtn = document.getElementById('pomodoroBtn');
        this.shortBreakBtn = document.getElementById('shortBreakBtn');
        this.longBreakBtn = document.getElementById('longBreakBtn');
        this.alarm = document.getElementById('alarm');

        this.isRunning = false;
        this.timeLeft = 1500; // 25分（ポモドーロ時間）
        this.interval = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.pomodoroBtn.addEventListener('click', () => this.setMode('pomodoro'));
        this.shortBreakBtn.addEventListener('click', () => this.setMode('shortBreak'));
        this.longBreakBtn.addEventListener('click', () => this.setMode('longBreak'));
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.stopBtn.disabled = false;
        this.resetBtn.disabled = true;

        this.interval = setInterval(() => {
            if (this.timeLeft <= 0) {
                this.stop();
                this.alarm.play();
                return;
            }
            
            this.timeLeft--;
            this.updateTimerDisplay();
        }, 1000);
    }

    stop() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        clearInterval(this.interval);
        
        this.startBtn.disabled = false;
        this.stopBtn.disabled = true;
        this.resetBtn.disabled = false;
    }

    reset() {
        this.stop();
        this.timeLeft = this.getCurrentModeTime();
        this.updateTimerDisplay();
    }

    setMode(mode) {
        this.stop();
        this.timeLeft = this.getCurrentModeTime(mode);
        this.updateTimerDisplay();
        
        // モードボタンのアクティブ状態を更新
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${mode}Btn`).classList.add('active');
    }

    getCurrentModeTime(mode) {
        mode = mode || this.getActiveMode();
        switch (mode) {
            case 'pomodoro':
                return 1500; // 25分
            case 'shortBreak':
                return 300; // 5分
            case 'longBreak':
                return 900; // 15分
            default:
                return 1500; // デフォルトはポモドーロ
        }
    }

    getActiveMode() {
        return document.querySelector('.mode-btn.active').id.replace('Btn', '');
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// アラーム音を追加
const audio = new Audio();
audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
audio.loop = false;
document.getElementById('alarm').src = audio.src;

// タイマーの初期化
const timer = new PomodoroTimer();
