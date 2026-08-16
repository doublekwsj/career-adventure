// Pixel art sprite generator - all sprites drawn programmatically
const Sprites = {
    cache: {},
    T: 32, // tile size

    // Player evolution levels (matches zones)
    // 0: Junior (intern look), 1: Engineer, 2: ML Engineer, 3: Senior,
    // 4: Staff, 5: Researcher/CEO, 6: Senior Data Scientist
    PLAYER_LEVELS: [
        { title: "Junior Engineer", shirt: '#6ab04c', badge: null, hat: null, aura: null },
        { title: "Engineer", shirt: '#4a90d9', badge: null, hat: 'goggles', aura: null },
        { title: "ML Engineer", shirt: '#9b59b6', badge: 'ML', hat: null, aura: null },
        { title: "Senior Engineer", shirt: '#e63946', badge: 'AI', hat: null, aura: '#f0d000' },
        { title: "Staff Engineer", shirt: '#e63946', badge: 'AI', hat: 'headset', aura: '#4fc3f7' },
        { title: "Researcher & CEO", shirt: '#2c3e50', badge: 'PhD', hat: 'graduation', aura: '#a78bfa' },
        { title: "Senior Data Scientist", shirt: '#1a1a2a', badge: 'DS', hat: 'crown', aura: '#f0d000' }
    ],

    init() {
        // Player sprites for each level
        for (let level = 0; level < this.PLAYER_LEVELS.length; level++) {
            const states = ['idle', 'run1', 'run2', 'jump', 'fall', 'power'];
            for (const state of states) {
                this.cache[`player_${level}_${state}_r`] = this._drawPlayer(state, 1, level);
                this.cache[`player_${level}_${state}_l`] = this._drawPlayer(state, -1, level);
            }
        }

        // Tiles per zone theme
        const themes = ['grassland', 'lab', 'city', 'factory', 'space', 'university', 'future'];
        themes.forEach(t => {
            this.cache[`ground_${t}`] = this._drawGround(t);
            this.cache[`ground_top_${t}`] = this._drawGroundTop(t);
            this.cache[`platform_${t}`] = this._drawPlatform(t);
        });

        // Entities
        this.cache.question_block = this._drawQuestionBlock(false);
        this.cache.question_block_hit = this._drawQuestionBlock(true);
        this.cache.coin_0 = this._drawCoinFrame(0);
        this.cache.coin_1 = this._drawCoinFrame(1);
        this.cache.coin_2 = this._drawCoinFrame(2);
        this.cache.coin_3 = this._drawCoinFrame(3);
        this.cache.trophy = this._drawTrophy();
        this.cache.sign = this._drawSign();
        this.cache.pipe_top = this._drawPipe('top');
        this.cache.pipe_body = this._drawPipe('body');
        this.cache.flag_pole = this._drawFlagPole();
        this.cache.flag_banner = this._drawFlagBanner();
        this.cache.powerup_star = this._drawPowerupStar();
        this.cache.powerup_speed = this._drawPowerupSpeed();
        this.cache.cloud_1 = this._drawCloud(80, 36);
        this.cache.cloud_2 = this._drawCloud(60, 28);
        this.cache.mountain = this._drawMountain();
        this.cache.building = this._drawBuilding();

        // Enemies
        this.cache.enemy_bug_1 = this._drawEnemyBug(false);
        this.cache.enemy_bug_2 = this._drawEnemyBug(true);
        this.cache.enemy_glitch_1 = this._drawEnemyGlitch(false);
        this.cache.enemy_glitch_2 = this._drawEnemyGlitch(true);
        this.cache.enemy_spam_1 = this._drawEnemySpam(false);
        this.cache.enemy_spam_2 = this._drawEnemySpam(true);
        this.cache.enemy_asteroid = this._drawEnemyAsteroid();
        this.cache.enemy_deadline_1 = this._drawEnemyDeadline(false);
        this.cache.enemy_deadline_2 = this._drawEnemyDeadline(true);
        this.cache.enemy_squished = this._drawSquished();

        // Boss
        this.cache.boss_robot_1 = this._drawBossRobot(false);
        this.cache.boss_robot_2 = this._drawBossRobot(true);
        this.cache.boss_professor_1 = this._drawBossProfessor(false);
        this.cache.boss_professor_2 = this._drawBossProfessor(true);
        this.cache.boss_ai_1 = this._drawBossAI(false);
        this.cache.boss_ai_2 = this._drawBossAI(true);
        this.cache.boss_showcase_1 = this._drawBossShowcase(false);
        this.cache.boss_showcase_2 = this._drawBossShowcase(true);

        // Moving platform
        this.cache.moving_platform = this._drawMovingPlatform();
    },

    get(name) {
        return this.cache[name];
    },

    _c(w, h) {
        const c = document.createElement('canvas');
        c.width = w || this.T;
        c.height = h || this.T;
        return c;
    },

    _drawPlayer(state, dir, level) {
        level = level || 0;
        const levelData = this.PLAYER_LEVELS[level];
        const c = this._c(32, 40);
        const ctx = c.getContext('2d');
        if (dir === -1) { ctx.translate(32, 0); ctx.scale(-1, 1); }

        const skin = '#ffd5a3';
        const hair = level >= 5 ? '#1a1a1a' : '#2a1a0a';
        const shirt = levelData.shirt;
        const pants = level >= 5 ? '#2c3e50' : '#1a3a6a';
        const shoes = level >= 4 ? '#1a1a1a' : '#5c3010';
        const belt = level >= 3 ? '#f0d000' : '#888';

        // Aura for high levels
        if (levelData.aura && state !== 'power') {
            ctx.shadowColor = levelData.aura;
            ctx.shadowBlur = 6;
        }
        if (state === 'power') {
            ctx.shadowColor = '#f0d000';
            ctx.shadowBlur = 10;
        }

        // Hat/accessory (drawn first, behind head for some)
        const headY = level >= 5 ? 4 : 5;

        // Head
        ctx.fillStyle = skin;
        ctx.fillRect(9, headY, 14, 13);
        // Hair
        ctx.fillStyle = hair;
        ctx.fillRect(9, headY - 1, 14, 5);
        ctx.fillRect(7, headY + 1, 3, 4);

        // Hat/accessory based on level
        if (levelData.hat === 'goggles') {
            ctx.fillStyle = '#4fc3f7';
            ctx.fillRect(8, headY + 5, 16, 3);
            ctx.fillStyle = '#81d4fa';
            ctx.fillRect(9, headY + 5, 5, 3);
            ctx.fillRect(17, headY + 5, 5, 3);
        } else if (levelData.hat === 'headset') {
            ctx.fillStyle = '#333';
            ctx.fillRect(6, headY + 2, 2, 8);
            ctx.fillRect(6, headY, 20, 2);
            ctx.fillStyle = '#4fc3f7';
            ctx.fillRect(5, headY + 7, 4, 4);
        } else if (levelData.hat === 'graduation') {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(6, headY - 4, 20, 3);
            ctx.fillRect(12, headY - 6, 8, 3);
            ctx.fillStyle = '#f0d000';
            ctx.fillRect(20, headY - 6, 2, 5);
        } else if (levelData.hat === 'crown') {
            ctx.fillStyle = '#f0d000';
            ctx.fillRect(8, headY - 5, 16, 5);
            ctx.fillStyle = '#ff6b6b';
            ctx.fillRect(10, headY - 4, 2, 2);
            ctx.fillRect(15, headY - 4, 2, 2);
            ctx.fillRect(20, headY - 4, 2, 2);
            // Crown points
            ctx.fillStyle = '#f0d000';
            ctx.fillRect(9, headY - 7, 3, 3);
            ctx.fillRect(14, headY - 8, 4, 3);
            ctx.fillRect(20, headY - 7, 3, 3);
        }

        // Eyes (more confident at higher levels)
        ctx.fillStyle = '#fff';
        ctx.fillRect(17, headY + 5, 5, 4);
        ctx.fillStyle = '#000';
        ctx.fillRect(19, headY + 6, 3, 3);
        if (level >= 4) {
            // Confident slight smile
            ctx.fillStyle = '#c0826a';
            ctx.fillRect(17, headY + 10, 5, 2);
        } else {
            ctx.fillStyle = '#c0826a';
            ctx.fillRect(18, headY + 10, 4, 2);
        }

        // Body
        const bodyY = headY + 13;
        ctx.fillStyle = shirt;
        ctx.fillRect(7, bodyY, 18, 11);
        // Belt
        ctx.fillStyle = belt;
        ctx.fillRect(7, bodyY + 9, 18, 2);

        // Badge on shirt
        if (levelData.badge) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 5px monospace';
            ctx.fillText(levelData.badge, 10, bodyY + 7);
        } else {
            ctx.fillStyle = '#fff';
            ctx.fillRect(12, bodyY + 3, 8, 2);
        }

        // Tie for senior levels
        if (level >= 5) {
            ctx.fillStyle = '#c0392b';
            ctx.fillRect(14, bodyY, 4, 9);
            ctx.fillRect(13, bodyY, 6, 2);
        }

        const legY = bodyY + 11;
        switch (state) {
            case 'idle':
                ctx.fillStyle = pants;
                ctx.fillRect(9, legY, 6, 8);
                ctx.fillRect(17, legY, 6, 8);
                ctx.fillStyle = shoes;
                ctx.fillRect(8, legY + 7, 7, 3);
                ctx.fillRect(17, legY + 7, 7, 3);
                break;
            case 'run1':
                ctx.fillStyle = pants;
                ctx.fillRect(7, legY, 6, 7);
                ctx.fillRect(19, legY, 6, 5);
                ctx.fillStyle = shoes;
                ctx.fillRect(6, legY + 6, 7, 3);
                ctx.fillRect(19, legY + 4, 7, 3);
                break;
            case 'run2':
                ctx.fillStyle = pants;
                ctx.fillRect(11, legY, 6, 5);
                ctx.fillRect(15, legY, 6, 8);
                ctx.fillStyle = shoes;
                ctx.fillRect(10, legY + 4, 7, 3);
                ctx.fillRect(15, legY + 7, 7, 3);
                break;
            case 'jump':
                ctx.fillStyle = skin;
                ctx.fillRect(3, bodyY - 3, 5, 8);
                ctx.fillRect(24, bodyY - 3, 5, 8);
                ctx.fillStyle = pants;
                ctx.fillRect(10, legY, 6, 4);
                ctx.fillRect(16, legY, 6, 4);
                ctx.fillStyle = shoes;
                ctx.fillRect(10, legY + 3, 6, 3);
                ctx.fillRect(16, legY + 3, 6, 3);
                break;
            case 'fall':
                ctx.fillStyle = pants;
                ctx.fillRect(8, legY, 7, 7);
                ctx.fillRect(17, legY, 7, 7);
                ctx.fillStyle = shoes;
                ctx.fillRect(7, legY + 6, 8, 3);
                ctx.fillRect(17, legY + 6, 8, 3);
                ctx.fillStyle = skin;
                ctx.fillRect(2, bodyY + 2, 5, 5);
                ctx.fillRect(25, bodyY + 2, 5, 5);
                break;
            case 'power':
                ctx.fillStyle = pants;
                ctx.fillRect(9, legY, 6, 8);
                ctx.fillRect(17, legY, 6, 8);
                ctx.fillStyle = shoes;
                ctx.fillRect(8, legY + 7, 7, 3);
                ctx.fillRect(17, legY + 7, 7, 3);
                break;
        }
        return c;
    },

    _themeColors(theme) {
        const colors = {
            grassland: { ground: '#8B5E3C', top: '#4a8c2a', accent: '#3a7020', dark: '#5a3a1a' },
            lab: { ground: '#4a4a6a', top: '#6a6a8a', accent: '#8a8aaa', dark: '#2a2a4a' },
            city: { ground: '#4a4a4a', top: '#6a6a6a', accent: '#888', dark: '#2a2a2a' },
            factory: { ground: '#5a4a3a', top: '#7a6a5a', accent: '#8a7a6a', dark: '#3a3020' },
            space: { ground: '#2a2a4a', top: '#3a3a5a', accent: '#4a4a7a', dark: '#1a1a2a' },
            university: { ground: '#4a5a3a', top: '#5a7a4a', accent: '#6a8a5a', dark: '#3a4a2a' },
            future: { ground: '#1a3a4a', top: '#2a5a6a', accent: '#3a7a8a', dark: '#0a2a3a' }
        };
        return colors[theme] || colors.grassland;
    },

    _drawGround(theme) {
        const c = this._c();
        const ctx = c.getContext('2d');
        const col = this._themeColors(theme);
        ctx.fillStyle = col.ground;
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = col.dark;
        // Brick pattern
        for (let y = 0; y < 32; y += 8) {
            const off = (y % 16 === 0) ? 0 : 8;
            ctx.beginPath();
            for (let x = off; x < 32; x += 16) {
                ctx.rect(x, y, 15, 7);
            }
            ctx.stroke();
        }
        return c;
    },

    _drawGroundTop(theme) {
        const c = this._c();
        const ctx = c.getContext('2d');
        const col = this._themeColors(theme);
        ctx.fillStyle = col.top;
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = col.accent;
        // Decorative top
        for (let x = 0; x < 32; x += 3) {
            const h = 3 + Math.sin(x * 0.5) * 2;
            ctx.fillRect(x, 0, 2, h);
        }
        // Spots
        ctx.fillStyle = col.ground;
        ctx.fillRect(4, 20, 4, 4);
        ctx.fillRect(18, 24, 5, 5);
        return c;
    },

    _drawPlatform(theme) {
        const c = this._c();
        const ctx = c.getContext('2d');
        const col = this._themeColors(theme);
        ctx.fillStyle = col.top;
        ctx.fillRect(0, 0, 32, 12);
        ctx.fillStyle = col.accent;
        ctx.fillRect(0, 0, 32, 3);
        ctx.fillStyle = col.ground;
        ctx.fillRect(0, 12, 32, 20);
        // Bolts
        ctx.fillStyle = '#888';
        ctx.fillRect(4, 5, 3, 3);
        ctx.fillRect(25, 5, 3, 3);
        return c;
    },

    _drawQuestionBlock(hit) {
        const c = this._c();
        const ctx = c.getContext('2d');
        // Animated glow for active blocks
        ctx.fillStyle = hit ? '#6a5010' : '#f0a000';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = hit ? '#5a4010' : '#f0d000';
        ctx.fillRect(2, 2, 28, 28);

        if (!hit) {
            // Shine
            ctx.fillStyle = '#ffe070';
            ctx.fillRect(4, 4, 8, 8);
            // ? mark
            ctx.fillStyle = '#8B4513';
            ctx.font = 'bold 16px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', 16, 17);
        }
        // Rivets
        ctx.fillStyle = hit ? '#4a3010' : '#b8860b';
        ctx.fillRect(2, 2, 4, 4);
        ctx.fillRect(26, 2, 4, 4);
        ctx.fillRect(2, 26, 4, 4);
        ctx.fillRect(26, 26, 4, 4);
        // Border
        ctx.strokeStyle = hit ? '#3a2000' : '#8B4513';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, 30, 30);
        return c;
    },

    _drawCoinFrame(frame) {
        const c = this._c(20, 20);
        const ctx = c.getContext('2d');
        const widths = [8, 6, 4, 6];
        const w = widths[frame];
        ctx.fillStyle = '#f0d000';
        ctx.beginPath();
        ctx.ellipse(10, 10, w, 9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#b8860b';
        ctx.beginPath();
        ctx.ellipse(10, 10, w * 0.5, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f0d000';
        ctx.beginPath();
        ctx.ellipse(10, 10, w * 0.3, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        return c;
    },

    _drawTrophy() {
        const c = this._c(28, 32);
        const ctx = c.getContext('2d');
        // Cup
        ctx.fillStyle = '#f0d000';
        ctx.fillRect(6, 4, 16, 14);
        ctx.fillRect(4, 4, 20, 4);
        // Handles
        ctx.fillRect(2, 6, 4, 8);
        ctx.fillRect(22, 6, 4, 8);
        // Stem
        ctx.fillStyle = '#b8860b';
        ctx.fillRect(11, 18, 6, 6);
        // Base
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(7, 24, 14, 4);
        ctx.fillRect(5, 27, 18, 3);
        // Star
        ctx.fillStyle = '#fff';
        ctx.font = '8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('*', 14, 13);
        return c;
    },

    _drawSign() {
        const c = this._c(64, 56);
        const ctx = c.getContext('2d');
        // Posts
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(8, 30, 5, 26);
        ctx.fillRect(51, 30, 5, 26);
        // Board
        ctx.fillStyle = '#deb887';
        ctx.fillRect(2, 2, 60, 32);
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.strokeRect(2, 2, 60, 32);
        // Inner border
        ctx.strokeStyle = '#a0784a';
        ctx.lineWidth = 1;
        ctx.strokeRect(5, 5, 54, 26);
        return c;
    },

    _drawPipe(part) {
        const c = this._c(48, 32);
        const ctx = c.getContext('2d');
        if (part === 'top') {
            // Main body
            ctx.fillStyle = '#2d8c2d';
            ctx.fillRect(4, 10, 40, 22);
            // Lip
            ctx.fillStyle = '#3aac3a';
            ctx.fillRect(0, 0, 48, 12);
            // Highlight
            ctx.fillStyle = '#5adc5a';
            ctx.fillRect(2, 2, 6, 8);
            // Shadow
            ctx.fillStyle = '#1a6b1a';
            ctx.fillRect(40, 2, 6, 8);
            ctx.fillRect(4, 10, 40, 3);
        } else {
            ctx.fillStyle = '#2d8c2d';
            ctx.fillRect(6, 0, 36, 32);
            ctx.fillStyle = '#5adc5a';
            ctx.fillRect(8, 0, 6, 32);
            ctx.fillStyle = '#1a6b1a';
            ctx.fillRect(36, 0, 6, 32);
        }
        return c;
    },

    _drawFlagPole() {
        const c = this._c(8, 160);
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#888';
        ctx.fillRect(2, 0, 4, 160);
        ctx.fillStyle = '#f0d000';
        ctx.beginPath();
        ctx.arc(4, 4, 4, 0, Math.PI * 2);
        ctx.fill();
        return c;
    },

    _drawFlagBanner() {
        const c = this._c(40, 28);
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#e63946';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(38, 8);
        ctx.lineTo(38, 20);
        ctx.lineTo(0, 28);
        ctx.closePath();
        ctx.fill();
        // W letter
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('W', 14, 18);
        return c;
    },

    _drawPowerupStar() {
        const c = this._c(24, 24);
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#f0d000';
        ctx.beginPath();
        for (let i = 0; i < 10; i++) {
            const r = i % 2 === 0 ? 11 : 5;
            const angle = (i * Math.PI) / 5 - Math.PI / 2;
            const x = 12 + Math.cos(angle) * r;
            const y = 12 + Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ffe070';
        ctx.beginPath();
        ctx.arc(10, 9, 3, 0, Math.PI * 2);
        ctx.fill();
        return c;
    },

    _drawPowerupSpeed() {
        const c = this._c(24, 24);
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#4fc3f7';
        ctx.beginPath();
        ctx.moveTo(6, 4);
        ctx.lineTo(20, 12);
        ctx.lineTo(6, 20);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#81d4fa';
        ctx.fillRect(2, 8, 10, 2);
        ctx.fillRect(4, 12, 8, 2);
        ctx.fillRect(2, 16, 10, 2);
        return c;
    },

    _drawCloud(w, h) {
        const c = this._c(w, h);
        const ctx = c.getContext('2d');
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        const cx = w / 2, cy = h / 2;
        ctx.beginPath();
        ctx.ellipse(cx - w * 0.2, cy + 2, w * 0.2, h * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx, cy - 2, w * 0.25, h * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(cx + w * 0.2, cy + 2, w * 0.18, h * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();
        return c;
    },

    _drawMountain() {
        const c = this._c(120, 80);
        const ctx = c.getContext('2d');
        ctx.fillStyle = 'rgba(40,60,40,0.5)';
        ctx.beginPath();
        ctx.moveTo(0, 80);
        ctx.lineTo(60, 10);
        ctx.lineTo(120, 80);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.moveTo(50, 20);
        ctx.lineTo(60, 10);
        ctx.lineTo(70, 20);
        ctx.closePath();
        ctx.fill();
        return c;
    },

    _drawBuilding() {
        const c = this._c(40, 100);
        const ctx = c.getContext('2d');
        ctx.fillStyle = 'rgba(30,30,50,0.6)';
        ctx.fillRect(0, 0, 40, 100);
        // Windows
        ctx.fillStyle = 'rgba(255,200,50,0.4)';
        for (let y = 5; y < 95; y += 12) {
            for (let x = 5; x < 35; x += 10) {
                if (Math.random() > 0.3) ctx.fillRect(x, y, 6, 8);
            }
        }
        return c;
    },

    _drawMovingPlatform() {
        const c = this._c(64, 16);
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#8a8a8a';
        ctx.fillRect(0, 0, 64, 16);
        ctx.fillStyle = '#aaa';
        ctx.fillRect(0, 0, 64, 4);
        ctx.fillStyle = '#666';
        ctx.fillRect(0, 12, 64, 4);
        // Bolts
        ctx.fillStyle = '#f0d000';
        ctx.fillRect(4, 6, 4, 4);
        ctx.fillRect(28, 6, 4, 4);
        ctx.fillRect(56, 6, 4, 4);
        return c;
    },

    // Enemies
    _drawEnemyBug(alt) {
        const c = this._c(28, 24);
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#c0392b';
        ctx.fillRect(4, 6, 20, 14);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(6, 4, 16, 4);
        // Antennae
        ctx.fillStyle = '#000';
        ctx.fillRect(8, 0, 2, 5);
        ctx.fillRect(18, 0, 2, 5);
        // Eyes
        ctx.fillStyle = '#fff';
        ctx.fillRect(8, 8, 4, 4);
        ctx.fillRect(16, 8, 4, 4);
        ctx.fillStyle = '#000';
        ctx.fillRect(9, 9, 2, 2);
        ctx.fillRect(17, 9, 2, 2);
        // Legs
        ctx.fillStyle = '#000';
        if (alt) {
            ctx.fillRect(4, 20, 4, 4);
            ctx.fillRect(20, 18, 4, 4);
        } else {
            ctx.fillRect(4, 18, 4, 4);
            ctx.fillRect(20, 20, 4, 4);
        }
        return c;
    },

    _drawEnemyGlitch(alt) {
        const c = this._c(28, 28);
        const ctx = c.getContext('2d');
        const offset = alt ? 2 : 0;
        // Glitchy rectangles
        ctx.fillStyle = '#9b59b6';
        ctx.fillRect(2 + offset, 4, 10, 20);
        ctx.fillStyle = '#8e44ad';
        ctx.fillRect(14 - offset, 2, 12, 24);
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(6, 10 + offset, 16, 8);
        // Static lines
        ctx.fillStyle = '#fff';
        ctx.fillRect(4, 8 + offset, 20, 1);
        ctx.fillRect(8, 16 - offset, 12, 1);
        // Eyes
        ctx.fillStyle = '#0f0';
        ctx.fillRect(8, 12, 3, 3);
        ctx.fillRect(17, 12, 3, 3);
        return c;
    },

    _drawEnemySpam(alt) {
        const c = this._c(30, 22);
        const ctx = c.getContext('2d');
        // Envelope
        ctx.fillStyle = alt ? '#e8e8e8' : '#ddd';
        ctx.fillRect(2, 4, 26, 16);
        ctx.strokeStyle = '#999';
        ctx.strokeRect(2, 4, 26, 16);
        // Flap
        ctx.fillStyle = '#bbb';
        ctx.beginPath();
        ctx.moveTo(2, 4);
        ctx.lineTo(15, 12);
        ctx.lineTo(28, 4);
        ctx.closePath();
        ctx.fill();
        // Red X
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('SPAM', 5, 18);
        return c;
    },

    _drawEnemyAsteroid() {
        const c = this._c(30, 30);
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#666';
        ctx.beginPath();
        ctx.arc(15, 15, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.arc(10, 10, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(18, 18, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#777';
        ctx.beginPath();
        ctx.arc(20, 8, 2, 0, Math.PI * 2);
        ctx.fill();
        return c;
    },

    _drawEnemyDeadline(alt) {
        const c = this._c(28, 28);
        const ctx = c.getContext('2d');
        // Clock body
        ctx.fillStyle = '#ecf0f1';
        ctx.beginPath();
        ctx.arc(14, 14, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e74c3c';
        ctx.lineWidth = 2;
        ctx.stroke();
        // Clock hands
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(14, 14);
        ctx.lineTo(14, 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(14, 14);
        const angle = alt ? 1.2 : 0.8;
        ctx.lineTo(14 + Math.cos(angle) * 8, 14 + Math.sin(angle) * 8);
        ctx.stroke();
        // D-Day text
        ctx.fillStyle = '#e74c3c';
        ctx.font = 'bold 6px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('D-0', 14, 24);
        return c;
    },

    _drawSquished() {
        const c = this._c(30, 10);
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#888';
        ctx.fillRect(2, 2, 26, 6);
        ctx.fillStyle = '#555';
        ctx.fillRect(4, 4, 22, 2);
        return c;
    },

    // Bosses
    _drawBossRobot(alt) {
        const c = this._c(64, 64);
        const ctx = c.getContext('2d');
        const jolt = alt ? 2 : 0;
        // Body
        ctx.fillStyle = '#5a5a5a';
        ctx.fillRect(12, 20 + jolt, 40, 30);
        // Head
        ctx.fillStyle = '#7a7a7a';
        ctx.fillRect(16, 4 + jolt, 32, 18);
        // Eyes (red/alert)
        ctx.fillStyle = alt ? '#ff0000' : '#ff4444';
        ctx.fillRect(20, 10 + jolt, 8, 6);
        ctx.fillRect(34, 10 + jolt, 8, 6);
        // Arms
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(4, 24 + jolt, 8, 20);
        ctx.fillRect(52, 24 + jolt, 8, 20);
        // Legs
        ctx.fillRect(16, 50 + jolt, 10, 12);
        ctx.fillRect(38, 50 + jolt, 10, 12);
        // "LEGACY" text
        ctx.fillStyle = '#f00';
        ctx.font = '6px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('LEGACY', 32, 38 + jolt);
        return c;
    },

    _drawBossProfessor(alt) {
        const c = this._c(56, 64);
        const ctx = c.getContext('2d');
        const bob = alt ? -2 : 0;
        // Body (suit)
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(14, 28 + bob, 28, 28);
        // Head
        ctx.fillStyle = '#ffd5a3';
        ctx.fillRect(16, 6 + bob, 24, 22);
        // Glasses
        ctx.fillStyle = '#000';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(17, 14 + bob, 9, 7);
        ctx.strokeRect(29, 14 + bob, 9, 7);
        ctx.fillRect(26, 16 + bob, 3, 2);
        // Hair
        ctx.fillStyle = '#888';
        ctx.fillRect(16, 4 + bob, 24, 6);
        // Book
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(alt ? 42 : 44, 32 + bob, 10, 14);
        // "THESIS" label
        ctx.fillStyle = '#fff';
        ctx.font = '5px monospace';
        ctx.fillText('PASS?', 28, 48 + bob);
        return c;
    },

    _drawBossAI(alt) {
        const c = this._c(64, 64);
        const ctx = c.getContext('2d');
        // Neural network visualization
        ctx.strokeStyle = alt ? '#4fc3f7' : '#0288d1';
        ctx.lineWidth = 1;
        const nodes = [];
        for (let layer = 0; layer < 4; layer++) {
            const count = [3, 5, 5, 3][layer];
            for (let n = 0; n < count; n++) {
                const x = 10 + layer * 16;
                const y = 12 + n * (40 / count);
                nodes.push({ x, y, layer });
            }
        }
        // Connections
        for (const n1 of nodes) {
            for (const n2 of nodes) {
                if (n2.layer === n1.layer + 1) {
                    ctx.beginPath();
                    ctx.moveTo(n1.x, n1.y);
                    ctx.lineTo(n2.x, n2.y);
                    ctx.stroke();
                }
            }
        }
        // Nodes
        for (const n of nodes) {
            ctx.fillStyle = alt ? '#4fc3f7' : '#81d4fa';
            ctx.beginPath();
            ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        // Eye
        ctx.fillStyle = alt ? '#f44' : '#ff8';
        ctx.beginPath();
        ctx.arc(32, 48, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(32, 48, 4, 0, Math.PI * 2);
        ctx.fill();
        // Label
        ctx.fillStyle = '#fff';
        ctx.font = '6px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('A.G.I.', 32, 62);
        return c;
    },

    _drawBossShowcase(alt) {
        const c = this._c(64, 56);
        const ctx = c.getContext('2d');
        const glow = alt ? 0.8 : 0.4;
        // Stage/podium
        ctx.fillStyle = `rgba(240,208,0,${glow})`;
        ctx.fillRect(4, 40, 56, 16);
        // Screen
        ctx.fillStyle = '#111';
        ctx.fillRect(8, 4, 48, 34);
        ctx.strokeStyle = '#f0d000';
        ctx.lineWidth = 2;
        ctx.strokeRect(8, 4, 48, 34);
        // "CES" text
        ctx.fillStyle = alt ? '#f0d000' : '#fff';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CES', 32, 24);
        ctx.font = '6px monospace';
        ctx.fillText('2020', 32, 34);
        return c;
    }
};
