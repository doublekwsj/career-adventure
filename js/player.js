class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 26;
        this.h = 36;
        this.vx = 0;
        this.vy = 0;
        this.onGround = false;
        this.facing = 1;
        this.animFrame = 0;
        this.animTimer = 0;

        // Physics tuning
        this.speed = 4.5;
        this.maxSpeed = 6;
        this.acceleration = 0.4;
        this.deceleration = 0.3;
        this.jumpForce = -12;
        this.jumpHoldForce = -0.5;
        this.jumpHoldTime = 0;
        this.maxJumpHold = 12;
        this.coyoteTime = 0;
        this.maxCoyoteTime = 6;
        this.jumpBufferTime = 0;
        this.maxJumpBuffer = 8;

        // Level / growth
        this.level = 0; // 0~6, matches zone index
        this.levelUpTimer = 0;

        // State
        this.state = 'idle'; // idle, run, jump, fall, power
        this.powered = false;
        this.powerTimer = 0;
        this.invincible = false;
        this.invincibleTimer = 0;
        this.speedBoost = false;
        this.speedTimer = 0;
        this.score = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.hp = 3;
        this.maxHp = 3;
        this.dead = false;
        this.dustTimer = 0;
    }

    setLevel(level) {
        if (level <= this.level) return;
        this.level = level;
        this.levelUpTimer = 60;
        // Stats grow with level
        this.maxSpeed = 6 + level * 0.3;
        this.jumpForce = -12 - level * 0.3;
        this.maxHp = 3 + Math.floor(level / 2);
        this.hp = this.maxHp;
        Particles.powerupEffect(this.x + this.w / 2, this.y + this.h / 2);
        Audio.play('powerup');
    }

    update() {
        if (this.levelUpTimer > 0) this.levelUpTimer--;
        const speed = this.speedBoost ? this.maxSpeed * 1.5 : this.maxSpeed;
        const accel = this.acceleration;

        // Horizontal movement with acceleration
        if (Input.isDown('ArrowLeft') || Input.isDown('KeyA')) {
            this.vx = Math.max(this.vx - accel, -speed);
            this.facing = -1;
        } else if (Input.isDown('ArrowRight') || Input.isDown('KeyD')) {
            this.vx = Math.min(this.vx + accel, speed);
            this.facing = 1;
        } else {
            // Deceleration
            if (this.vx > 0) this.vx = Math.max(0, this.vx - this.deceleration);
            else if (this.vx < 0) this.vx = Math.min(0, this.vx + this.deceleration);
        }

        // Coyote time
        if (this.onGround) {
            this.coyoteTime = this.maxCoyoteTime;
        } else {
            this.coyoteTime--;
        }

        // Jump buffer
        if (Input.wasPressed('Space') || Input.wasPressed('ArrowUp') || Input.wasPressed('KeyW')) {
            this.jumpBufferTime = this.maxJumpBuffer;
        }
        if (this.jumpBufferTime > 0) this.jumpBufferTime--;

        // Jump
        if (this.jumpBufferTime > 0 && this.coyoteTime > 0) {
            this.vy = this.jumpForce;
            this.onGround = false;
            this.coyoteTime = 0;
            this.jumpBufferTime = 0;
            this.jumpHoldTime = this.maxJumpHold;
            Audio.play('jump');
        }

        // Variable jump height (hold for higher)
        if (this.jumpHoldTime > 0 && (Input.isDown('Space') || Input.isDown('ArrowUp') || Input.isDown('KeyW'))) {
            this.vy += this.jumpHoldForce;
            this.jumpHoldTime--;
        } else {
            this.jumpHoldTime = 0;
        }

        // State determination
        if (!this.onGround) {
            this.state = this.vy < 0 ? 'jump' : 'fall';
        } else if (Math.abs(this.vx) > 0.5) {
            this.state = 'run';
        } else {
            this.state = 'idle';
        }

        if (this.powered) this.state = 'power';

        // Run animation
        if (this.state === 'run') {
            this.animTimer++;
            if (this.animTimer > 6) {
                this.animTimer = 0;
                this.animFrame = (this.animFrame + 1) % 2;
            }
            // Dust particles when running
            this.dustTimer++;
            if (this.dustTimer > 4) {
                this.dustTimer = 0;
                Particles.dustTrail(this.x + this.w / 2, this.y + this.h);
            }
        }

        // Timers
        if (this.powerTimer > 0) {
            this.powerTimer--;
            if (this.powerTimer <= 0) this.powered = false;
        }
        if (this.invincibleTimer > 0) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) this.invincible = false;
        }
        if (this.speedTimer > 0) {
            this.speedTimer--;
            if (this.speedTimer <= 0) this.speedBoost = false;
        }
        if (this.comboTimer > 0) {
            this.comboTimer--;
            if (this.comboTimer <= 0) this.combo = 0;
        }

        // Bounds
        if (this.x < 0) { this.x = 0; this.vx = 0; }
    }

    hit() {
        if (this.invincible || this.powered) return;
        this.hp--;
        this.invincible = true;
        this.invincibleTimer = 60;
        Audio.play('hurt');
        Utils.startShake(6, 15);
        if (this.hp <= 0) {
            this.dead = true;
        }
    }

    addScore(points) {
        this.combo++;
        this.comboTimer = 120;
        const multiplier = Math.min(this.combo, 5);
        const total = points * multiplier;
        this.score += total;
        Particles.scorePopup(this.x + this.w / 2, this.y - 10, total);
    }

    powerUp(type) {
        if (type === 'star') {
            this.powered = true;
            this.powerTimer = 300;
            this.invincible = true;
            this.invincibleTimer = 300;
            Audio.play('powerup');
            Particles.powerupEffect(this.x + this.w / 2, this.y + this.h / 2);
        } else if (type === 'speed') {
            this.speedBoost = true;
            this.speedTimer = 300;
            Audio.play('powerup');
        }
    }

    draw(ctx, camera) {
        // Invincibility flicker
        if (this.invincible && !this.powered && Math.floor(this.invincibleTimer / 3) % 2 === 0) {
            return;
        }

        const dir = this.facing === 1 ? 'r' : 'l';
        let stateName;

        if (this.powered) {
            stateName = 'power';
        } else if (this.state === 'jump') {
            stateName = 'jump';
        } else if (this.state === 'fall') {
            stateName = 'fall';
        } else if (this.state === 'run') {
            stateName = `run${this.animFrame + 1}`;
        } else {
            stateName = 'idle';
        }

        const spriteName = `player_${this.level}_${stateName}_${dir}`;
        const sprite = Sprites.get(spriteName);
        const drawX = Math.round(this.x - camera.x + Utils.shake.x);
        const drawY = Math.round(this.y - camera.y + Utils.shake.y);

        // Level up flash
        if (this.levelUpTimer > 0) {
            ctx.save();
            ctx.globalAlpha = this.levelUpTimer / 60 * 0.6;
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(drawX + this.w / 2, drawY + this.h / 2, 30 + (60 - this.levelUpTimer), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // Power/aura glow
        const levelData = Sprites.PLAYER_LEVELS[this.level];
        if (this.powered || (levelData.aura && this.levelUpTimer <= 0)) {
            ctx.save();
            ctx.globalAlpha = 0.2 + Math.sin(Date.now() * 0.008) * 0.1;
            ctx.fillStyle = this.powered ? '#f0d000' : levelData.aura;
            ctx.beginPath();
            ctx.arc(drawX + this.w / 2, drawY + this.h / 2, 22, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        ctx.drawImage(sprite, drawX - 3, drawY);
    }
}
