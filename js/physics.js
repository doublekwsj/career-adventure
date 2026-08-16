const Physics = {
    gravity: 0.55,
    maxFallSpeed: 14,

    applyGravity(entity) {
        entity.vy += this.gravity;
        if (entity.vy > this.maxFallSpeed) {
            entity.vy = this.maxFallSpeed;
        }
    },

    rectCollision(a, b) {
        return a.x < b.x + b.w &&
               a.x + a.w > b.x &&
               a.y < b.y + b.h &&
               a.y + a.h > b.y;
    },

    // Returns { grounded, hitCeiling, hitTile }
    resolveTileCollisions(entity, tiles, tileSize, mapRows, mapCols) {
        let hitCeiling = null;
        entity.onGround = false;

        // Horizontal
        entity.x += entity.vx;
        const hTiles = this._getOverlapping(entity, tiles, tileSize, mapRows, mapCols);
        for (const tile of hTiles) {
            if (entity.vx > 0) {
                entity.x = tile.col * tileSize - entity.w;
            } else if (entity.vx < 0) {
                entity.x = (tile.col + 1) * tileSize;
            }
            entity.vx = 0;
        }

        // Vertical
        entity.y += entity.vy;
        const vTiles = this._getOverlapping(entity, tiles, tileSize, mapRows, mapCols);
        for (const tile of vTiles) {
            if (entity.vy > 0) {
                entity.y = tile.row * tileSize - entity.h;
                entity.vy = 0;
                entity.onGround = true;
            } else if (entity.vy < 0) {
                entity.y = (tile.row + 1) * tileSize;
                entity.vy = 0;
                hitCeiling = tile;
            }
        }

        return hitCeiling;
    },

    // Check moving platform collision
    resolveMovingPlatform(entity, platform) {
        if (entity.vy < 0) return false;
        const onTop = entity.y + entity.h >= platform.y &&
                      entity.y + entity.h <= platform.y + 12 &&
                      entity.x + entity.w > platform.x &&
                      entity.x < platform.x + platform.w;
        if (onTop && entity.vy >= 0) {
            entity.y = platform.y - entity.h;
            entity.vy = 0;
            entity.onGround = true;
            entity.x += platform.vx || 0;
            return true;
        }
        return false;
    },

    _getOverlapping(entity, tiles, tileSize, mapRows, mapCols) {
        const results = [];
        const left = Math.floor(entity.x / tileSize);
        const right = Math.floor((entity.x + entity.w - 1) / tileSize);
        const top = Math.floor(entity.y / tileSize);
        const bottom = Math.floor((entity.y + entity.h - 1) / tileSize);

        for (let row = Math.max(0, top); row <= Math.min(mapRows - 1, bottom); row++) {
            for (let col = Math.max(0, left); col <= Math.min(mapCols - 1, right); col++) {
                if (tiles[row][col] > 0) {
                    results.push({ row, col, type: tiles[row][col] });
                }
            }
        }
        return results;
    }
};
