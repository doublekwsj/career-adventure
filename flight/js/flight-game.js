// ===== PLAYER =====
class Player {
    constructor(canvasW, canvasH) {
        this.w = 36; this.h = 40;
        this.x = canvasW / 2 - this.w / 2;
        this.y = canvasH - 80;
        this.speed = 5;
        this.baseSpeed = 5;
        this.weaponLevel = 1;
        this.bombs = 3;
        this.lives = 3;
        this.score = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.maxCombo = 0;
        this.invincible = false;
        this.invTimer = 0;
        this.fireTimer = 0;
        this.fireRate = 6;
        this.canvasW = canvasW;
        this.canvasH = canvasH;
        this.dead = false;
        this.deathTimer = 0;
        this.thrusterPhase = 0;
        this.stageLevel = 0; // visual upgrade per stage
    }

    update(keys) {
        if (this.dead) { this.deathTimer--; return; }
        const s = this.speed;
        if (keys.left) this.x -= s;
        if (keys.right) this.x += s;
        if (keys.up) this.y -= s;
        if (keys.down) this.y += s;
        // Bounds
        this.x = Math.max(0, Math.min(this.canvasW - this.w, this.x));
        this.y = Math.max(0, Math.min(this.canvasH - this.h, this.y));
        // Fire timer
        if (this.fireTimer > 0) this.fireTimer--;
        // Invincibility
        if (this.invTimer > 0) { this.invTimer--; if (this.invTimer <= 0) this.invincible = false; }
        // Combo decay
        if (this.comboTimer > 0) { this.comboTimer--; if (this.comboTimer <= 0) this.combo = 0; }
        this.thrusterPhase += 0.2;
    }

    fire() {
        if (this.dead || this.fireTimer > 0) return [];
        this.fireTimer = this.fireRate;
        const cx = this.x + this.w / 2;
        const bullets = [];
        const lv = this.weaponLevel;
        if (lv >= 1) bullets.push(new Bullet(cx - 2, this.y, 0, -12, 4, 14, '#4fc3f7'));
        if (lv >= 2) bullets.push(new Bullet(cx - 10, this.y + 5, 0, -11, 3, 12, '#81d4fa'));
        if (lv >= 2) bullets.push(new Bullet(cx + 6, this.y + 5, 0, -11, 3, 12, '#81d4fa'));
        if (lv >= 3) { bullets.push(new Bullet(cx - 4, this.y, -2, -10, 3, 12, '#4fc3f7')); bullets.push(new Bullet(cx, this.y, 2, -10, 3, 12, '#4fc3f7')); }
        if (lv >= 4) bullets.push(new HomingBullet(cx, this.y - 10, '#f0d000'));
        if (lv >= 5) { bullets.push(new HomingBullet(cx - 12, this.y - 5, '#f0d000')); bullets.push(new HomingBullet(cx + 12, this.y - 5, '#f0d000')); }
        return bullets;
    }

    hit() {
        if (this.invincible || this.dead) return false;
        this.lives--;
        if (this.lives <= 0) { this.dead = true; this.deathTimer = 120; return true; }
        this.invincible = true;
        this.invTimer = 120;
        if (this.weaponLevel > 1) this.weaponLevel--;
        return false;
    }

    addScore(pts) {
        this.combo++;
        this.comboTimer = 90;
        const mult = Math.min(this.combo, 10);
        this.score += pts * mult;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;
    }

