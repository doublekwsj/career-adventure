// Web Audio API based sound effects
const Audio = {
    ctx: null,
    enabled: true,
    volume: 0.3,

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            this.enabled = false;
        }
    },

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    play(type) {
        if (!this.enabled || !this.ctx) return;
        this.resume();

        switch (type) {
            case 'jump': this._playTone(440, 0.1, 'square', 600); break;
            case 'coin': this._playCoin(); break;
            case 'block': this._playTone(200, 0.15, 'square', 250); break;
            case 'stomp': this._playTone(150, 0.2, 'sawtooth', 80); break;
            case 'powerup': this._playPowerup(); break;
            case 'trophy': this._playTrophy(); break;
            case 'pipe': this._playTone(100, 0.3, 'sine', 150); break;
            case 'hurt': this._playTone(200, 0.3, 'sawtooth', 100); break;
            case 'boss': this._playBoss(); break;
            case 'victory': this._playVictory(); break;
        }
    },

    _playTone(freq, duration, type, endFreq) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        if (endFreq) osc.frequency.linearRampToValueAtTime(endFreq, this.ctx.currentTime + duration);
        gain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    },

    _playCoin() {
        this._playTone(988, 0.05, 'square', 988);
        setTimeout(() => this._playTone(1319, 0.15, 'square', 1319), 60);
    },

    _playPowerup() {
        const notes = [523, 659, 784, 1047];
        notes.forEach((f, i) => {
            setTimeout(() => this._playTone(f, 0.1, 'square', f), i * 80);
        });
    },

    _playTrophy() {
        const notes = [523, 659, 784, 1047, 1319, 1568];
        notes.forEach((f, i) => {
            setTimeout(() => this._playTone(f, 0.15, 'square', f), i * 100);
        });
    },

    _playBoss() {
        const notes = [196, 185, 175, 165];
        notes.forEach((f, i) => {
            setTimeout(() => this._playTone(f, 0.2, 'sawtooth', f * 0.8), i * 200);
        });
    },

    _playVictory() {
        const notes = [523, 523, 523, 523, 415, 466, 523, 466, 523];
        const durations = [0.1, 0.1, 0.1, 0.3, 0.3, 0.3, 0.2, 0.1, 0.5];
        let time = 0;
        notes.forEach((f, i) => {
            setTimeout(() => this._playTone(f, durations[i], 'square', f), time);
            time += durations[i] * 800;
        });
    }
};
