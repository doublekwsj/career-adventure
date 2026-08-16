const Game = {
    canvas: null,
    ctx: null,
    player: null,
    world: null,
    camera: null,
    state: 'title', // title, cutscene, playing, paused, ending
    time: 0,
    collected: 0,
    totalAchievements: 0,
    currentZone: 0,
    titleAnimTimer: 0,
    popupQueue: [],
    popupVisible: false,
    popupTimer: 0,
    tutorialTimer: 420,
    tutorialDone: false,
    flashTimer: 0,
    flashColor: '#fff',

    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());

        Sprites.init();
        Input.init();
        Audio.init();

        this.totalAchievements = CAREER_DATA.zones.reduce((sum, z) => sum + z.achievements.length, 0);

        // First interaction to enable audio
        const enableAudio = () => {
            Audio.resume();
            window.removeEventListener('click', enableAudio);
            window.removeEventListener('keydown', enableAudio);
            window.removeEventListener('touchstart', enableAudio);
        };
        window.addEventListener('click', enableAudio);
        window.addEventListener('keydown', enableAudio);
        window.addEventListener('touchstart', enableAudio);

        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    },

    resize() {
        const isMobile = Input.isMobile;
        const maxW = isMobile ? 640 : 960;
        const maxH = isMobile ? 360 : 540;
        const ratio = maxW / maxH;
        let w = window.innerWidth;
        let h = window.innerHeight;

        if (isMobile) {
            // Reserve bottom space for controls
            const controlsH = 140;
            h = h - controlsH;
        }

        if (w / h > ratio) w = h * ratio;
        else h = w / ratio;

        this.canvas.width = maxW;
        this.canvas.height = maxH;
        this.canvas.style.width = w + 'px';
        this.canvas.style.height = h + 'px';

        if (this.camera) {
            this.camera.resize(this.canvas.width, this.canvas.height);
        }
    },

    start() {
        this.world = new World();
        this.player = new Player(3 * TILE_SIZE, (MAP_ROWS - 4) * TILE_SIZE);
        this.camera = new Camera(
            this.canvas.width,
            this.canvas.height,
            MAP_COLS * TILE_SIZE,
            MAP_ROWS * TILE_SIZE
        );
        this.collected = 0;
        this.currentZone = 0;
        this.tutorialTimer = 420;
        this.tutorialDone = false;
        this.state = 'cutscene';
        HUD.show();
        Cutscene.lastZone = -1;
        Cutscene.tryZoneCutscene(0, () => { this.state = 'playing'; });
    },

    loop(timestamp) {
        this.time = timestamp;
        this.update();
        this.render();
        Input.update();
        requestAnimationFrame(this.loop);
    },

    update() {
        this.titleAnimTimer++;

        if (this.state === 'title') {
            if (Input.wasPressed('Space') || Input.wasPressed('Enter') || Input.anyKey()) {
                Audio.resume();
                this.start();
            }
            return;
        }

        if (this.state === 'cutscene') {
            Cutscene.update();
            return;
        }

        if (this.state === 'ending') {
            if (Input.wasPressed('Space') || Input.wasPressed('Enter')) {
                this.hidePopup();
                this.state = 'title';
                HUD.hide();
            }
            return;
        }

        if (this.state !== 'playing') return;
        if (this.player && this.player.gameOver) return;

        // Popup dismiss
        if (this.popupVisible) {
            this.popupTimer++;
            if (Input.wasPressed('Space') || Input.wasPressed('Enter') || this.popupTimer > 300) {
                this.hidePopup();
            }
            return; // pause game while popup shown
        }

        // Player update
        this.player.update();
        Physics.applyGravity(this.player);

        // Tile collisions
        const hitTile = Physics.resolveTileCollisions(
            this.player, this.world.tiles, TILE_SIZE, MAP_ROWS, MAP_COLS
        );

        // Hit question block from below
        if (hitTile && hitTile.type === 4) {
            const qb = this.world.questionBlocks.find(
                b => b.col === hitTile.col && b.row === hitTile.row
            );
            if (qb) qb.onHit(this);
        }

        // Moving platform collisions
        for (const mp of this.world.movingPlatforms) {
            Physics.resolveMovingPlatform(this.player, mp);
        }

        // Coin collisions
        for (const coin of this.world.coins) {
            if (coin.collected) continue;
            if (Physics.rectCollision(this.player, coin)) {
                coin.collect(this);
            }
        }

        // Trophy collisions
        for (const trophy of this.world.trophies) {
            if (trophy.collected) continue;
            if (Physics.rectCollision(this.player, trophy)) {
                trophy.collect(this);
            }
        }

        // Powerup collisions
        for (const pu of this.world.powerups) {
            if (pu.collected) continue;
            if (Physics.rectCollision(this.player, pu)) {
                pu.collect(this.player);
            }
        }

        // NPC interaction (press Up near NPC)
        if (Input.wasPressed('ArrowUp') || Input.wasPressed('KeyW')) {
            for (const npc of this.world.npcs) {
                if (npc.talked) continue;
                if (Math.abs(this.player.x - npc.x) < 50 && Math.abs(this.player.y - npc.y) < 50) {
                    npc.interact(this);
                    this.player.addScore(50);
                    break;
                }
            }
        }

        // Attack hits enemies/bosses
        if (this.player.attacking) {
            const atk = this.player.getAttackRect();
            for (const enemy of this.world.enemies) {
                if (!enemy.alive) continue;
                if (this.player.attackHitSet.has(enemy)) continue;
                if (Physics.rectCollision(atk, enemy)) {
                    this.player.attackHitSet.add(enemy);
                    enemy.stomp();
                    this.player.addScore(120);
                    this._onKill();
                }
            }
            for (const boss of this.world.bosses) {
                if (!boss.alive) continue;
                if (this.player.attackHitSet.has(boss)) continue;
                if (Physics.rectCollision(atk, boss)) {
                    this.player.attackHitSet.add(boss);
                    const defeated = boss.hit();
                    this.player.addScore(defeated ? 800 : 250);
                    this.flashTimer = 10;
                    this.flashColor = defeated ? '#f0d000' : '#ff4444';
                    if (defeated) Particles.bigExplosion(boss.x + boss.w / 2, boss.y + boss.h / 2);
                }
            }
        }

        // Enemy collisions
        for (const enemy of this.world.enemies) {
            if (!enemy.alive) continue;
            if (!Physics.rectCollision(this.player, enemy)) continue;

            // Dash kills enemies
            if (this.player.dashing) {
                enemy.stomp();
                this.player.addScore(150);
                this._onKill();
            }
            // Stomp from above
            else if (this.player.vy > 0 && this.player.y + this.player.h - 10 < enemy.y + enemy.h / 2) {
                enemy.stomp();
                this.player.vy = -8;
                this.player.addScore(100);
                this._onKill();
            } else if (!this.player.invincible) {
                if (this.player.powered) {
                    enemy.stomp();
                    this.player.addScore(200);
                } else {
                    this.player.hit();
                }
            }
        }

        // Boss collisions
        for (const boss of this.world.bosses) {
            if (!boss.alive) continue;
            if (!Physics.rectCollision(this.player, boss)) continue;

            if (this.player.dashing) {
                const defeated = boss.hit();
                this.player.addScore(defeated ? 1000 : 300);
                this.player.dashing = false;
                this.player.vx = -this.player.facing * 5; // bounce back
            } else if (this.player.vy > 0 && this.player.y + this.player.h - 10 < boss.y + boss.h * 0.4) {
                const defeated = boss.hit();
                this.player.vy = -10;
                this.player.addScore(defeated ? 1000 : 200);
            } else if (!this.player.invincible) {
                if (this.player.powered) {
                    boss.hit();
                    this.player.addScore(500);
                } else {
                    this.player.hit();
                }
            }
        }

        // Pipe warp
        if (Input.wasPressed('ArrowDown') || Input.wasPressed('KeyS')) {
            for (const pipe of this.world.pipes) {
                if (pipe.showPrompt) {
                    this.player.x = pipe.targetX;
                    this.player.y = (MAP_ROWS - 4) * TILE_SIZE;
                    this.player.vx = 0;
                    this.player.vy = 0;
                    Audio.play('pipe');
                    // Trigger zone cutscene
                    const newZone = this.world.getZoneAt(this.player.x);
                    if (Cutscene.tryZoneCutscene(newZone, () => { this.state = 'playing'; })) {
                        this.state = 'cutscene';
                    }
                    break;
                }
            }
        }

        // Zone change detection + level up
        const newZone = this.world.getZoneAt(this.player.x);
        if (newZone !== this.currentZone) {
            this.currentZone = newZone;
            this.player.setLevel(newZone);
            if (Cutscene.tryZoneCutscene(newZone, () => { this.state = 'playing'; })) {
                this.state = 'cutscene';
            }
        }

        // Flag reached
        if (this.world.flag && !this.world.flag.reached) {
            if (Math.abs(this.player.x - this.world.flag.x) < 50 &&
                Math.abs(this.player.y - this.world.flag.y) < 160) {
                this.world.flag.reached = true;
                Audio.play('victory');
                setTimeout(() => this.showEnding(), 1500);
            }
        }

        // Death by falling or HP=0
        const fellOff = this.player.y > MAP_ROWS * TILE_SIZE;
        if (fellOff || this.player.dead) {
            this.player.y = (MAP_ROWS - 5) * TILE_SIZE;
            this.player.vy = 0;
            if (!this.player.dead) this.player.hp = 0; // fell off = instant death
            this.player.dead = false;
            this.player.lives--;
            Particles.emit(this.player.x + this.player.w / 2, this.player.y, {
                count: 12, colors: ['#f44336', '#ff6b6b', '#fff'],
                spread: 5, vy: -4, life: 30, size: 5, type: 'star', gravity: 0.2
            });

            if (this.player.lives <= 0) {
                // Game over
                this.player.gameOver = true;
                Audio.play('hurt');
                setTimeout(() => this.showGameOver(), 800);
                return;
            }

            // Respawn with full HP at zone start
            this.player.hp = this.player.maxHp;
            this.player.x = (this.currentZone * ZONE_WIDTH + 5) * TILE_SIZE;
            this.player.vx = 0;
            this.player.invincible = true;
            this.player.invincibleTimer = 90;
            Audio.play('hurt');
        }

        // Tutorial countdown (only in zone 0)
        if (!this.tutorialDone && this.currentZone === 0 && this.tutorialTimer > 0) {
            this.tutorialTimer--;
            if (this.tutorialTimer <= 0) this.tutorialDone = true;
        }

        // World update
        this.world.update(this.time, this.player.x, this.player.y);
        this.camera.follow(this.player);
        Particles.update();
        Utils.updateShake();
    },

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.state === 'title') {
            this.renderTitle(ctx);
            return;
        }

        if (!this.world || !this.camera) return;

        // Apply screen shake
        ctx.save();
        ctx.translate(Utils.shake.x, Utils.shake.y);

        // Background (parallax)
        this.world.drawBackground(ctx, this.camera);

        // Tiles
        this.world.drawTiles(ctx, this.camera);

        // Entities
        this.world.drawEntities(ctx, this.camera);

        // Player
        if (this.player) this.player.draw(ctx, this.camera);

        // Particles
        Particles.draw(ctx, this.camera);

        // Screen flash
        if (this.flashTimer > 0) {
            this.flashTimer--;
            ctx.save();
            ctx.globalAlpha = (this.flashTimer / 10) * 0.35;
            ctx.fillStyle = this.flashColor;
            ctx.fillRect(-Utils.shake.x, -Utils.shake.y, this.canvas.width, this.canvas.height);
            ctx.restore();
        }

        ctx.restore();

        // HUD zone indicator bar
        this.renderZoneBar(ctx);

        // HP hearts
        if (this.player && (this.state === 'playing' || this.state === 'cutscene')) {
            this.renderHP(ctx);
        }

        // Tutorial hints (zone 0 only)
        if (!this.tutorialDone && this.currentZone === 0 && this.tutorialTimer > 0) {
            this.renderTutorial(ctx);
        }

        // Update HUD
        if (this.state === 'playing' || this.state === 'ending') {
            const zone = CAREER_DATA.zones[this.currentZone];
            const progress = (this.player.x / (MAP_COLS * TILE_SIZE)) * 100;
            const levelData = Sprites.PLAYER_LEVELS[this.player.level];
            HUD.update({
                year: zone.years,
                title: levelData.title,
                score: this.player.score,
                combo: this.player.combo,
                collected: this.collected,
                total: this.totalAchievements,
                progress,
                hp: this.player.hp,
                maxHp: this.player.maxHp,
                lives: this.player.lives
            });
        }
    },

    renderTitle(ctx) {
        const w = this.canvas.width;
        const h = this.canvas.height;
        const t = this.titleAnimTimer;

        // Animated gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        const hue = (t * 0.3) % 360;
        gradient.addColorStop(0, `hsl(${hue}, 30%, 10%)`);
        gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 40%, 5%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Animated stars/particles
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 100; i++) {
            const sx = (Math.sin(i * 127.1 + t * 0.01) * 0.5 + 0.5) * w;
            const sy = (Math.cos(i * 311.7 + t * 0.005) * 0.5 + 0.5) * h;
            const ss = 1 + Math.sin(t * 0.05 + i) * 0.8;
            ctx.globalAlpha = 0.3 + Math.sin(t * 0.03 + i * 2) * 0.3;
            ctx.fillRect(sx, sy, ss, ss);
        }
        ctx.globalAlpha = 1;

        // Floating platforms animation
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < 5; i++) {
            const px = (i * 200 + t * 0.5) % (w + 100) - 50;
            const py = h * 0.7 + Math.sin(t * 0.02 + i) * 20;
            ctx.drawImage(Sprites.get('platform_grassland'), px, py);
        }
        ctx.globalAlpha = 1;

        // Title with bounce effect
        const bounce = Math.sin(t * 0.05) * 5;
        ctx.textAlign = 'center';

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.font = 'bold 16px "Press Start 2P", monospace';
        ctx.fillText("KIM WONKYUN's", w / 2 + 2, h * 0.25 + bounce + 2);
        ctx.font = 'bold 28px "Press Start 2P", monospace';
        ctx.fillText('CAREER', w / 2 + 2, h * 0.36 + bounce + 2);
        ctx.fillText('ADVENTURE', w / 2 + 2, h * 0.46 + bounce + 2);

        // Main text
        ctx.fillStyle = '#f0d000';
        ctx.font = 'bold 16px "Press Start 2P", monospace';
        ctx.fillText("KIM WONKYUN's", w / 2, h * 0.25 + bounce);

        // Rainbow-ish title
        const titleGrad = ctx.createLinearGradient(w * 0.2, 0, w * 0.8, 0);
        titleGrad.addColorStop(0, '#ff6b6b');
        titleGrad.addColorStop(0.5, '#f0d000');
        titleGrad.addColorStop(1, '#4fc3f7');
        ctx.fillStyle = titleGrad;
        ctx.font = 'bold 28px "Press Start 2P", monospace';
        ctx.fillText('CAREER', w / 2, h * 0.36 + bounce);
        ctx.fillText('ADVENTURE', w / 2, h * 0.46 + bounce);

        // Subtitle
        ctx.fillStyle = '#aaa';
        ctx.font = '9px "Press Start 2P", monospace';
        ctx.fillText('Samsung Electronics | AI/ML Engineer', w / 2, h * 0.56);
        ctx.fillText('Seoul National University | M.S.', w / 2, h * 0.62);

        // Character evolution preview - show all 7 levels
        const totalLevels = Sprites.PLAYER_LEVELS.length;
        const spacing = 50;
        const startX = w / 2 - (totalLevels * spacing) / 2 + spacing / 2;
        const charY = h * 0.67;
        const currentShowLevel = Math.floor(t / 60) % totalLevels;

        for (let i = 0; i < totalLevels; i++) {
            const cx = startX + i * spacing;
            const isActive = i === currentShowLevel;
            ctx.save();
            ctx.globalAlpha = isActive ? 1 : 0.35;
            const scale = isActive ? 1.3 : 0.9;
            const sprite = Sprites.get(`player_${i}_idle_r`);
            if (sprite) {
                ctx.translate(cx, charY + (isActive ? -5 : 0));
                ctx.scale(scale, scale);
                ctx.drawImage(sprite, -16, -20);
            }
            ctx.restore();

            // Arrow between levels
            if (i < totalLevels - 1) {
                ctx.fillStyle = 'rgba(255,255,255,0.3)';
                ctx.font = '8px monospace';
                ctx.textAlign = 'center';
                ctx.fillText('>', cx + spacing / 2, charY);
            }
        }

        // Show current level title
        ctx.fillStyle = '#4fc3f7';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(Sprites.PLAYER_LEVELS[currentShowLevel].title, w / 2, charY + 28);

        // Stats preview
        ctx.fillStyle = '#888';
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillText(`${this.totalAchievements} Achievements | 7 Zones | 10+ Years`, w / 2, h * 0.84);

        // Controls hint
        if (Input.isMobile) {
            ctx.fillStyle = '#666';
            ctx.font = '6px "Press Start 2P", monospace';
            ctx.fillText('JUMP/DASH/ATK buttons | Double Jump!', w / 2, h * 0.89);
        } else {
            ctx.fillStyle = '#666';
            ctx.font = '7px "Press Start 2P", monospace';
            ctx.fillText('Arrows: Move | Space: Jump | X/Shift: Dash | Z: Attack', w / 2, h * 0.89);
        }

        // Start prompt
        if (Math.sin(t * 0.08) > -0.3) {
            ctx.fillStyle = '#fff';
            ctx.font = '11px "Press Start 2P", monospace';
            ctx.fillText(Input.isMobile ? 'TAP SCREEN TO START' : 'PRESS ANY KEY TO START', w / 2, h * 0.95);
        }
    },

    renderHP(ctx) {
        const p = this.player;
        const sx = 8;
        const sy = this.canvas.height - 22;
        // Lives
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = '#fff';
        ctx.fillText(`x${p.lives}`, sx + 18, sy + 9);
        // Mini head icon
        ctx.fillStyle = '#ffd5a3';
        ctx.fillRect(sx, sy, 12, 12);
        ctx.fillStyle = '#2a1a0a';
        ctx.fillRect(sx, sy - 2, 12, 4);
        // HP hearts
        for (let i = 0; i < p.maxHp; i++) {
            const hx = sx + 44 + i * 14;
            ctx.fillStyle = i < p.hp ? '#f44336' : '#444';
            ctx.fillRect(hx, sy + 2, 10, 8);
            // heart shape hint
            ctx.fillStyle = i < p.hp ? '#ff6b6b' : '#333';
            ctx.fillRect(hx + 1, sy + 1, 4, 3);
            ctx.fillRect(hx + 5, sy + 1, 4, 3);
        }
    },

    renderTutorial(ctx) {
        const t = this.tutorialTimer;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const isMob = Input.isMobile;

        // Hint 1: Move (shown 420→200)
        if (t > 200) {
            const alpha = Math.min(1, (t - 200) / 40) * Math.min(1, (t - 380) < 0 ? 1 : (420 - t) / 40);
            ctx.save();
            ctx.globalAlpha = Math.min(1, (420 - t) / 30 + (t > 380 ? 0 : 1)) * 0.85;
            this._drawHint(ctx, w / 2, h * 0.78, isMob ? 'LEFT/RIGHT buttons' : '← → to Move');
            ctx.restore();
        }

        // Hint 2: Jump (shown 280→100)
        if (t <= 280 && t > 100) {
            const alpha = Math.min(1, (280 - t) / 30) * Math.min(1, (t - 100) / 30);
            ctx.save();
            ctx.globalAlpha = alpha * 0.85;
            this._drawHint(ctx, w / 2, h * 0.78, isMob ? 'JUMP button (x2 double jump)' : 'SPACE to Jump  (x2 double jump!)');
            ctx.restore();
        }

        // Hint 3: Attack/Dash (shown 140→0)
        if (t <= 140) {
            const alpha = Math.min(1, (140 - t) / 20) * Math.min(1, t / 20);
            ctx.save();
            ctx.globalAlpha = alpha * 0.85;
            this._drawHint(ctx, w / 2, h * 0.78, isMob ? 'ATK: punch  DASH: dash through enemies' : 'Z: Attack  Shift/X: Dash through enemies');
            ctx.restore();
        }

        // "Go right!" arrow (first 300 frames)
        if (t > 120) {
            const arrowAlpha = Math.min(1, t / 60) * Math.min(1, (t - 120) / 30) * 0.6;
            const bounce = Math.sin(Date.now() * 0.006) * 4;
            ctx.save();
            ctx.globalAlpha = arrowAlpha;
            ctx.fillStyle = '#f0d000';
            ctx.font = 'bold 14px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('→', w * 0.75 + bounce, h * 0.5);
            ctx.font = '7px "Press Start 2P", monospace';
            ctx.fillStyle = '#fff';
            ctx.fillText('Go right!', w * 0.75 + bounce, h * 0.5 + 18);
            ctx.restore();
        }
    },

    _drawHint(ctx, x, y, text) {
        const isMob = Input.isMobile;
        ctx.fillStyle = 'rgba(0,0,0,0.55)';
        const fs = isMob ? 7 : 8;
        ctx.font = `${fs}px "Press Start 2P", monospace`;
        const tw = ctx.measureText(text).width;
        ctx.fillRect(x - tw / 2 - 10, y - 14, tw + 20, 22);
        ctx.fillStyle = '#f0d000';
        ctx.textAlign = 'center';
        ctx.fillText(text, x, y);
    },

    renderZoneBar(ctx) {
        if (this.state !== 'playing') return;
        const barH = 3;
        const barW = this.canvas.width;
        const y = this.canvas.height - barH;

        for (let i = 0; i < TOTAL_ZONES; i++) {
            const zone = CAREER_DATA.zones[i];
            const x = (i / TOTAL_ZONES) * barW;
            const w = barW / TOTAL_ZONES;
            ctx.fillStyle = i === this.currentZone ? zone.bgColor2 : 'rgba(50,50,50,0.5)';
            ctx.fillRect(x, y, w, barH);
        }
    },

    showAchievement(data) {
        this.collected++;
        this.player.addScore(data.score || 200);

        const popup = document.getElementById('popup');
        const content = document.getElementById('popup-content');
        const scoreColor = data.score >= 500 ? '#f0d000' : data.score >= 300 ? '#4fc3f7' : '#8bc34a';
        const urlHtml = data.url ? `<p style="margin-top:8px;"><a href="${data.url}" target="_blank" style="font-size:8px;">View Paper / Link</a></p>` : '';
        const typeIcon = data.type === 'trophy' ? '🏆' : data.type === 'coin' ? '⭐' : '📦';
        content.innerHTML = `
            <h3>${typeIcon} Achievement Unlocked!</h3>
            <p style="font-size:10px; color:${scoreColor};">+${data.score || 200} pts</p>
            <p style="margin-top:8px;">${data.text}</p>
            ${urlHtml}
            <p class="close-hint">TAP or PRESS SPACE</p>
        `;
        popup.classList.remove('hidden');
        setTimeout(() => popup.classList.add('show'), 10);
        this.popupVisible = true;
        this.popupTimer = 0;
    },

    showPopup(text) {
        const popup = document.getElementById('popup');
        const content = document.getElementById('popup-content');
        content.innerHTML = `<p>${text}</p><p class="close-hint">PRESS SPACE</p>`;
        popup.classList.remove('hidden');
        setTimeout(() => popup.classList.add('show'), 10);
        this.popupVisible = true;
        this.popupTimer = 0;
    },

    hidePopup() {
        const popup = document.getElementById('popup');
        popup.classList.remove('show');
        setTimeout(() => popup.classList.add('hidden'), 300);
        this.popupVisible = false;
    },

    _onKill() {
        this.flashTimer = 6;
        this.flashColor = '#ff6b35';
        const combo = this.player.combo;
        if (combo >= 3) {
            Particles.comboText(this.player.x + this.player.w / 2, this.player.y - 30, combo);
        }
        if (combo >= 5) {
            this.flashTimer = 10;
            this.flashColor = '#f0d000';
        }
    },

    showGameOver() {
        this.state = 'ending';
        const popup = document.getElementById('popup');
        const content = document.getElementById('popup-content');
        content.innerHTML = `
            <h3 style="color:#f44336;">GAME OVER</h3>
            <p style="font-size:10px; color:#aaa; margin:8px 0;">Don't give up!</p>
            <p style="font-size:9px; color:#f0d000;">SCORE: ${this.player.score.toLocaleString()}</p>
            <p style="font-size:8px;">Achievements: ${this.collected}/${this.totalAchievements}</p>
            <br>
            <p style="font-size:8px; color:#4fc3f7;">Tip: Z to attack, SPACE x2 to double jump!</p>
            <p class="close-hint">TAP or PRESS SPACE TO RETRY</p>
        `;
        popup.classList.remove('hidden');
        setTimeout(() => popup.classList.add('show'), 10);
        this.popupVisible = true;
    },

    showEnding() {
        this.state = 'ending';
        const info = CAREER_DATA.info;
        const popup = document.getElementById('popup');
        const content = document.getElementById('popup-content');
        const bossesDefeated = this.world.bosses.filter(b => b.defeated).length;
        const totalBosses = this.world.bosses.length;
        const grade = this.collected >= this.totalAchievements * 0.9 ? 'S' :
                      this.collected >= this.totalAchievements * 0.7 ? 'A' :
                      this.collected >= this.totalAchievements * 0.5 ? 'B' : 'C';
        const gradeColor = { S: '#f0d000', A: '#4fc3f7', B: '#8bc34a', C: '#aaa' }[grade];

        const eduHtml = info.education.map(e =>
            `<p style="font-size:7px;"><strong>${e.school}</strong> ${e.major} (${e.year})</p>` +
            (e.detail ? `<p style="font-size:6px; color:#888;">${e.detail}</p>` : '')
        ).join('');

        const papersHtml = info.papers.map(p =>
            `<p style="font-size:7px;"><a href="${p.url}" target="_blank">${p.title}</a></p>` +
            `<p style="font-size:6px; color:#888;">${p.venue}${p.citations ? ' | ' + p.citations + ' citations' : ''}${p.achievement ? ' | ' + p.achievement : ''}</p>`
        ).join('');

        const skillsHtml = Object.entries(info.skills).map(([k, v]) =>
            `<p style="font-size:6px;"><span style="color:#f0d000;">${k}:</span> ${v}</p>`
        ).join('');

        const awardsHtml = info.awards.slice(0, 4).map(a =>
            `<p style="font-size:6px;">• ${a.title} ${a.date ? '(' + a.date + ')' : ''}</p>`
        ).join('');

        content.innerHTML = `
            <h3>ADVENTURE COMPLETE!</h3>
            <p style="font-size:18px; color:${gradeColor}; margin:4px 0;">GRADE ${grade}</p>
            <p style="font-size:9px; color:#f0d000;">SCORE: ${this.player.score.toLocaleString()}</p>
            <p style="font-size:7px;">Achievements: ${this.collected}/${this.totalAchievements} | Bosses: ${bossesDefeated}/${totalBosses}</p>
            <p style="font-size:7px; color:#4fc3f7;">Final Title: ${Sprites.PLAYER_LEVELS[this.player.level].title}</p>
            <hr style="border-color:#333; margin:12px 0;">
            <h3>${info.nameKr} (${info.name})</h3>
            <p style="font-size:9px; color:#aaa;">${info.title} @ Samsung Electronics</p>
            <p style="font-size:7px; margin-top:6px;">${info.profile}</p>
            <br>
            <p style="font-size:8px;"><a href="mailto:${info.email}">${info.email}</a> | <a href="${info.linkedin}" target="_blank">LinkedIn</a></p>
            <br>
            <p style="font-size:8px; color:#f0d000;"><strong>Education</strong></p>
            ${eduHtml}
            <br>
            <p style="font-size:8px; color:#f0d000;"><strong>Publications</strong></p>
            ${papersHtml}
            <br>
            <p style="font-size:8px; color:#f0d000;"><strong>Awards (Top)</strong></p>
            ${awardsHtml}
            <br>
            <p style="font-size:8px; color:#f0d000;"><strong>Tech Stack</strong></p>
            ${skillsHtml}
            <br>
            <p class="close-hint">TAP or PRESS SPACE TO REPLAY</p>
        `;
        popup.classList.remove('hidden');
        setTimeout(() => popup.classList.add('show'), 10);
        this.popupVisible = true;
    }
};

window.addEventListener('load', () => Game.init());
