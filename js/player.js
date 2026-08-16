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
        this.lives = 3;
        this.dead = false;
        this.gameOver = false;
        this.dustTimer = 0;

        // Double jump
        this.jumpsLeft = 2;
        this.maxJumps = 2;

        // Dash
        this.dashing = false;
        this.dashTimer = 0;
        this.dashCooldown = 0;
        this.dashSpeed = 14;
        this.dashDuration = 12;
        this.dashCooldownMax = 40;

        // Attack
        this.attacking = false;
        this.attackTimer = 0;
        this.attackCooldown = 0;
        this.attackDuration = 14;
        this.attackCooldownMax = 24;
        this.attackHitSet = new Set(); // enemies hit in current attack swing
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

        // Reset jumps on ground
        if (this.onGround) {
            this.jumpsLeft = this.maxJumps;
        }

        // Jump (with double jump)
        if (this.jumpBufferTime > 0 && (this.coyoteTime > 0 || this.jumpsLeft > 0)) {
            if (this.coyoteTime > 0) {
                // Normal first jump
                this.vy = this.jumpForce;
                this.onGround = false;
                this.coyoteTime = 0;
                this.jumpsLeft = this.maxJumps - 1;
            } else if (this.jumpsLeft > 0) {
                // Double jump (air jump)
                this.vy = this.jumpForce * 0.85;
                this.jumpsLeft--;
                Particles.emit(this.x + this.w / 2, this.y + this.h, {
                    count: 6, colors: ['#fff', '#4fc3f7'], spread: 3,
                    vy: 1, life: 15, size: 3, type: 'circle', gravity: 0
                });
            }
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

        // Attack
        if (this.attackCooldown > 0) this.attackCooldown--;
        if ((Input.wasPressed('KeyZ') || Input.wasPressed('KeyJ') || Input.wasPressed('KeyC')) && this.attackCooldown <= 0 && !this.attacking && !this.dashing) {
            this.attacking = true;
            this.attackTimer = this.attackDuration;
            this.attackCooldown = this.attackCooldownMax;
            this.attackHitSet.clear();
            Audio.play('stomp');
            Particles.emit(
                this.facing === 1 ? this.x + this.w + 10 : this.x - 10,
                this.y + this.h * 0.4,
                { count: 5, colors: ['#f0d000', '#fff', '#ff6b6b'], spread: 3, vx: this.facing * 4, vy: -1, life: 10, size: 4, type: 'star', gravity: 0.1 }
            );
        }
        if (this.attacking) {
            this.attackTimer--;
            if (this.attackTimer <= 0) {
                this.attacking = false;
                this.attackHitSet.clear();
            }
        }

        // Dash
        if (this.dashCooldown > 0) this.dashCooldown--;
        if ((Input.wasPressed('ShiftLeft') || Input.wasPressed('ShiftRight') || Input.wasPressed('KeyX')) && this.dashCooldown <= 0 && !this.dashing) {
            this.dashing = true;
            this.dashTimer = this.dashDuration;
            this.dashCooldown = this.dashCooldownMax;
            this.vy = 0; // freeze vertical during dash
            Audio.play('powerup');
            Particles.emit(this.x + this.w / 2, this.y + this.h / 2, {
                count: 8, colors: ['#4fc3f7', '#81d4fa', '#fff'], spread: 2,
                vx: -this.facing * 3, vy: 0, life: 15, size: 4, type: 'circle', gravity: 0
            });
        }
        if (this.dashing) {
            this.vx = this.facing * this.dashSpeed;
            this.dashTimer--;
            // Dash trail particles
            Particles.emit(this.x + this.w / 2, this.y + this.h / 2, {
                count: 1, colors: ['#4fc3f7'], spread: 1,
                vx: -this.facing * 2, vy: 0, life: 10, size: 3, type: 'circle', gravity: 0
            });
            if (this.dashTimer <= 0) {
                this.dashing = false;
                this.vx = this.facing * this.maxSpeed; // smooth exit
            }
        }

        // State determination
        if (this.attacking) {
            this.state = 'attack';
        } else if (this.dashing) {
            this.state = 'power';
        } else if (!this.onGround) {
            this.state = this.vy < 0 ? 'jump' : 'fall';
        } else if (Math.abs(this.vx) > 0.5) {
            this.state = 'run';
        } else {
            this.state = 'idle';
        }

        if (this.powered && !this.dashing) this.state = 'power';

        // Run animation
        if (this.state === 'run') {
            this.animTimer++;
            if (this.animTimer > 6) {
                this.animTimer = 0;
                this.animFrame = (this.animFrame + 1) % 2;
            }
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

    getAttackRect() {
        const ax = this.facing === 1 ? this.x + this.w - 4 : this.x - 36;
        return { x: ax, y: this.y + 6, w: 38, h: this.h - 14 };
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

        if (this.attacking) {
            stateName = 'power'; // reuse power sprite for attack pose
        } else if (this.powered) {
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

        // Attack swing visual
        if (this.attacking) {
            const progress = 1 - this.attackTimer / this.attackDuration;
            const swingX = this.facing === 1 ? drawX + this.w - 2 : drawX - 28;
            const swingY = drawY + 8;
            ctx.save();
            ctx.globalAlpha = 0.7 * (1 - progress);
            // Flash color
            ctx.fillStyle = '#f0d000';
            ctx.fillRect(swingX, swingY, 28, 18);
            // Inner fist
            ctx.globalAlpha = 0.9 * (1 - progress);
            ctx.fillStyle = '#fff';
            ctx.fillRect(swingX + 4, swingY + 4, 20, 10);
            ctx.restore();
        }
    }
}
