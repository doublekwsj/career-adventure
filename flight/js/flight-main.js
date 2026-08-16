// ===== FLIGHT MAIN =====
const FlightGame = {
    canvas: null, ctx: null,
    W: 400, H: 640,
    state: 'title', // title, stageIntro, playing, bossWarning, boss, stageClear, ending, gameOver
    player: null,
    enemies: [], playerBullets: [], enemyBullets: [], powerups: [],
    boss: null,
    currentStage: 0,
    waveTimer: 0, waveIndex: 0,
    stageTimer: 0,
    careerPopup: null, // { text, timer }
    stageAchievements: [], // collected this stage
    flash: { timer: 0, color: '#fff' },
    shake: { x: 0, y: 0, timer: 0, intensity: 0 },
    slowMotion: 0,
    bgLayers: [],
    keys: { left: false, right: false, up: false, down: false, fire: false, bomb: false },
    isMobile: false,
    touchX: -1, touchY: -1, touching: false,
    combo: 0, achievementsCollected: 0,

    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = this.W;
        this.canvas.height = this.H;
        this.isMobile = ('ontouchstart' in window || navigator.maxTouchPoints > 0);
        this._setupInput();
        this._initBg();
        this._resize();
        window.addEventListener('resize', () => this._resize());
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        requestAnimationFrame((t) => this.loop(t));
    },

    _resize() {
        const maxW = this.W, maxH = this.H;
        const ratio = maxW / maxH;
        let w = window.innerWidth, h = window.innerHeight;
        if (this.isMobile) h -= 60;
        if (w / h > ratio) w = h * ratio; else h = w / ratio;
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';
    },

    _initBg() {
        this.bgLayers = [];
        for (let layer = 0; layer < 4; layer++) {
            const stars = [];
            const count = [100, 50, 25, 10][layer];
            for (let i = 0; i < count; i++) {
                stars.push({ x: Math.random() * this.W, y: Math.random() * this.H, size: 1 + layer * 0.5 + Math.random(), speed: 0.3 + layer * 0.5 });
            }
            this.bgLayers.push(stars);
        }
    },

    _setupInput() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = true;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = true;
            if (e.code === 'ArrowUp' || e.code === 'KeyW') this.keys.up = true;
            if (e.code === 'ArrowDown' || e.code === 'KeyS') this.keys.down = true;
            if (e.code === 'KeyZ' || e.code === 'Space') this.keys.fire = true;
            if (e.code === 'KeyX') this.keys.bomb = true;
            if (this.state === 'title' && (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyZ')) { this._resumeAudio(); this.startGame(); }
            if (this.state === 'gameOver' && (e.code === 'Space' || e.code === 'Enter')) { this.state = 'title'; }
            if (this.state === 'ending' && (e.code === 'Space' || e.code === 'Enter')) { this.state = 'title'; }
        });
        document.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowLeft' || e.code === 'KeyA') this.keys.left = false;
            if (e.code === 'ArrowRight' || e.code === 'KeyD') this.keys.right = false;
            if (e.code === 'ArrowUp' || e.code === 'KeyW') this.keys.up = false;
            if (e.code === 'ArrowDown' || e.code === 'KeyS') this.keys.down = false;
            if (e.code === 'KeyZ' || e.code === 'Space') this.keys.fire = false;
            if (e.code === 'KeyX') this.keys.bomb = false;
        });
        // Touch
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this._resumeAudio();
            if (this.state === 'title') { this.startGame(); return; }
            if (this.state === 'gameOver' || this.state === 'ending') { this.state = 'title'; return; }
            this.touching = true;
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.W / rect.width, scaleY = this.H / rect.height;
            this.touchX = (e.touches[0].clientX - rect.left) * scaleX;
            this.touchY = (e.touches[0].clientY - rect.top) * scaleY;
        });
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const scaleX = this.W / rect.width, scaleY = this.H / rect.height;
            this.touchX = (e.touches[0].clientX - rect.left) * scaleX;
            this.touchY = (e.touches[0].clientY - rect.top) * scaleY;
        });
        this.canvas.addEventListener('touchend', (e) => { e.preventDefault(); this.touching = false; });
        // Bomb button
        const bombBtn = document.getElementById('bomb-btn');
        if (bombBtn) {
            bombBtn.addEventListener('touchstart', (e) => { e.preventDefault(); e.stopPropagation(); this.keys.bomb = true; });
            bombBtn.addEventListener('touchend', (e) => { e.preventDefault(); this.keys.bomb = false; });
        }
    },

    _resumeAudio() { if (this.audioCtx && this.audioCtx.state === 'suspended') this.audioCtx.resume(); },

    playSound(type) {
        if (!this.audioCtx) return;
        const ctx = this.audioCtx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        const now = ctx.currentTime;
        switch (type) {
            case 'shoot': osc.frequency.value = 800; gain.gain.setValueAtTime(0.05, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05); osc.type = 'square'; break;
            case 'explode': osc.frequency.value = 200; gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3); osc.type = 'sawtooth'; break;
            case 'powerup': osc.frequency.setValueAtTime(400, now); osc.frequency.exponentialRampToValueAtTime(1200, now + 0.15); gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2); osc.type = 'sine'; break;
            case 'bomb': osc.frequency.value = 60; gain.gain.setValueAtTime(0.3, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8); osc.type = 'sawtooth'; break;
            case 'hit': osc.frequency.value = 150; gain.gain.setValueAtTime(0.1, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1); osc.type = 'square'; break;
            case 'boss': osc.frequency.setValueAtTime(100, now); osc.frequency.exponentialRampToValueAtTime(50, now + 0.5); gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6); osc.type = 'sawtooth'; break;
            case 'warning': osc.frequency.setValueAtTime(880, now); osc.frequency.setValueAtTime(440, now + 0.2); osc.frequency.setValueAtTime(880, now + 0.4); gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6); osc.type = 'square'; break;
        }
        osc.start(now); osc.stop(now + 1);
    },

    startGame() {
        this.player = new Player(this.W, this.H);
        this.enemies = []; this.playerBullets = []; this.enemyBullets = []; this.powerups = [];
        this.boss = null;
        this.currentStage = 0; this.waveTimer = 0; this.waveIndex = 0;
        this.achievementsCollected = 0;
        this.careerPopup = null;
        this.stageAchievements = [];
        Effects.clear();
        this.state = 'stageIntro';
        this.stageTimer = 240; // longer intro to read career info
    },

    startStage() {
        this.enemies = []; this.enemyBullets = []; this.powerups = [];
        this.boss = null;
        this.waveTimer = 60; this.waveIndex = 0;
        this.player.stageLevel = this.currentStage;
        this.stageAchievements = [];
        this.state = 'playing';
    },

    // ===== MAIN LOOP =====
    loop(timestamp) {
        const dt = this.slowMotion > 0 ? 0.3 : 1;
        if (this.slowMotion > 0) this.slowMotion--;
        this.update(dt);
        this.render();
        requestAnimationFrame((t) => this.loop(t));
    },

    update(dt) {
        this._updateBg();
        if (this.flash.timer > 0) this.flash.timer--;
        if (this.shake.timer > 0) { this.shake.timer--; this.shake.x = (Math.random() - 0.5) * this.shake.intensity; this.shake.y = (Math.random() - 0.5) * this.shake.intensity; }
        else { this.shake.x = 0; this.shake.y = 0; }

        if (this.state === 'title' || this.state === 'gameOver' || this.state === 'ending') return;

        if (this.state === 'stageIntro') {
            this.stageTimer--;
            if (this.stageTimer <= 0) this.startStage();
            return;
        }

        if (this.state === 'stageClear') {
            this.stageTimer--;
            if (this.stageTimer <= 0) {
                this.currentStage++;
                if (this.currentStage >= STAGES.length) { this.state = 'ending'; }
                else { this.state = 'stageIntro'; this.stageTimer = 240; }
            }
            return;
        }

        // Career popup (brief pause to show achievement text)
        if (this.careerPopup) {
            this.careerPopup.timer--;
            if (this.careerPopup.timer <= 0) this.careerPopup = null;
            return; // pause game while showing
        }

        if (this.state === 'bossWarning') {
            this.stageTimer--;
            if (this.stageTimer <= 0) { this.boss = new Boss(this.currentStage, this.W); this.state = 'boss'; this.playSound('boss'); }
            return;
        }

        // Touch control → move player
        if (this.touching && this.player) {
            const dx = this.touchX - (this.player.x + this.player.w / 2);
            const dy = (this.touchY - 60) - (this.player.y + this.player.h / 2);
            if (Math.abs(dx) > 3) this.player.x += Math.sign(dx) * Math.min(Math.abs(dx) * 0.15, this.player.speed);
            if (Math.abs(dy) > 3) this.player.y += Math.sign(dy) * Math.min(Math.abs(dy) * 0.15, this.player.speed);
            this.player.x = Math.max(0, Math.min(this.W - this.player.w, this.player.x));
            this.player.y = Math.max(0, Math.min(this.H - this.player.h, this.player.y));
        }

        // Player update
        if (!this.touching) this.player.update(this.keys);
        else this.player.update({ left: false, right: false, up: false, down: false });

        // Fire (auto on mobile)
        if ((this.keys.fire || this.touching) && this.player) {
            const newBullets = this.player.fire();
            if (newBullets.length > 0) { this.playerBullets.push(...newBullets); this.playSound('shoot'); }
        }

        // Bomb
        if (this.keys.bomb && this.player && this.player.bombs > 0) {
            this.keys.bomb = false;
            this.player.bombs--;
            this._doBomb();
        }

        // Player bullets
        for (let i = this.playerBullets.length - 1; i >= 0; i--) {
            const b = this.playerBullets[i];
            if (b instanceof HomingBullet) b.update(this.state === 'boss' && this.boss ? [this.boss] : this.enemies);
            else b.update();
            if (!b.alive) { this.playerBullets.splice(i, 1); continue; }
            // Hit enemies
            for (const e of this.enemies) {
                if (!e.alive) continue;
                if (this._collide(b, e)) {
                    b.alive = false;
                    if (e.hit(b.damage)) { this._onEnemyKill(e); }
                    break;
                }
            }
            // Hit boss
            if (this.boss && this.boss.alive && this._collide(b, this.boss)) {
                b.alive = false;
                if (this.boss.hit(b.damage)) { this._onBossKill(); }
                else { this.playSound('hit'); }
            }
        }

        // Enemies
        if (this.state === 'playing') this._spawnWaves();
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            e.update(this.player.x + this.player.w / 2, this.player.y);
            if (!e.alive) { this.enemies.splice(i, 1); continue; }
            // Enemy fires
            if (e.shouldFire() && (e.type === 'turret' || (e.type === 'diver' && e.diveTimer <= 0) || Math.random() < 0.3)) {
                const dx = this.player.x + this.player.w / 2 - (e.x + e.w / 2);
                const dy = this.player.y - (e.y + e.h);
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                this.enemyBullets.push(new EnemyBullet(e.x + e.w / 2, e.y + e.h, dx / dist * 3, dy / dist * 3, 4, '#ff6b6b'));
            }
            // Collision with player
            if (this._collide(this.player, e) && !this.player.invincible && !this.player.dead) {
                e.alive = false;
                Effects.explode(e.x + e.w / 2, e.y + e.h / 2, 'small');
                this._playerHit();
            }
        }

        // Enemy bullets
        for (let i = this.enemyBullets.length - 1; i >= 0; i--) {
            const b = this.enemyBullets[i];
            b.update();
            if (!b.alive) { this.enemyBullets.splice(i, 1); continue; }
            if (this._collideCircle(b, this.player) && !this.player.invincible && !this.player.dead) {
                b.alive = false;
                this._playerHit();
            }
        }

        // Boss
        if (this.boss && this.boss.alive) {
            this.boss.update(this.player.x + this.player.w / 2, this.player.y);
            const newBullets = this.boss.fireBullets(this.player.x + this.player.w / 2, this.player.y);
            this.enemyBullets.push(...newBullets);
        }

        // Powerups
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const p = this.powerups[i];
            p.update();
            if (!p.alive) { this.powerups.splice(i, 1); continue; }
            if (this._collide(this.player, p)) {
                p.alive = false;
                this._collectPowerup(p);
            }
        }

        // Check wave complete → trigger boss
        if (this.state === 'playing' && this.waveIndex >= STAGES[this.currentStage].waves && this.enemies.length === 0) {
            this.state = 'bossWarning';
            this.stageTimer = 120;
            this.playSound('warning');
        }

        // Game over check
        if (this.player.dead && this.player.deathTimer <= 0) {
            this.state = 'gameOver';
        }

        Effects.update();
    },

    _spawnWaves() {
        if (this.waveIndex >= STAGES[this.currentStage].waves) return;
        this.waveTimer--;
        if (this.waveTimer <= 0) {
            this._spawnWave();
            this.waveIndex++;
            this.waveTimer = 90 + Math.random() * 40;
        }
    },

    _spawnWave() {
        const stage = STAGES[this.currentStage];
        const types = stage.enemyTypes;
        const count = 3 + Math.floor(this.waveIndex * 0.7) + this.currentStage;
        const type = types[this.waveIndex % types.length];
        const formation = this.waveIndex % 3; // 0=line, 1=V, 2=random
        for (let i = 0; i < count; i++) {
            let x, y;
            if (formation === 0) { x = 30 + i * ((this.W - 60) / count); y = -30 - i * 15; }
            else if (formation === 1) { x = this.W / 2 + (i - count / 2) * 35; y = -30 - Math.abs(i - count / 2) * 20; }
            else { x = 20 + Math.random() * (this.W - 60); y = -30 - Math.random() * 80; }
            this.enemies.push(new Enemy(x, y, type, this.currentStage));
        }
        // Drop career item on certain waves
        if (this.waveIndex > 0 && this.waveIndex % 3 === 0) {
            const idx = Math.floor(this.waveIndex / 3) - 1;
            if (idx < stage.achievements.length) {
                const p = new PowerUp(Math.random() * (this.W - 40) + 20, -20, 'career');
                p.careerText = stage.achievements[idx];
                this.powerups.push(p);
            }
        }
    },

    _doBomb() {
        this.flash = { timer: 20, color: '#fff' };
        this.shake = { timer: 30, intensity: 12, x: 0, y: 0 };
        this.playSound('bomb');
        // Kill all enemy bullets
        this.enemyBullets = [];
        // Damage all enemies
        for (const e of this.enemies) { e.hit(5); if (!e.alive) this._onEnemyKill(e); }
        // Damage boss
        if (this.boss && this.boss.alive) { if (this.boss.hit(8)) this._onBossKill(); }
        // Giant explosion
        Effects.explode(this.W / 2, this.H / 2, 'huge');
        for (let i = 0; i < 5; i++) {
            Effects.explode(Math.random() * this.W, Math.random() * this.H, 'medium');
        }
    },

    _onEnemyKill(e) {
        Effects.explode(e.x + e.w / 2, e.y + e.h / 2, 'medium');
        this.player.addScore(100 + this.currentStage * 20);
        this.playSound('explode');
        // Combo text
        if (this.player.combo >= 5 && this.player.combo % 5 === 0) {
            Effects.scoreText(e.x + e.w / 2, e.y, `x${this.player.combo} COMBO!`, '#f0d000');
        }
        // Random powerup drop
        if (Math.random() < 0.08) {
            const types = ['P', 'P', 'S', 'B'];
            this.powerups.push(new PowerUp(e.x, e.y, types[Math.floor(Math.random() * types.length)]));
        }
    },

    _onBossKill() {
        this.playSound('bomb');
        this.slowMotion = 90;
        this.flash = { timer: 30, color: '#f0d000' };
        this.shake = { timer: 40, intensity: 15, x: 0, y: 0 };
        // Chain explosions
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const bx = this.boss.x + Math.random() * this.boss.w;
                const by = this.boss.y + Math.random() * this.boss.h;
                Effects.explode(bx, by, 'large');
            }, i * 200);
        }
        this.player.addScore(5000 + this.currentStage * 2000);
        Effects.scoreText(this.W / 2, this.H / 3, `+${(5000 + this.currentStage * 2000).toLocaleString()}`, '#f0d000');
        // Stage clear after delay
        setTimeout(() => { this.state = 'stageClear'; this.stageTimer = 180; }, 2000);
    },

    _playerHit() {
        const dead = this.player.hit();
        this.flash = { timer: 10, color: '#ff4444' };
        this.shake = { timer: 15, intensity: 8, x: 0, y: 0 };
        this.playSound('hit');
        Effects.explode(this.player.x + this.player.w / 2, this.player.y + this.player.h / 2, 'medium');
        if (dead) {
            Effects.explode(this.player.x + this.player.w / 2, this.player.y + this.player.h / 2, 'huge');
            this.playSound('bomb');
        }
    },

    _collectPowerup(p) {
        this.playSound('powerup');
        Effects.emit(p.x + 10, p.y + 10, { count: 10, colors: ['#f0d000', '#fff', '#4fc3f7'], spread: 4, vy: -2, life: 20, size: 4, type: 'star', gravity: 0 });
        switch (p.type) {
            case 'P': this.player.weaponLevel = Math.min(5, this.player.weaponLevel + 1); Effects.scoreText(p.x, p.y, 'POWER UP!', '#ff6b6b'); break;
            case 'S': this.player.speed = Math.min(8, this.player.speed + 0.5); Effects.scoreText(p.x, p.y, 'SPEED UP!', '#4fc3f7'); break;
            case 'B': this.player.bombs = Math.min(5, this.player.bombs + 1); Effects.scoreText(p.x, p.y, 'BOMB+1', '#f0d000'); break;
            case 'career':
                this.achievementsCollected++;
                this.stageAchievements.push(p.careerText);
                this.player.addScore(500);
                // Show career popup (pauses game briefly)
                this.careerPopup = { text: p.careerText, timer: 90 };
                Effects.emit(p.x + 10, p.y + 10, { count: 20, colors: ['#8bc34a', '#f0d000', '#fff'], spread: 8, vy: -3, life: 30, size: 5, type: 'star', gravity: 0.05 });
                break;
        }
    },

    _collide(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    },

    _collideCircle(bullet, rect) {
        const cx = bullet.x, cy = bullet.y, r = bullet.size;
        const rx = rect.x, ry = rect.y, rw = rect.w, rh = rect.h;
        const closestX = Math.max(rx, Math.min(cx, rx + rw));
        const closestY = Math.max(ry, Math.min(cy, ry + rh));
        const dx = cx - closestX, dy = cy - closestY;
        return (dx * dx + dy * dy) < (r * r);
    },

    // ===== BACKGROUND =====
    _updateBg() {
        for (let layer = 0; layer < this.bgLayers.length; layer++) {
            for (const star of this.bgLayers[layer]) {
                star.y += star.speed;
                if (star.y > this.H) { star.y = 0; star.x = Math.random() * this.W; }
            }
        }
    },

    _drawBg(ctx) {
        const stage = STAGES[this.currentStage] || STAGES[0];
        const grad = ctx.createLinearGradient(0, 0, 0, this.H);
        grad.addColorStop(0, stage.bgColors[0]);
        grad.addColorStop(1, stage.bgColors[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this.W, this.H);
        // Stars
        const layerColors = ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.5)', 'rgba(200,220,255,0.7)', 'rgba(255,240,200,0.9)'];
        for (let layer = 0; layer < this.bgLayers.length; layer++) {
            ctx.fillStyle = layerColors[layer];
            for (const star of this.bgLayers[layer]) {
                ctx.fillRect(star.x, star.y, star.size, star.size);
            }
        }
        // Nebula glow (zone specific)
        const t = Date.now() * 0.001;
        ctx.save();
        ctx.globalAlpha = 0.06 + Math.sin(t) * 0.02;
        ctx.fillStyle = stage.bossColor || '#4fc3f7';
        ctx.fillRect(0, this.H * 0.2, this.W, this.H * 0.4);
        ctx.restore();
    },

    // ===== RENDER =====
    render() {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(this.shake.x, this.shake.y);
        this._drawBg(ctx);

        if (this.state === 'title') { this._drawTitle(ctx); ctx.restore(); return; }
        if (this.state === 'stageIntro') { this._drawStageIntro(ctx); ctx.restore(); return; }
        if (this.state === 'gameOver') { this._drawGameOver(ctx); ctx.restore(); return; }
        if (this.state === 'ending') { this._drawEnding(ctx); ctx.restore(); return; }

        // Game objects
        for (const b of this.enemyBullets) b.draw(ctx);
        for (const e of this.enemies) e.draw(ctx);
        for (const b of this.playerBullets) b.draw(ctx);
        if (this.player) this.player.draw(ctx);
        if (this.boss && this.boss.alive) this.boss.draw(ctx);
        for (const p of this.powerups) p.draw(ctx);
        Effects.draw(ctx);

        // Career popup overlay
        if (this.careerPopup) { this._drawCareerPopup(ctx); }
        // Boss warning overlay
        if (this.state === 'bossWarning') { this._drawBossWarning(ctx); }
        // Stage clear overlay
        if (this.state === 'stageClear') { this._drawStageClear(ctx); }
        // Boss HP bar
        if (this.boss && this.boss.alive) this.boss.drawHPBar(ctx, this.W);

        // Screen flash
        if (this.flash.timer > 0) {
            ctx.save();
            ctx.globalAlpha = (this.flash.timer / 20) * 0.5;
            ctx.fillStyle = this.flash.color;
            ctx.fillRect(0, 0, this.W, this.H);
            ctx.restore();
        }

        // HUD
        this._drawHUD(ctx);
        ctx.restore();
    },

    _drawTitle(ctx) {
        const t = Date.now() * 0.001;
        ctx.textAlign = 'center';
        // Title
        ctx.fillStyle = '#f0d000';
        ctx.font = 'bold 18px "Press Start 2P", monospace';
        ctx.fillText('CAREER', this.W / 2, this.H * 0.25);
        ctx.fillText('FLIGHT', this.W / 2, this.H * 0.33);
        // Subtitle
        ctx.fillStyle = '#aaa';
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillText("Kim Wonkyun's Journey", this.W / 2, this.H * 0.40);
        ctx.fillText('2015 → 2025', this.W / 2, this.H * 0.45);
        // Ship preview (animated)
        const shipY = this.H * 0.58 + Math.sin(t * 2) * 5;
        ctx.fillStyle = '#4fc3f7';
        ctx.fillRect(this.W / 2 - 18, shipY, 36, 40);
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.W / 2 - 4, shipY + 8, 8, 12);
        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(this.W / 2 - 4, shipY + 40, 8, 8 + Math.sin(t * 8) * 3);
        // Controls
        ctx.fillStyle = '#666';
        ctx.font = '6px "Press Start 2P", monospace';
        if (this.isMobile) {
            ctx.fillText('Touch to move | Auto-fire', this.W / 2, this.H * 0.75);
            ctx.fillText('BOMB button for special', this.W / 2, this.H * 0.80);
        } else {
            ctx.fillText('Arrows: Move | Z: Fire | X: Bomb', this.W / 2, this.H * 0.75);
        }
        // Start
        if (Math.sin(t * 4) > -0.3) {
            ctx.fillStyle = '#fff';
            ctx.font = '9px "Press Start 2P", monospace';
            ctx.fillText(this.isMobile ? 'TAP TO START' : 'PRESS Z OR SPACE', this.W / 2, this.H * 0.90);
        }
    },

    _drawStageIntro(ctx) {
        const stage = STAGES[this.currentStage];
        const progress = 1 - this.stageTimer / 240;
        ctx.textAlign = 'center';
        ctx.save();
        ctx.globalAlpha = Math.min(1, progress * 4) * Math.min(1, (1 - progress) * 4);
        // Dark overlay for readability
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, this.H * 0.15, this.W, this.H * 0.7);
        // Stage number + year
        ctx.fillStyle = '#888';
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillText(`STAGE ${stage.id} — ${stage.years}`, this.W / 2, this.H * 0.22);
        // Title
        ctx.fillStyle = '#f0d000';
        ctx.font = 'bold 13px "Press Start 2P", monospace';
        ctx.fillText(stage.title, this.W / 2, this.H * 0.30);
        // Company + Role
        ctx.fillStyle = '#4fc3f7';
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillText(stage.subtitle, this.W / 2, this.H * 0.37);
        ctx.fillStyle = '#fff';
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillText(stage.role, this.W / 2, this.H * 0.42);
        // Description (multi-line)
        ctx.fillStyle = '#ccc';
        ctx.font = '6px "Press Start 2P", monospace';
        const lines = stage.description.split('\n');
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], this.W / 2, this.H * 0.50 + i * 16);
        }
        // Achievement preview
        ctx.fillStyle = '#8bc34a';
        ctx.font = '6px "Press Start 2P", monospace';
        ctx.fillText(`[ ${stage.achievements.length} achievements to collect ]`, this.W / 2, this.H * 0.72);
        // Kim Wonkyun label
        ctx.fillStyle = '#666';
        ctx.font = '5px "Press Start 2P", monospace';
        ctx.fillText('김원균 (Kim Wonkyun) Career Adventure', this.W / 2, this.H * 0.80);
        ctx.restore();
    },

    _drawCareerPopup(ctx) {
        if (!this.careerPopup) return;
        const alpha = Math.min(1, this.careerPopup.timer / 15);
        ctx.save();
        ctx.globalAlpha = alpha;
        // Background box
        ctx.fillStyle = 'rgba(0,30,0,0.85)';
        ctx.fillRect(20, this.H * 0.35, this.W - 40, 80);
        ctx.strokeStyle = '#8bc34a';
        ctx.lineWidth = 2;
        ctx.strokeRect(20, this.H * 0.35, this.W - 40, 80);
        // Title
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f0d000';
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillText('★ CAREER ACHIEVEMENT ★', this.W / 2, this.H * 0.35 + 18);
        // Text (wrap if needed)
        ctx.fillStyle = '#fff';
        ctx.font = '6px "Press Start 2P", monospace';
        const text = this.careerPopup.text;
        if (text.length > 30) {
            ctx.fillText(text.slice(0, 30), this.W / 2, this.H * 0.35 + 40);
            ctx.fillText(text.slice(30, 60), this.W / 2, this.H * 0.35 + 54);
        } else {
            ctx.fillText(text, this.W / 2, this.H * 0.35 + 45);
        }
        // Score
        ctx.fillStyle = '#8bc34a';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillText('+500 pts', this.W / 2, this.H * 0.35 + 70);
        ctx.restore();
    },

    _drawBossWarning(ctx) {
        const t = Date.now();
        if (Math.floor(t / 200) % 2 === 0) {
            ctx.fillStyle = 'rgba(255,0,0,0.1)';
            ctx.fillRect(0, 0, this.W, this.H);
        }
        ctx.textAlign = 'center';
        ctx.fillStyle = Math.floor(t / 150) % 2 === 0 ? '#ff1744' : '#f0d000';
        ctx.font = 'bold 16px "Press Start 2P", monospace';
        ctx.fillText('WARNING!', this.W / 2, this.H * 0.4);
        ctx.fillStyle = '#fff';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillText(STAGES[this.currentStage].bossName, this.W / 2, this.H * 0.5);
    },

    _drawStageClear(ctx) {
        const stage = STAGES[this.currentStage];
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, this.H * 0.15, this.W, this.H * 0.7);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f0d000';
        ctx.font = 'bold 12px "Press Start 2P", monospace';
        ctx.fillText('STAGE CLEAR!', this.W / 2, this.H * 0.22);
        ctx.fillStyle = '#4fc3f7';
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillText(`${stage.subtitle} - ${stage.role}`, this.W / 2, this.H * 0.30);
        ctx.fillStyle = '#fff';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillText(`Score: ${this.player.score.toLocaleString()}`, this.W / 2, this.H * 0.37);
        // Show collected achievements
        if (this.stageAchievements.length > 0) {
            ctx.fillStyle = '#8bc34a';
            ctx.font = '6px "Press Start 2P", monospace';
            ctx.fillText(`Achievements collected: ${this.stageAchievements.length}/${stage.achievements.length}`, this.W / 2, this.H * 0.45);
            ctx.fillStyle = '#ccc';
            ctx.font = '5px "Press Start 2P", monospace';
            for (let i = 0; i < Math.min(this.stageAchievements.length, 4); i++) {
                ctx.fillText('★ ' + this.stageAchievements[i].slice(0, 35), this.W / 2, this.H * 0.52 + i * 16);
            }
        } else {
            ctx.fillStyle = '#888';
            ctx.font = '6px "Press Start 2P", monospace';
            ctx.fillText('No achievements collected this stage', this.W / 2, this.H * 0.50);
        }
        ctx.restore();
    },

    _drawGameOver(ctx) {
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f44336';
        ctx.font = 'bold 16px "Press Start 2P", monospace';
        ctx.fillText('GAME OVER', this.W / 2, this.H * 0.35);
        ctx.fillStyle = '#f0d000';
        ctx.font = '9px "Press Start 2P", monospace';
        ctx.fillText(`SCORE: ${this.player.score.toLocaleString()}`, this.W / 2, this.H * 0.45);
        ctx.fillStyle = '#aaa';
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillText(`Stage ${this.currentStage + 1} | Max Combo: x${this.player.maxCombo}`, this.W / 2, this.H * 0.53);
        ctx.fillStyle = '#666';
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillText(this.isMobile ? 'TAP TO RETRY' : 'PRESS SPACE TO RETRY', this.W / 2, this.H * 0.7);
    },

    _drawEnding(ctx) {
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, this.W, this.H);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f0d000';
        ctx.font = 'bold 11px "Press Start 2P", monospace';
        ctx.fillText('MISSION COMPLETE!', this.W / 2, this.H * 0.07);
        ctx.fillStyle = '#fff';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillText(`FINAL SCORE: ${this.player.score.toLocaleString()}`, this.W / 2, this.H * 0.13);
        ctx.fillStyle = '#888';
        ctx.font = '6px "Press Start 2P", monospace';
        ctx.fillText(`Achievements: ${this.achievementsCollected} | Max Combo: x${this.player.maxCombo}`, this.W / 2, this.H * 0.18);

        // Career Summary
        ctx.fillStyle = '#4fc3f7';
        ctx.font = 'bold 9px "Press Start 2P", monospace';
        ctx.fillText(CAREER_INFO.nameKr + ' (' + CAREER_INFO.name + ')', this.W / 2, this.H * 0.26);
        ctx.fillStyle = '#fff';
        ctx.font = '6px "Press Start 2P", monospace';
        ctx.fillText(CAREER_INFO.title, this.W / 2, this.H * 0.31);

        // Career timeline
        ctx.fillStyle = '#f0d000';
        ctx.font = '6px "Press Start 2P", monospace';
        ctx.fillText('—— CAREER TIMELINE ——', this.W / 2, this.H * 0.37);
        ctx.font = '5px "Press Start 2P", monospace';
        const timeline = [
            { y: '2014-17', t: 'Samsung VD - SW Engineer (TV & Mobile)' },
            { y: '2017-18', t: 'Samsung VD - Data Scientist (Ad Platform)' },
            { y: '2018-19', t: 'Samsung C-Lab - 보청 앱 리딩 → CES 2019' },
            { y: '2019-21', t: 'Samsung Ads - 광고타겟팅 (100만건/일)' },
            { y: '2021-23', t: 'Samsung Ads - MLOps (상품화 3개월→1주일)' },
            { y: '2023-25', t: 'SNU 석사 - VLM 논문 (149인용) + 창업 대상' },
            { y: '2025~', t: 'Samsung VD - 추천시스템 & VLM & AI Agent' },
        ];
        for (let i = 0; i < timeline.length; i++) {
            const yPos = this.H * 0.41 + i * 14;
            ctx.fillStyle = '#888';
            ctx.textAlign = 'left';
            ctx.fillText(timeline[i].y, 20, yPos);
            ctx.fillStyle = '#ccc';
            ctx.textAlign = 'left';
            ctx.fillText(timeline[i].t, 90, yPos);
        }

        // Key achievements
        ctx.textAlign = 'center';
        ctx.fillStyle = '#8bc34a';
        ctx.font = '6px "Press Start 2P", monospace';
        ctx.fillText('—— KEY ACHIEVEMENTS ——', this.W / 2, this.H * 0.76);
        ctx.fillStyle = '#fff';
        ctx.font = '5px "Press Start 2P", monospace';
        const keys = [
            'IEEE Access 논문 (149 citations, SOTA)',
            'REFINED 창업 대상 (과기부·교육부)',
            '일일 100만건 추론 ML 시스템 운영',
            'Samsung SW Excellent Programmer',
        ];
        for (let i = 0; i < keys.length; i++) {
            ctx.fillText('★ ' + keys[i], this.W / 2, this.H * 0.80 + i * 13);
        }

        // Contact
        ctx.fillStyle = '#4fc3f7';
        ctx.font = '5px "Press Start 2P", monospace';
        ctx.fillText(CAREER_INFO.email + ' | LinkedIn', this.W / 2, this.H * 0.93);
        ctx.fillStyle = '#666';
        ctx.fillText(this.isMobile ? 'TAP TO RETURN' : 'PRESS SPACE', this.W / 2, this.H * 0.97);
        ctx.restore();
    },

    _drawHUD(ctx) {
        if (!this.player) return;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#fff';
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillText(`SCORE ${this.player.score.toLocaleString()}`, 8, this.H - 30);
        // Lives
        for (let i = 0; i < this.player.lives; i++) {
            ctx.fillStyle = '#4fc3f7';
            ctx.fillRect(8 + i * 16, this.H - 20, 10, 10);
        }
        // Bombs
        ctx.textAlign = 'right';
        ctx.fillStyle = '#f0d000';
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillText(`BOMB x${this.player.bombs}`, this.W - 8, this.H - 30);
        // Weapon level
        ctx.fillStyle = '#ff6b6b';
        ctx.fillText(`Lv${this.player.weaponLevel}`, this.W - 8, this.H - 15);
        // Combo
        if (this.player.combo >= 3) {
            ctx.textAlign = 'center';
            ctx.fillStyle = '#f0d000';
            ctx.font = '9px "Press Start 2P", monospace';
            ctx.globalAlpha = 0.7 + Math.sin(Date.now() * 0.01) * 0.3;
            ctx.fillText(`x${this.player.combo} COMBO`, this.W / 2, this.H - 15);
            ctx.globalAlpha = 1;
        }
        // Stage indicator + role
        ctx.textAlign = 'left';
        ctx.fillStyle = '#888';
        ctx.font = '6px "Press Start 2P", monospace';
        const stage = STAGES[this.currentStage];
        ctx.fillText(`${stage.years} | ${stage.subtitle}`, 8, 22);
        ctx.fillStyle = '#4fc3f7';
        ctx.fillText(stage.role, 8, 34);
    }
};

window.addEventListener('load', () => FlightGame.init());
