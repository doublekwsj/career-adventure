class QuestionBlock {
    constructor(col, row, data) {
        this.col = col;
        this.row = row;
        this.x = col * 32;
        this.y = row * 32;
        this.w = 32;
        this.h = 32;
        this.data = data; // { text, type, icon }
        this.hit = false;
        this.bounceY = 0;
        this.bounceTimer = 0;
        this.glowTimer = Math.random() * Math.PI * 2;
    }

    onHit(game) {
        if (this.hit) return;
        this.hit = true;
        this.bounceTimer = 15;
        Audio.play('block');
        Particles.blockHit(this.x + 16, this.y);
        game.showAchievement(this.data);
    }

    update(time) {
        if (this.bounceTimer > 0) {
            this.bounceTimer--;
            this.bounceY = -Math.sin((this.bounceTimer / 15) * Math.PI) * 8;
        }
        this.glowTimer = time * 0.003;
    }

    draw(ctx, camera) {
        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y + this.bounceY;
        const sprite = this.hit ? Sprites.get('question_block_hit') : Sprites.get('question_block');
        ctx.drawImage(sprite, drawX, drawY);

        // Glow effect for active blocks
        if (!this.hit) {
            ctx.save();
            ctx.globalAlpha = 0.2 + Math.sin(this.glowTimer + this.col) * 0.1;
            ctx.fillStyle = '#f0d000';
            ctx.fillRect(drawX - 2, drawY - 2, 36, 36);
            ctx.restore();
        }
    }
}

class CoinEntity {
    constructor(x, y, data) {
        this.x = x;
        this.y = y;
        this.w = 20;
        this.h = 20;
        this.data = data;
        this.collected = false;
        this.animFrame = 0;
        this.animTimer = 0;
        this.baseY = y;
        this.floatOffset = Math.random() * Math.PI * 2;
    }

    update(time) {
        if (this.collected) return;
        this.animTimer++;
        if (this.animTimer > 8) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 4;
        }
        this.y = this.baseY + Math.sin(time * 0.004 + this.floatOffset) * 4;
    }

    collect(game) {
        if (this.collected) return;
        this.collected = true;
        Particles.coinCollect(this.x + 10, this.y + 10);
        Audio.play('coin');
        game.showAchievement(this.data);
    }

    draw(ctx, camera) {
        if (this.collected) return;
        const sprite = Sprites.get(`coin_${this.animFrame}`);
        ctx.drawImage(sprite, this.x - camera.x, this.y - camera.y);
    }
}

class Trophy {
    constructor(x, y, data) {
        this.x = x;
        this.y = y;
        this.w = 28;
        this.h = 32;
        this.data = data;
        this.collected = false;
        this.baseY = y;
        this.glowPhase = Math.random() * Math.PI * 2;
    }

    update(time) {
        if (this.collected) return;
        this.y = this.baseY + Math.sin(time * 0.003 + this.glowPhase) * 3;
    }

    collect(game) {
        if (this.collected) return;
        this.collected = true;
        Particles.trophyCollect(this.x + 14, this.y + 16);
        Audio.play('trophy');
        game.showAchievement(this.data);
        game.player.addScore(500);
    }

    draw(ctx, camera) {
        if (this.collected) return;
        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;

        // Glow
        ctx.save();
        ctx.globalAlpha = 0.3 + Math.sin(Date.now() * 0.005 + this.glowPhase) * 0.2;
        ctx.fillStyle = '#f0d000';
        ctx.beginPath();
        ctx.arc(drawX + 14, drawY + 16, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.drawImage(Sprites.get('trophy'), drawX, drawY);
    }
}

class Powerup {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.w = 24;
        this.h = 24;
        this.type = type; // star, speed
        this.collected = false;
        this.baseY = y;
        this.spawnTimer = 0;
    }

    update(time) {
        if (this.collected) return;
        this.y = this.baseY + Math.sin(time * 0.005) * 5;
        this.spawnTimer++;
    }

    collect(player) {
        if (this.collected) return;
        this.collected = true;
        player.powerUp(this.type);
        Particles.powerupEffect(this.x + 12, this.y + 12);
    }

    draw(ctx, camera) {
        if (this.collected) return;
        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;

        // Sparkle effect
        ctx.save();
        const glow = 0.4 + Math.sin(this.spawnTimer * 0.1) * 0.3;
        ctx.globalAlpha = glow;
        ctx.fillStyle = this.type === 'star' ? '#f0d000' : '#4fc3f7';
        ctx.beginPath();
        ctx.arc(drawX + 12, drawY + 12, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        const sprite = Sprites.get(`powerup_${this.type}`);
        ctx.drawImage(sprite, drawX, drawY);
    }
}

class SignPost {
    constructor(x, y, title, year) {
        this.x = x;
        this.y = y;
        this.w = 64;
        this.h = 56;
        this.title = title;
        this.year = year;
    }

    draw(ctx, camera) {
        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;
        ctx.drawImage(Sprites.get('sign'), drawX, drawY);
        // Year text on sign
        ctx.fillStyle = '#5a3010';
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(this.year, drawX + 32, drawY + 18);
        ctx.font = '5px "Press Start 2P", monospace';
        ctx.fillText(this.title.substring(0, 12), drawX + 32, drawY + 28);
    }
}

class Pipe {
    constructor(x, y, targetX) {
        this.x = x;
        this.y = y;
        this.w = 48;
        this.h = 64;
        this.targetX = targetX;
        this.showPrompt = false;
        this.promptAlpha = 0;
    }