    draw(ctx) {
        if (this.dead) return;
        if (this.invincible && Math.floor(this.invTimer / 4) % 2 === 0) return;
        const x = this.x, y = this.y;
        // Thruster glow
        const tSize = 8 + Math.sin(this.thrusterPhase) * 3;
        ctx.fillStyle = '#ff6b35';
        ctx.fillRect(x + this.w / 2 - 5, y + this.h, 10, tSize);
        ctx.fillStyle = '#f0d000';
        ctx.fillRect(x + this.w / 2 - 3, y + this.h, 6, tSize - 3);
        // Ship body
        const colors = ['#4fc3f7', '#81d4fa', '#00e5ff', '#4db6ac', '#7c4dff', '#f0d000', '#ff6b6b'];
        const baseColor = colors[this.stageLevel % colors.length];
        ctx.fillStyle = '#333';
        ctx.fillRect(x + 4, y + 10, this.w - 8, this.h - 14);
        ctx.fillStyle = baseColor;
        ctx.fillRect(x + 8, y + 6, this.w - 16, this.h - 10);
        // Cockpit
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 14, y + 12, 8, 10);
        ctx.fillStyle = '#e0f7fa';
        ctx.fillRect(x + 15, y + 13, 6, 8);
        // Wings
        ctx.fillStyle = '#37474f';
        ctx.fillRect(x, y + 20, 8, 16);
        ctx.fillRect(x + this.w - 8, y + 20, 8, 16);
        ctx.fillStyle = baseColor;
        ctx.fillRect(x + 1, y + 22, 6, 12);
        ctx.fillRect(x + this.w - 7, y + 22, 6, 12);
        // Nose
        ctx.fillStyle = '#fff';
        ctx.fillRect(x + 15, y + 2, 6, 6);
        // Weapon level indicator dots
        for (let i = 0; i < this.weaponLevel; i++) {
            ctx.fillStyle = '#f0d000';
            ctx.fillRect(x + 6 + i * 6, y + this.h - 4, 4, 3);
        }
    }
}

// ===== BULLETS =====
class Bullet {
    constructor(x, y, vx, vy, w, h, color) {
        this.x = x; this.y = y; this.vx = vx; this.vy = vy;
        this.w = w; this.h = h; this.color = color;
        this.alive = true; this.damage = 1;
    }
    update() { this.x += this.vx; this.y += this.vy; if (this.y < -20 || this.y > 700 || this.x < -20 || this.x > 500) this.alive = false; }
    draw(ctx) { ctx.fillStyle = this.color; ctx.fillRect(this.x, this.y, this.w, this.h); }
}

class HomingBullet extends Bullet {
    constructor(x, y, color) {
        super(x, y, 0, -8, 5, 5, color);
        this.target = null; this.turnSpeed = 0.15; this.speed = 9; this.life = 120; this.damage = 2;
    }
    update(enemies) {
        this.life--;
        if (this.life <= 0) { this.alive = false; return; }
        if (!this.target || !this.target.alive) {
            this.target = enemies ? enemies.find(e => e.alive) : null;
        }
        if (this.target) {
            const dx = (this.target.x + this.target.w / 2) - this.x;
            const dy = (this.target.y + this.target.h / 2) - this.y;
            const angle = Math.atan2(dy, dx);
            const currentAngle = Math.atan2(this.vy, this.vx);
            let diff = angle - currentAngle;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            const newAngle = currentAngle + Math.sign(diff) * Math.min(Math.abs(diff), this.turnSpeed);
            this.vx = Math.cos(newAngle) * this.speed;
            this.vy = Math.sin(newAngle) * this.speed;
        }
        this.x += this.vx; this.y += this.vy;
        if (this.y < -30 || this.y > 700 || this.x < -30 || this.x > 500) this.alive = false;
    }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + 2, this.y + 2, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x + 2, this.y + 2, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

class EnemyBullet {
    constructor(x, y, vx, vy, size, color) {
        this.x = x; this.y = y; this.vx = vx; this.vy = vy;
        this.size = size || 5; this.color = color || '#ff4444'; this.alive = true;
    }
    update() { this.x += this.vx; this.y += this.vy; if (this.y > 700 || this.y < -20 || this.x < -20 || this.x > 500) this.alive = false; }
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ===== ENEMIES =====
class Enemy {
    constructor(x, y, type, stage) {
        this.x = x; this.y = y;
        this.type = type;
        this.alive = true;
        this.hp = type === 'turret' ? 3 : (type === 'diver' ? 2 : 1);
        this.fireTimer = 60 + Math.random() * 60;
        this.phase = Math.random() * Math.PI * 2;
        this.startX = x;
        this.timer = 0;
        this.stage = stage;
        this.hitFlash = 0;
        switch (type) {
            case 'scout': this.w = 24; this.h = 24; this.vy = 2.5 + stage * 0.15; this.vx = 0; break;
            case 'zigzag': this.w = 26; this.h = 22; this.vy = 2; this.vx = 0; this.zigAmp = 60; this.zigSpeed = 0.04; break;
            case 'diver': this.w = 22; this.h = 28; this.vy = 1.5; this.vx = 0; this.diveTimer = 40 + Math.random() * 30; break;
            case 'turret': this.w = 30; this.h = 30; this.vy = 0.8; this.vx = 0; this.stopY = 40 + Math.random() * 100; break;
        }
    }

