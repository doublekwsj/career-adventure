class Particle {
    constructor(x, y, vx, vy, color, life, size, type) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = size;
        this.type = type || 'square'; // square, circle, star, text
        this.text = '';
        this.gravity = 0.15;
        this.alpha = 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.life--;
        this.alpha = this.life / this.maxLife;
        this.rotation += this.rotSpeed;
    }

    draw(ctx, camera) {
        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.translate(drawX, drawY);
        ctx.rotate(this.rotation);

        if (this.type === 'star') {
            ctx.fillStyle = this.color;
            this._drawStar(ctx, 0, 0, 5, this.size, this.size * 0.4);
        } else if (this.type === 'text') {
            ctx.fillStyle = this.color;
            ctx.font = `bold ${this.size}px "Press Start 2P", monospace`;
            ctx.textAlign = 'center';
            ctx.fillText(this.text, 0, 0);
        } else if (this.type === 'circle') {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }

        ctx.restore();
    }

    _drawStar(ctx, cx, cy, spikes, outerR, innerR) {
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const r = i % 2 === 0 ? outerR : innerR;
            const angle = (i * Math.PI) / spikes - Math.PI / 2;
            const x = cx + Math.cos(angle) * r;
            const y = cy + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
    }
}

const Particles = {
    particles: [],
    maxParticles: 200,

    emit(x, y, config) {
        const count = config.count || 10;
        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.maxParticles) break;
            const vx = (config.vx || 0) + (Math.random() - 0.5) * (config.spread || 4);
            const vy = (config.vy || -3) + (Math.random() - 0.5) * (config.spread || 4);
            const color = Array.isArray(config.colors) ?
                config.colors[Math.floor(Math.random() * config.colors.length)] : (config.colors || '#fff');
            const life = (config.life || 30) + Math.random() * 20;
            const size = (config.size || 3) + Math.random() * 2;
            const p = new Particle(x, y, vx, vy, color, life, size, config.type);
            if (config.gravity !== undefined) p.gravity = config.gravity;
            if (config.text) p.text = config.text;
            this.particles.push(p);
        }
    },

    // Preset effects
    coinCollect(x, y) {
        this.emit(x, y, {
            count: 8,
            colors: ['#f0d000', '#ffeb3b', '#fff'],
            spread: 3,
            vy: -4,
            life: 20,
            size: 3,
            type: 'star'
        });
    },

    blockHit(x, y) {
        this.emit(x, y, {
            count: 6,
            colors: ['#f0d000', '#b8860b'],
            spread: 5,
            vy: -5,
            life: 25,
            size: 4,
            type: 'square'
        });
    },

    trophyCollect(x, y) {
        this.emit(x, y, {
            count: 25,
            colors: ['#f0d000', '#ffeb3b', '#fff', '#ff6b6b', '#4fc3f7'],
            spread: 8,
            vy: -5,
            life: 50,
            size: 5,
            type: 'star'
        });
    },

    enemyDefeat(x, y, colors) {
        const c = colors || ['#ff6b35', '#f0d000', '#ff4444', '#fff', '#4fc3f7'];
        // Big star burst
        this.emit(x, y, { count: 18, colors: c, spread: 9, vy: -5, life: 40, size: 6, type: 'star', gravity: 0.18 });
        // Shockwave ring
        this.emit(x, y, { count: 10, colors: ['#fff', '#ffeb3b'], spread: 12, vy: -1, life: 18, size: 9, type: 'circle', gravity: 0 });
        // Micro debris
        this.emit(x, y, { count: 8, colors: c, spread: 5, vx: 0, vy: -7, life: 25, size: 3, type: 'square', gravity: 0.35 });
    },

    bigExplosion(x, y) {
        this.emit(x, y, { count: 30, colors: ['#ff6b35', '#f0d000', '#ff4444', '#fff'], spread: 14, vy: -6, life: 50, size: 7, type: 'star', gravity: 0.15 });
        this.emit(x, y, { count: 15, colors: ['#fff', '#ffeb3b', '#ff6b35'], spread: 18, vy: 0, life: 25, size: 12, type: 'circle', gravity: 0 });
        this.emit(x, y, { count: 12, colors: ['#f44336', '#ff6b6b'], spread: 8, vy: -9, life: 35, size: 4, type: 'square', gravity: 0.4 });
    },

    scorePopup(x, y, score) {
        const color = score >= 500 ? '#f0d000' : score >= 200 ? '#4fc3f7' : '#fff';
        const p = new Particle(x, y, 0, -2.5, color, 50, 12, 'text');
        p.text = `+${score}`;
        p.gravity = 0;
        this.particles.push(p);
    },

    comboText(x, y, combo) {
        const p = new Particle(x, y - 20, 0, -1.5, '#f0d000', 60, 14, 'text');
        p.text = `COMBO x${combo}!`;
        p.gravity = 0;
        this.particles.push(p);
    },

    powerupEffect(x, y) {
        this.emit(x, y, {
            count: 20,
            colors: ['#4caf50', '#8bc34a', '#fff', '#f0d000'],
            spread: 6,
            vy: -3,
            life: 40,
            size: 4,
            type: 'star',
            gravity: 0.05
        });
    },

    dustTrail(x, y) {
        this.emit(x, y, {
            count: 2,
            colors: ['rgba(255,255,255,0.5)', 'rgba(200,200,200,0.3)'],
            spread: 1,
            vx: 0,
            vy: -0.5,
            life: 15,
            size: 3,
            type: 'circle',
            gravity: 0
        });
    },

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    },

    draw(ctx, camera) {
        for (const p of this.particles) {
            p.draw(ctx, camera);
        }
    },

    clear() {
        this.particles = [];
    }
};