    update(playerX, playerY) {
        const near = Math.abs(playerX - this.x) < 50 && Math.abs(playerY - (this.y - 20)) < 40;
        this.showPrompt = near;
        this.promptAlpha += (near ? 0.1 : -0.1);
        this.promptAlpha = Utils.clamp(this.promptAlpha, 0, 1);
    }

    draw(ctx, camera) {
        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;
        ctx.drawImage(Sprites.get('pipe_body'), drawX, drawY + 32);
        ctx.drawImage(Sprites.get('pipe_top'), drawX, drawY);

        if (this.promptAlpha > 0) {
            ctx.save();
            ctx.globalAlpha = this.promptAlpha;
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            const pw = 110;
            ctx.fillRect(drawX - (pw - 48) / 2, drawY - 28, pw, 22);
            ctx.fillStyle = '#fff';
            ctx.font = '7px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('PRESS DOWN', drawX + 24, drawY - 13);
            ctx.restore();
        }
    }
}

class MovingPlatform {
    constructor(x, y, rangeX, speed) {
        this.x = x;
        this.y = y;
        this.w = 64;
        this.h = 16;
        this.startX = x;
        this.rangeX = rangeX;
        this.speed = speed;
        this.dir = 1;
        this.vx = 0;
    }

    update() {
        this.vx = this.speed * this.dir;
        this.x += this.vx;
        if (this.x > this.startX + this.rangeX || this.x < this.startX) {
            this.dir = -this.dir;
        }
    }

    draw(ctx, camera) {
        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;
        ctx.drawImage(Sprites.get('moving_platform'), drawX, drawY);
    }
}

class FlagPole {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 40;
        this.h = 160;
        this.reached = false;
        this.bannerY = 10;
    }

    update() {
        if (this.reached && this.bannerY < 130) {
            this.bannerY += 3;
        }
    }

    draw(ctx, camera) {
        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;
        ctx.drawImage(Sprites.get('flag_pole'), drawX, drawY);
        ctx.drawImage(Sprites.get('flag_banner'), drawX + 6, drawY + this.bannerY);
    }
}

class NPC {
    constructor(x, y, dialog, zoneIdx) {
        this.x = x;
        this.y = y;
        this.w = 28;
        this.h = 36;
        this.dialog = dialog;
        this.zoneIdx = zoneIdx;
        this.talked = false;
        this.showBubble = false;
        this.bubbleAlpha = 0;
        this.animTimer = 0;
    }

    update(playerX, playerY) {
        this.animTimer++;
        const near = Math.abs(playerX - this.x) < 50 && Math.abs(playerY - this.y) < 50;
        this.showBubble = near && !this.talked;
        this.bubbleAlpha += (this.showBubble ? 0.08 : -0.08);
        this.bubbleAlpha = Utils.clamp(this.bubbleAlpha, 0, 1);
    }

    interact(game) {
        if (this.talked) return false;
        this.talked = true;
        game.showPopup(this.dialog.replace(/\n/g, '<br>'));
        return true;
    }

    draw(ctx, camera) {
        const drawX = this.x - camera.x;
        const drawY = this.y - camera.y;

        // Simple NPC body (colleague/mentor look)
        const bob = Math.sin(this.animTimer * 0.05) * 2;

        // Body
        ctx.fillStyle = '#3498db';
        ctx.fillRect(drawX + 5, drawY + 14 + bob, 18, 12);
        // Head
        ctx.fillStyle = '#ffd5a3';
        ctx.fillRect(drawX + 7, drawY + 2 + bob, 14, 12);
        // Hair
        ctx.fillStyle = '#555';
        ctx.fillRect(drawX + 7, drawY + 1 + bob, 14, 5);
        // Glasses
        ctx.fillStyle = '#333';
        ctx.fillRect(drawX + 9, drawY + 7 + bob, 5, 3);
        ctx.fillRect(drawX + 16, drawY + 7 + bob, 5, 3);
        ctx.fillRect(drawX + 14, drawY + 8 + bob, 2, 1);
        // Legs
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(drawX + 7, drawY + 26 + bob, 5, 8);
        ctx.fillRect(drawX + 16, drawY + 26 + bob, 5, 8);
        // Shoes
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(drawX + 6, drawY + 33 + bob, 6, 3);
        ctx.fillRect(drawX + 16, drawY + 33 + bob, 6, 3);

        // Exclamation mark if not talked
        if (!this.talked) {
            const excY = drawY - 10 + Math.sin(this.animTimer * 0.1) * 3;
            ctx.fillStyle = '#f0d000';
            ctx.font = 'bold 12px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('!', drawX + 14, excY);
        }

        // Speech bubble hint
        if (this.bubbleAlpha > 0) {
            ctx.save();
            ctx.globalAlpha = this.bubbleAlpha;
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.fillRect(drawX - 20, drawY - 24, 68, 18);
            ctx.fillStyle = '#fff';
            ctx.font = '7px "Press Start 2P", monospace';
            ctx.textAlign = 'center';
            ctx.fillText('PRESS UP', drawX + 14, drawY - 11);
            ctx.restore();
        }
    }
}