    update(playerX, playerY) {
        this.timer++;
        if (this.hitFlash > 0) this.hitFlash--;
        switch (this.type) {
            case 'scout': this.y += this.vy; break;
            case 'zigzag': this.y += this.vy; this.x = this.startX + Math.sin(this.phase + this.timer * this.zigSpeed) * this.zigAmp; break;
            case 'diver':
                if (this.diveTimer > 0) { this.diveTimer--; this.y += this.vy; }
                else { this.vy = 6; this.y += this.vy; const dx = playerX - this.x; this.x += dx * 0.02; }
                break;
            case 'turret':
                if (this.y < this.stopY) this.y += this.vy;
                break;
        }
        this.fireTimer--;
        if (this.y > 700) this.alive = false;
    }

    shouldFire() {
        if (this.fireTimer <= 0) {
            this.fireTimer = this.type === 'turret' ? 40 + Math.random() * 30 : 80 + Math.random() * 60;
            return true;
        }
        return false;
    }

    hit(dmg) {
        this.hp -= dmg || 1;
        this.hitFlash = 6;
        if (this.hp <= 0) { this.alive = false; return true; }
        return false;
    }

    draw(ctx) {
        const flash = this.hitFlash > 0;
        const colors = { scout: '#66bb6a', zigzag: '#ef5350', diver: '#ff9800', turret: '#ab47bc' };
        const color = flash ? '#fff' : (colors[this.type] || '#888');
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x + 2, this.y + 2, this.w - 4, this.h - 4);
        ctx.fillStyle = color;
        ctx.fillRect(this.x + 4, this.y + 4, this.w - 8, this.h - 8);
        // Eyes
        ctx.fillStyle = flash ? '#f00' : '#fff';
        ctx.fillRect(this.x + 8, this.y + 8, 4, 4);
        ctx.fillRect(this.x + this.w - 12, this.y + 8, 4, 4);
        // Type indicator
        if (this.type === 'turret') {
            ctx.fillStyle = '#f0d000';
            ctx.fillRect(this.x + this.w / 2 - 3, this.y + this.h - 6, 6, 8);
        }
        if (this.type === 'diver' && this.diveTimer <= 0) {
            ctx.fillStyle = '#ff4444';
            ctx.fillRect(this.x + this.w / 2 - 2, this.y + this.h, 4, 8);
        }
    }
}

// ===== BOSS =====
class Boss {
    constructor(stage, canvasW) {
        const data = STAGES[stage];
        this.canvasW = canvasW;
        this.w = canvasW * 0.65;
        this.h = 120 + stage * 10;
        this.x = canvasW / 2 - this.w / 2;
        this.y = -this.h - 20;
        this.targetY = 30;
        this.maxHp = 40 + stage * 20;
        this.hp = this.maxHp;
        this.phase = 0; // 0=entering, 1=phase1, 2=phase2, 3=phase3
        this.alive = true;
        this.defeated = false;
        this.timer = 0;
        this.attackTimer = 0;
        this.hitFlash = 0;
        this.name = data.bossName;
        this.color = data.bossColor;
        this.stage = stage;
        this.shakeX = 0;
        this.patterns = ['circle', 'aimed', 'spiral'];
        this.currentPattern = 0;
    }

    update(playerX, playerY) {
        this.timer++;
        if (this.hitFlash > 0) this.hitFlash--;
        if (this.phase === 0) {
            this.y += 1.5;
            if (this.y >= this.targetY) { this.y = this.targetY; this.phase = 1; }
            return;
        }
        // Slow horizontal sway
        this.x = (this.canvasW / 2 - this.w / 2) + Math.sin(this.timer * 0.015) * 40;
        this.shakeX = this.hitFlash > 0 ? (Math.random() - 0.5) * 8 : 0;
        // Phase transitions
        const hpPct = this.hp / this.maxHp;
        if (hpPct < 0.33 && this.phase < 3) this.phase = 3;
        else if (hpPct < 0.66 && this.phase < 2) this.phase = 2;
        this.attackTimer--;
    }

    shouldFire() {
        if (this.phase === 0) return null;
        if (this.attackTimer <= 0) {
            const rate = this.phase === 3 ? 20 : this.phase === 2 ? 35 : 50;
            this.attackTimer = rate;
            this.currentPattern = (this.currentPattern + 1) % this.patterns.length;
            return this.patterns[this.currentPattern];
        }
        return null;
    }

