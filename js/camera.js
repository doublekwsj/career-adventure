class Camera {
    constructor(width, height, worldWidth, worldHeight) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.targetX = 0;
        this.targetY = 0;
        this.smoothing = 0.08;
        this.lookAhead = 60;
    }

    follow(target) {
        // Look ahead in movement direction
        const ahead = target.vx > 0.5 ? this.lookAhead : (target.vx < -0.5 ? -this.lookAhead : 0);
        this.targetX = target.x + target.w / 2 - this.width / 2 + ahead;
        this.targetY = target.y + target.h / 2 - this.height * 0.55;

        // Smooth follow
        this.x += (this.targetX - this.x) * this.smoothing;
        this.y += (this.targetY - this.y) * this.smoothing * 1.5;

        // Clamp to world bounds
        this.x = Utils.clamp(this.x, 0, this.worldWidth - this.width);
        this.y = Utils.clamp(this.y, 0, this.worldHeight - this.height);
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
    }

    // Check if a point/rect is visible
    isVisible(x, y, w, h) {
        return x + w > this.x && x < this.x + this.width &&
               y + h > this.y && y < this.y + this.height;
    }
}
