class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.w = 28;
        this.h = 24;
        this.vx = -1.2;
        this.vy = 0;
        this.type = type; // bug, glitch, spam, asteroid, deadline
        this.alive = true;
        this.squishTimer = 0;
        this.animFrame = 0;
        this.animTimer = 0;
        this.onGround = false;
        this.patrolRange = 100;
        this.startX = x;

        // Type-specific properties
        if (type === 'asteroid') {
            this.w = 30;
            this.h = 30;
            this.vy = 1.5;
            this.vx = (Math.random() - 0.5) * 2;
        } else if (type === 'glitch') {
            this.vx = -1.8;
            this.h = 28;
        } else if (type === 'deadline') {
            this.vx = -2.0;
            this.h = 28;
        } else if (type === 'flying') {
            this.w = 30;
            this.h = 22;
            this.vx = (Math.random() > 0.5 ? 1 : -1) * 1.6;
            this.flyBaseY = y;
            this.flyPhase = Math.random() * Math.PI * 2;
            this.patrolRange = 140;
        }
    }

    update(tiles, tileSize, mapRows, mapCols) {
        if (!this.alive) {
            this.squishTimer--;
            return this.squishTimer <= 0; // return true to remove
        }

        this.animTimer++;
        if (this.animTimer > 15) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 2;
        }

        if (this.type === 'asteroid') {
            this.x += this.vx;
            this.y += this.vy;
            return this.y > mapRows * tileSize; // remove if off screen
        }

        if (this.type === 'flying') {
            this.flyPhase += 0.04;
            this.x += this.vx;
            this.y = this.flyBaseY + Math.sin(this.flyPhase) * 28;
            if (Math.abs(this.x - this.startX) > this.patrolRange) {
                this.vx = -this.vx;
            }
            return false;
        }

        // Gravity
        this.vy += 0.4;
        if (this.vy > 8) this.vy = 8;

        // Move
        this.x += this.vx;

        // Check horizontal collisions
        const col = Math.floor((this.x + (this.vx > 0 ? this.w : 0)) / tileSize);
        const rowTop = Math.floor(this.y / tileSize);
        const rowBot = Math.floor((this.y + this.h - 1) / tileSize);
        if (col >= 0 && col < mapCols) {
            for (let r = rowTop; r <= rowBot; r++) {
                if (r >= 0 && r < mapRows && tiles[r][col] > 0) {
                    this.vx = -this.vx;
                    break;
                }
            }
        }

        // Edge detection - reverse at patrol range
        if (Math.abs(this.x - this.startX) > this.patrolRange) {
            this.vx = -this.vx;
        }

        // Vertical
        this.y += this.vy;
        const footCol1 = Math.floor(this.x / tileSize);
        const footCol2 = Math.floor((this.x + this.w - 1) / tileSize);
        const footRow = Math.floor((this.y + this.h) / tileSize);
        if (footRow >= 0 && footRow < mapRows) {
            for (let c = footCol1; c <= footCol2; c++) {
                if (c >= 0 && c < mapCols && tiles[footRow][c] > 0) {
                    this.y = footRow * tileSize - this.h;
                    this.vy = 0;
                    this.onGround = true;
                    break;
                }
            }
        }

        return false;
    }

    stomp() {
        this.alive = false;
        this.squishTimer = 30;
        Particles.enemyDefeat(this.x + this.w / 2, this.y + this.h / 2);
        Audio.play('stomp');
    }

    draw(ctx, camera) {
        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;

        if (!this.alive) {
            ctx.drawImage(Sprites.get('enemy_squished'), drawX, drawY + this.h - 10);
            return;
        }

        let spriteName;
        if (this.type === 'asteroid') {
            spriteName = 'enemy_asteroid';
        } else if (this.type === 'flying') {
            spriteName = `enemy_flying_${this.animFrame + 1}`;
        } else {
            spriteName = `enemy_${this.type}_${this.animFrame + 1}`;
        }

        const sprite = Sprites.get(spriteName);
        if (sprite) {
            ctx.drawImage(sprite, drawX, drawY);
        }
    }
}

class Boss {
    constructor(x, y, type, zone) {
        this.x = x;
        this.y = y;
        this.type = type; // robot, professor, ai, showcase
        this.zone = zone;
        this.w = 64;
        this.h = 64;
        this.hp = 3;
        this.maxHp = 3;
        this.alive = true;
        this.defeated = false;
        this.animFrame = 0;
        this.animTimer = 0;
        this.phase = 0;
        this.attackTimer = 0;
        this.hitTimer = 0;
        this.vx = 0;
        this.vy = 0;
        this.moveTimer = 0;
        this.moveDir = 1;

        if (type === 'showcase') {
            this.w = 64;
            this.h = 56;
        } else if (type === 'professor') {
            this.w = 56;
            this.h = 64;
        }
    }

    update() {
        if (!this.alive) return;

        this.animTimer++;
        if (this.animTimer > 20) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 2;
        }

        if (this.hitTimer > 0) this.hitTimer--;

        // Simple patrol movement
        this.moveTimer++;
        if (this.moveTimer > 60) {
            this.moveTimer = 0;
            this.moveDir = -this.moveDir;
        }
        this.x += this.moveDir * 0.8;
    }

    hit() {
        if (this.hitTimer > 0) return false;
        this.hp--;
        this.hitTimer = 30;
        Utils.startShake(8, 20);
        Audio.play('boss');

        if (this.hp <= 0) {
            this.alive = false;
            this.defeated = true;
            Particles.trophyCollect(this.x + this.w / 2, this.y + this.h / 2);
            Audio.play('victory');
            return true;
        }
        Particles.enemyDefeat(this.x + this.w / 2, this.y);
        return false;
    }

    draw(ctx, camera) {
        if (!this.alive && !this.defeated) return;

        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;

        if (this.defeated) {
            ctx.save();
            ctx.globalAlpha = 0.4;
            ctx.drawImage(Sprites.get(`boss_${this.type}_1`), drawX, drawY);
            ctx.restore();
            return;
        }

        // Hit flash
        if (this.hitTimer > 0 && this.hitTimer % 4 < 2) {
            ctx.save();
            ctx.filter = 'brightness(3)';
        }

        const sprite = Sprites.get(`boss_${this.type}_${this.animFrame + 1}`);
        if (sprite) ctx.drawImage(sprite, drawX, drawY);

        if (this.hitTimer > 0 && this.hitTimer % 4 < 2) {
            ctx.restore();
        }

        // HP bar
        if (this.alive) {
            const barW = 50;
            const barX = drawX + (this.w - barW) / 2;
            const barY = drawY - 12;
            ctx.fillStyle = '#333';
            ctx.fillRect(barX, barY, barW, 6);
            ctx.fillStyle = this.hp > 1 ? '#4caf50' : '#f44336';
            ctx.fillRect(barX, barY, barW * (this.hp / this.maxHp), 6);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.strokeRect(barX, barY, barW, 6);
        }
    }
}
