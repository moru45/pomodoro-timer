class PomodoroTimer {
    constructor() {
        this.timer = document.getElementById('timer');
        this.startBtn = document.getElementById('startBtn');
        this.stopBtn = document.getElementById('stopBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.pomodoroBtn = document.getElementById('pomodoroBtn');
        this.shortBreakBtn = document.getElementById('shortBreakBtn');
        this.longBreakBtn = document.getElementById('longBreakBtn');
        this.pomodoroSlider = document.getElementById('pomodoroSlider');
        this.shortBreakSlider = document.getElementById('shortBreakSlider');
        this.longBreakSlider = document.getElementById('longBreakSlider');
        this.pomodoroValue = document.getElementById('pomodoroValue');
        this.shortBreakValue = document.getElementById('shortBreakValue');
        this.longBreakValue = document.getElementById('longBreakValue');
        this.alarm = document.getElementById('alarm');
        this.stopAlarmBtn = document.getElementById('stopAlarmBtn');
        this.resetTimeBtn = document.getElementById('resetTimeBtn');
        this.isAlarmPlaying = false; // アラームが鳴っているかどうかのフラグ

        this.isRunning = false;
        this.timeLeft = 1500; // 25分（ポモドーロ時間）
        this.interval = null;
        this.defaultTimes = {
            pomodoro: 25,
            shortBreak: 5,
            longBreak: 15
        };
        this.currentTimes = { ...this.defaultTimes };

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.stopBtn.addEventListener('click', () => this.stop());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.pomodoroBtn.addEventListener('click', () => this.setMode('pomodoro'));
        this.shortBreakBtn.addEventListener('click', () => this.setMode('shortBreak'));
        this.longBreakBtn.addEventListener('click', () => this.setMode('longBreak'));
        
        // スライダーのイベントリスナー
        this.pomodoroSlider.addEventListener('input', () => {
            this.currentTimes.pomodoro = parseInt(this.pomodoroSlider.value);
            this.pomodoroValue.textContent = `${this.pomodoroSlider.value}分`;
            if (this.getActiveMode() === 'pomodoro' && !this.isRunning) {
                this.timeLeft = this.currentTimes.pomodoro * 60;
                this.updateTimerDisplay();
            }
        });

        this.shortBreakSlider.addEventListener('input', () => {
            this.currentTimes.shortBreak = parseInt(this.shortBreakSlider.value);
            this.shortBreakValue.textContent = `${this.shortBreakSlider.value}分`;
            if (this.getActiveMode() === 'shortBreak' && !this.isRunning) {
                this.timeLeft = this.currentTimes.shortBreak * 60;
                this.updateTimerDisplay();
            }
        });

        this.longBreakSlider.addEventListener('input', () => {
            this.currentTimes.longBreak = parseInt(this.longBreakSlider.value);
            this.longBreakValue.textContent = `${this.longBreakSlider.value}分`;
            if (this.getActiveMode() === 'longBreak' && !this.isRunning) {
                this.timeLeft = this.currentTimes.longBreak * 60;
                this.updateTimerDisplay();
            }
        });

        // アラームを止めるボタンのイベントリスナー
        this.stopAlarmBtn.addEventListener('click', () => {
            this.alarm.pause();
            this.alarm.currentTime = 0;
            this.isAlarmPlaying = false;
            this.stopAlarmBtn.style.display = 'none';
        });

        // デフォルト値に戻すボタンのイベントリスナー
        this.resetTimeBtn.addEventListener('click', () => {
            // スライダーの値をデフォルト値に戻す
            this.pomodoroSlider.value = this.defaultTimes.pomodoro;
            this.shortBreakSlider.value = this.defaultTimes.shortBreak;
            this.longBreakSlider.value = this.defaultTimes.longBreak;
    
            // スライダーの値を反映
            this.currentTimes.pomodoro = this.defaultTimes.pomodoro;
            this.currentTimes.shortBreak = this.defaultTimes.shortBreak;
            this.currentTimes.longBreak = this.defaultTimes.longBreak;
            
            // 表示テキストをデフォルト値に戻す
            this.pomodoroValue.textContent = `${this.defaultTimes.pomodoro}分`;
            this.shortBreakValue.textContent = `${this.defaultTimes.shortBreak}分`;
            this.longBreakValue.textContent = `${this.defaultTimes.longBreak}分`;
            
            // 現在のモードに応じてタイマーをリセット
            if (!this.isRunning) {
                this.timeLeft = this.getCurrentModeTime();
                this.updateTimerDisplay();
            }
        });    
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
                this.isAlarmPlaying = true;
                this.stopAlarmBtn.style.display = 'inline-block';
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
        return this.currentTimes[mode] * 60;
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