    fireBullets(playerX, playerY) {
        const pattern = this.shouldFire();
        if (!pattern) return [];
        const cx = this.x + this.w / 2;
        const cy = this.y + this.h;
        const bullets = [];
        const speed = 3 + this.phase * 0.5;
        const colors = ['#ff4444', '#ff6b35', '#f0d000', '#e91e63'];
        const color = colors[this.phase] || '#ff4444';
        switch (pattern) {
            case 'circle': {
                const count = 8 + this.phase * 4;
                for (let i = 0; i < count; i++) {
                    const angle = (Math.PI * 2 / count) * i + this.timer * 0.05;
                    bullets.push(new EnemyBullet(cx, cy, Math.cos(angle) * speed, Math.sin(angle) * speed, 4 + this.phase, color));
                }
                break;
            }
            case 'aimed': {
                const dx = playerX - cx, dy = playerY - cy;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const spread = this.phase * 0.15;
                for (let i = -this.phase; i <= this.phase; i++) {
                    const angle = Math.atan2(dy, dx) + i * spread;
                    bullets.push(new EnemyBullet(cx, cy, Math.cos(angle) * (speed + 1), Math.sin(angle) * (speed + 1), 5, '#f0d000'));
                }
                break;
            }
            case 'spiral': {
                const count = 3 + this.phase * 2;
                for (let i = 0; i < count; i++) {
                    const angle = this.timer * 0.1 + (Math.PI * 2 / count) * i;
                    bullets.push(new EnemyBullet(cx, cy, Math.cos(angle) * speed, Math.sin(angle) * speed, 4, '#a78bfa'));
                }
                break;
            }
        }
        return bullets;
    }

    hit(dmg) {
        this.hp -= dmg || 1;
        this.hitFlash = 8;
        if (this.hp <= 0) { this.alive = false; this.defeated = true; return true; }
        return false;
    }

    draw(ctx) {
        const x = this.x + this.shakeX, y = this.y;
        const flash = this.hitFlash > 0;
        // Main body
        ctx.fillStyle = flash ? '#fff' : '#1a1a2e';
        ctx.fillRect(x + 10, y + 10, this.w - 20, this.h - 20);
        ctx.fillStyle = flash ? '#f0d000' : this.color;
        ctx.fillRect(x + 16, y + 16, this.w - 32, this.h - 32);
        // Armor plating
        ctx.fillStyle = flash ? '#fff' : '#333';
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(x + 30 + i * (this.w / 5), y + 20, this.w / 7, this.h - 40);
        }
        // Core (glowing)
        const coreGlow = Math.sin(this.timer * 0.1) * 0.3 + 0.7;
        ctx.save();
        ctx.globalAlpha = coreGlow;
        ctx.fillStyle = this.phase >= 3 ? '#ff1744' : this.phase >= 2 ? '#f0d000' : '#4fc3f7';
        const coreSize = 20 + this.phase * 5;
        ctx.fillRect(x + this.w / 2 - coreSize / 2, y + this.h / 2 - coreSize / 2, coreSize, coreSize);
        ctx.restore();
        // Eyes
        ctx.fillStyle = this.phase >= 3 ? '#ff1744' : '#f44336';
        ctx.fillRect(x + this.w * 0.3, y + 30, 12, 12);
        ctx.fillRect(x + this.w * 0.6, y + 30, 12, 12);
        // Phase-specific decorations
        if (this.phase >= 2) {
            ctx.fillStyle = '#ff4444';
            ctx.fillRect(x + 5, y + this.h * 0.6, 8, 20);
            ctx.fillRect(x + this.w - 13, y + this.h * 0.6, 8, 20);
        }
        if (this.phase >= 3) {
            // Rage aura
            ctx.save();
            ctx.globalAlpha = 0.15 + Math.sin(this.timer * 0.15) * 0.1;
            ctx.fillStyle = '#ff1744';
            ctx.fillRect(x - 5, y - 5, this.w + 10, this.h + 10);
            ctx.restore();
        }
    }

    drawHPBar(ctx, canvasW) {
        if (this.phase === 0) return;
        const barW = canvasW - 40;
        const barH = 8;
        const barX = 20, barY = 8;
        ctx.fillStyle = '#222';
        ctx.fillRect(barX, barY, barW, barH);
        const hpPct = Math.max(0, this.hp / this.maxHp);
        const hpColor = hpPct > 0.5 ? '#4caf50' : hpPct > 0.25 ? '#ff9800' : '#f44336';
        ctx.fillStyle = hpColor;
        ctx.fillRect(barX, barY, barW * hpPct, barH);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, barH);
        // Boss name
        ctx.fillStyle = '#fff';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, canvasW / 2, barY + barH + 14);
    }
}

// ===== POWERUPS =====
class PowerUp {
    constructor(x, y, type) {
        this.x = x; this.y = y; this.w = 20; this.h = 20;
        this.type = type; // 'P', 'S', 'B', 'career'
        this.vy = 1.5;
        this.alive = true;
        this.timer = 0;
        this.careerText = '';
    }
    update() { this.y += this.vy; this.timer++; if (this.y > 700) this.alive = false; }
    draw(ctx) {
        const bob = Math.sin(this.timer * 0.1) * 3;
        const colors = { P: '#ff6b6b', S: '#4fc3f7', B: '#f0d000', career: '#8bc34a' };
        ctx.fillStyle = colors[this.type] || '#fff';
        ctx.fillRect(this.x, this.y + bob, this.w, this.h);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(this.type === 'career' ? '★' : this.type, this.x + this.w / 2, this.y + bob + 14);
    }
}

// ===== PARTICLES =====
class Particle {
    constructor(x, y, vx, vy, color, life, size, type) {
        this.x = x; this.y = y; this.vx = vx; this.vy = vy;
        this.color = color; this.life = life; this.maxLife = life;
        this.size = size; this.type = type || 'square';
        this.gravity = 0.05; this.text = '';
    }
    update() {
        this.x += this.vx; this.y += this.vy;
        this.vy += this.gravity;
        this.life--;
    }
    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        if (this.type === 'text' && this.text) {
            ctx.font = `bold ${this.size}px "Press Start 2P", monospace`;
            ctx.textAlign = 'center';
            ctx.fillText(this.text, this.x, this.y);
        } else if (this.type === 'circle') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.type === 'star') {
            const s = this.size * alpha;
            ctx.fillRect(this.x - s / 2, this.y - 1, s, 2);
            ctx.fillRect(this.x - 1, this.y - s / 2, 2, s);
        } else {
            ctx.fillRect(this.x, this.y, this.size * alpha, this.size * alpha);
        }
        ctx.restore();
    }
}

const Effects = {
    particles: [],
    maxParticles: 500,

    emit(x, y, config) {
        const count = config.count || 10;
        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.maxParticles) break;
            const vx = (config.vx || 0) + (Math.random() - 0.5) * (config.spread || 6);
            const vy = (config.vy || -3) + (Math.random() - 0.5) * (config.spread || 6);
            const colors = config.colors || ['#fff'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const life = (config.life || 30) + Math.random() * 15;
            const size = (config.size || 4) + Math.random() * 3;
            const p = new Particle(x, y, vx, vy, color, life, size, config.type || 'square');
            if (config.gravity !== undefined) p.gravity = config.gravity;
            if (config.text) p.text = config.text;
            this.particles.push(p);
        }
    },

    explode(x, y, size) {
        const s = size || 'medium';
        const counts = { small: 12, medium: 25, large: 50, huge: 80 };
        const count = counts[s] || 25;
        this.emit(x, y, { count, colors: ['#ff6b35', '#f0d000', '#ff4444', '#fff', '#4fc3f7'], spread: s === 'huge' ? 16 : s === 'large' ? 12 : 8, vy: -2, life: s === 'huge' ? 50 : 35, size: s === 'huge' ? 8 : 5, type: 'star', gravity: 0.08 });
        this.emit(x, y, { count: Math.floor(count / 2), colors: ['#fff', '#ffeb3b'], spread: s === 'huge' ? 20 : 14, vy: 0, life: 20, size: s === 'huge' ? 14 : 9, type: 'circle', gravity: 0 });
    },

    scoreText(x, y, text, color) {
        const p = new Particle(x, y, 0, -2, color || '#f0d000', 50, 10, 'text');
        p.text = text; p.gravity = 0;
        this.particles.push(p);
    },

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].life <= 0) this.particles.splice(i, 1);
        }
    },

    draw(ctx) {
        for (const p of this.particles) p.draw(ctx);
    },

    clear() { this.particles = []; }
};
