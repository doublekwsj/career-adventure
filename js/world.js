const TILE_SIZE = 32;
const MAP_ROWS = 20;
const ZONE_WIDTH = 80; // tiles per zone (wider for more space)
const TOTAL_ZONES = 7;
const MAP_COLS = ZONE_WIDTH * TOTAL_ZONES;

// Tile types: 0=air, 1=ground, 2=ground_top, 3=platform, 4=question_block(handled by entity)
class World {
    constructor() {
        this.tiles = [];
        this.questionBlocks = [];
        this.coins = [];
        this.trophies = [];
        this.powerups = [];
        this.signs = [];
        this.pipes = [];
        this.npcs = [];
        this.enemies = [];
        this.bosses = [];
        this.movingPlatforms = [];
        this.flag = null;
        this.clouds = [];
        this.bgElements = [];
        this.generate();
    }

    generate() {
        // Init empty map
        this.tiles = Array.from({ length: MAP_ROWS }, () => Array(MAP_COLS).fill(0));

        // Base ground (bottom 3 rows)
        for (let col = 0; col < MAP_COLS; col++) {
            this.tiles[MAP_ROWS - 1][col] = 1;
            this.tiles[MAP_ROWS - 2][col] = 1;
            this.tiles[MAP_ROWS - 3][col] = 2; // top decorated
        }

        // Generate each zone
        CAREER_DATA.zones.forEach((zone, idx) => {
            this._generateZone(zone, idx);
        });

        // Flag at end
        const flagX = (MAP_COLS - 6) * TILE_SIZE;
        const flagY = (MAP_ROWS - 3) * TILE_SIZE - 160;
        this.flag = new FlagPole(flagX, flagY);

        // Clouds
        for (let i = 0; i < 60; i++) {
            this.clouds.push({
                x: Math.random() * MAP_COLS * TILE_SIZE,
                y: 15 + Math.random() * 80,
                type: Math.random() > 0.5 ? 'cloud_1' : 'cloud_2',
                speed: 0.1 + Math.random() * 0.25,
                parallax: 0.2 + Math.random() * 0.3
            });
        }

        // Background elements
        for (let i = 0; i < 40; i++) {
            this.bgElements.push({
                x: i * 350 + Math.random() * 150,
                type: Math.random() > 0.5 ? 'mountain' : 'building',
                parallax: 0.4 + Math.random() * 0.2
            });
        }
    }

    _generateZone(zone, zoneIdx) {
        const startCol = zoneIdx * ZONE_WIDTH;
        const groundRow = MAP_ROWS - 3;

        // --- Terrain variety ---
        // Gaps (pits)
        const gaps = this._getGapPositions(zoneIdx);
        for (const gap of gaps) {
            for (let c = gap.start; c < gap.start + gap.len; c++) {
                const col = startCol + c;
                if (col < MAP_COLS) {
                    this.tiles[MAP_ROWS - 1][col] = 0;
                    this.tiles[MAP_ROWS - 2][col] = 0;
                    this.tiles[MAP_ROWS - 3][col] = 0;
                }
            }
        }

        // Hills / elevated terrain
        const hills = this._getHillPositions(zoneIdx);
        for (const hill of hills) {
            for (let c = 0; c < hill.len; c++) {
                const col = startCol + hill.start + c;
                if (col < MAP_COLS) {
                    for (let h = 0; h < hill.height; h++) {
                        const row = groundRow - 1 - h;
                        if (row >= 0) {
                            this.tiles[row][col] = h === hill.height - 1 ? 2 : 1;
                        }
                    }
                }
            }
        }

        // Floating platforms
        const platforms = this._getPlatformPositions(zoneIdx);
        for (const p of platforms) {
            for (let c = 0; c < p.len; c++) {
                const col = startCol + p.col + c;
                if (col < MAP_COLS) {
                    this.tiles[p.row][col] = 3;
                }
            }
        }

        // Moving platforms
        const movPlats = this._getMovingPlatforms(zoneIdx);
        for (const mp of movPlats) {
            this.movingPlatforms.push(new MovingPlatform(
                (startCol + mp.col) * TILE_SIZE,
                mp.row * TILE_SIZE,
                mp.range * TILE_SIZE,
                mp.speed
            ));
        }

        // --- Sign at zone entrance ---
        const signX = (startCol + 2) * TILE_SIZE;
        const signY = (groundRow - 2) * TILE_SIZE;
        this.signs.push(new SignPost(signX, signY, zone.title, zone.years));

        // --- NPC with dialog ---
        if (zone.npcDialog) {
            const npcX = (startCol + 7) * TILE_SIZE;
            const npcY = (groundRow - 1) * TILE_SIZE - 36;
            this.npcs.push(new NPC(npcX, npcY, zone.npcDialog, zoneIdx));
        }

        // --- Place achievements ---
        const achievements = zone.achievements;
        const usableWidth = ZONE_WIDTH - 16;
        const spacing = Math.floor(usableWidth / Math.max(achievements.length, 1));

        achievements.forEach((ach, i) => {
            const col = startCol + 10 + i * spacing;
            const baseRow = groundRow - 5;

            // Find a safe row (not inside terrain)
            let row = baseRow;
            while (row > 2 && this.tiles[row][col] > 0) row--;

            if (ach.type === 'block') {
                this.questionBlocks.push(new QuestionBlock(col, row, ach));
                this.tiles[row][col] = 4; // mark as solid
            } else if (ach.type === 'coin') {
                this.coins.push(new CoinEntity(
                    col * TILE_SIZE + 6,
                    row * TILE_SIZE,
                    ach
                ));
            } else if (ach.type === 'trophy') {
                this.trophies.push(new Trophy(
                    col * TILE_SIZE + 2,
                    (row - 1) * TILE_SIZE,
                    ach
                ));
            }
        });

        // --- Enemies ---
        const enemyType = zone.enemy;
        const enemyCount = 5 + zoneIdx; // 5-11 ground enemies per zone
        for (let i = 0; i < enemyCount; i++) {
            const eCol = startCol + 10 + i * Math.floor(usableWidth / enemyCount);
            const eX = eCol * TILE_SIZE;
            const eY = (groundRow - 1) * TILE_SIZE;
            this.enemies.push(new Enemy(eX, eY, enemyType));
        }

        // --- Flying enemies (from zone 1 onwards) ---
        if (zoneIdx >= 1) {
            const flyCount = 1 + Math.floor(zoneIdx / 2); // 1,1,2,2,3,3 flying enemies
            for (let i = 0; i < flyCount; i++) {
                const eCol = startCol + 18 + i * Math.floor(usableWidth / flyCount);
                const eX = eCol * TILE_SIZE;
                const eY = (groundRow - 5) * TILE_SIZE; // mid-air height
                this.enemies.push(new Enemy(eX, eY, 'flying'));
            }
        }

        // --- Extra elevated enemies on platforms ---
        const platDefs = this._getPlatformPositions(zoneIdx);
        if (platDefs.length > 0) {
            const platEnemy = platDefs[Math.floor(platDefs.length / 2)];
            const peX = (startCol + platEnemy.col + 1) * TILE_SIZE;
            const peY = (platEnemy.row - 1) * TILE_SIZE;
            this.enemies.push(new Enemy(peX, peY, enemyType));
        }

        // --- Boss ---
        if (zone.boss) {
            const bossCol = startCol + ZONE_WIDTH - 15;
            const bossX = bossCol * TILE_SIZE;
            const bossY = (groundRow - 3) * TILE_SIZE;
            this.bosses.push(new Boss(bossX, bossY, zone.boss.type, zoneIdx));
        }

        // --- Powerups ---
        if (zoneIdx % 2 === 0) {
            const puCol = startCol + 35 + Utils.randInt(0, 10);
            const puRow = groundRow - 7;
            this.powerups.push(new Powerup(puCol * TILE_SIZE, puRow * TILE_SIZE, 'star'));
        } else {
            const puCol = startCol + 40 + Utils.randInt(0, 10);
            const puRow = groundRow - 6;
            this.powerups.push(new Powerup(puCol * TILE_SIZE, puRow * TILE_SIZE, 'speed'));
        }

        // --- Pipes (between zones) ---
        if (zoneIdx < TOTAL_ZONES - 1) {
            const pipeCol = startCol + ZONE_WIDTH - 5;
            const pipeRow = groundRow - 2;
            const targetX = ((zoneIdx + 1) * ZONE_WIDTH + 5) * TILE_SIZE;
            this.pipes.push(new Pipe(
                pipeCol * TILE_SIZE,
                pipeRow * TILE_SIZE,
                targetX
            ));
        }
    }

    _getGapPositions(zoneIdx) {
        const configs = [
            [{ start: 25, len: 3 }, { start: 50, len: 3 }],
            [{ start: 30, len: 2 }],
            [{ start: 20, len: 3 }, { start: 45, len: 4 }, { start: 65, len: 3 }],
            [{ start: 22, len: 3 }, { start: 40, len: 3 }, { start: 58, len: 4 }],
            [{ start: 18, len: 4 }, { start: 35, len: 3 }, { start: 55, len: 5 }],
            [{ start: 25, len: 3 }, { start: 50, len: 3 }],
            [{ start: 20, len: 3 }, { start: 42, len: 4 }, { start: 60, len: 3 }]
        ];
        return configs[zoneIdx] || [];
    }

    _getHillPositions(zoneIdx) {
        const configs = [
            [{ start: 35, len: 8, height: 2 }, { start: 60, len: 5, height: 1 }],
            [{ start: 40, len: 6, height: 2 }],
            [{ start: 30, len: 5, height: 2 }, { start: 55, len: 8, height: 3 }],
            [{ start: 15, len: 6, height: 2 }, { start: 45, len: 10, height: 2 }],
            [{ start: 25, len: 7, height: 3 }, { start: 50, len: 5, height: 2 }],
            [{ start: 35, len: 6, height: 2 }, { start: 60, len: 8, height: 2 }],
            [{ start: 15, len: 5, height: 2 }, { start: 35, len: 8, height: 3 }, { start: 55, len: 6, height: 2 }]
        ];
        return configs[zoneIdx] || [];
    }

    _getPlatformPositions(zoneIdx) {
        const configs = [
            [{ col: 20, row: 12, len: 4 }, { col: 40, row: 10, len: 3 }, { col: 55, row: 11, len: 4 }],
            [{ col: 15, row: 11, len: 3 }, { col: 35, row: 9, len: 4 }, { col: 55, row: 12, len: 3 }],
            [{ col: 12, row: 11, len: 3 }, { col: 28, row: 9, len: 4 }, { col: 50, row: 10, len: 3 }, { col: 68, row: 11, len: 4 }],
            [{ col: 10, row: 10, len: 4 }, { col: 25, row: 8, len: 3 }, { col: 45, row: 11, len: 5 }, { col: 62, row: 9, len: 3 }],
            [{ col: 12, row: 9, len: 3 }, { col: 30, row: 7, len: 4 }, { col: 48, row: 10, len: 3 }, { col: 60, row: 8, len: 4 }],
            [{ col: 15, row: 11, len: 4 }, { col: 35, row: 9, len: 3 }, { col: 55, row: 10, len: 4 }],
            [{ col: 10, row: 10, len: 3 }, { col: 25, row: 8, len: 4 }, { col: 45, row: 9, len: 3 }, { col: 60, row: 7, len: 5 }]
        ];
        return configs[zoneIdx] || [];
    }

    _getMovingPlatforms(zoneIdx) {
        const configs = [
            [],
            [{ col: 25, row: 10, range: 4, speed: 0.8 }],
            [{ col: 38, row: 9, range: 5, speed: 1.0 }],
            [{ col: 30, row: 8, range: 5, speed: 1.0 }, { col: 55, row: 10, range: 4, speed: 0.7 }],
            [{ col: 25, row: 8, range: 6, speed: 1.2 }, { col: 45, row: 7, range: 4, speed: 0.8 }],
            [{ col: 30, row: 9, range: 5, speed: 0.9 }],
            [{ col: 20, row: 9, range: 5, speed: 1.0 }, { col: 50, row: 8, range: 6, speed: 1.1 }]
        ];
        return configs[zoneIdx] || [];
    }

    getZoneAt(x) {
        const col = Math.floor(x / TILE_SIZE);
        return Utils.clamp(Math.floor(col / ZONE_WIDTH), 0, TOTAL_ZONES - 1);
    }

    getZoneData(idx) {
        return CAREER_DATA.zones[idx];
    }

    getThemeAt(x) {
        const zone = this.getZoneData(this.getZoneAt(x));
        return zone ? zone.theme : 'grassland';
    }

    update(time, playerX, playerY) {
        // Update entities
        for (const qb of this.questionBlocks) qb.update(time);
        for (const coin of this.coins) coin.update(time);
        for (const trophy of this.trophies) trophy.update(time);
        for (const pu of this.powerups) pu.update(time);
        for (const mp of this.movingPlatforms) mp.update();
        for (const pipe of this.pipes) pipe.update(playerX, playerY);
        for (const npc of this.npcs) npc.update(playerX, playerY);
        for (const boss of this.bosses) boss.update();
        if (this.flag) this.flag.update();

        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const remove = this.enemies[i].update(this.tiles, TILE_SIZE, MAP_ROWS, MAP_COLS);
            if (remove) this.enemies.splice(i, 1);
        }

        // Clouds
        for (const cloud of this.clouds) {
            cloud.x += cloud.speed;
            if (cloud.x > MAP_COLS * TILE_SIZE + 100) cloud.x = -100;
        }
    }

    drawBackground(ctx, camera) {
        const zoneIdx = this.getZoneAt(camera.x + camera.width / 2);
        const zone = CAREER_DATA.zones[zoneIdx];
        const nextZone = CAREER_DATA.zones[Math.min(zoneIdx + 1, TOTAL_ZONES - 1)];

        // Calculate blend between zones
        const zoneProgress = ((camera.x + camera.width / 2) / TILE_SIZE % ZONE_WIDTH) / ZONE_WIDTH;

        // Sky gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, camera.height);
        gradient.addColorStop(0, zone.bgColor1);
        gradient.addColorStop(1, zone.bgColor2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, camera.width, camera.height);

        // Zone-specific atmosphere
        const t = Date.now();
        if (zone.theme === 'space') {
            // Stars + nebula
            for (let i = 0; i < 80; i++) {
                const sx = (Math.sin(i * 127.1 + camera.x * 0.001) * 0.5 + 0.5) * camera.width;
                const sy = (Math.cos(i * 311.7) * 0.5 + 0.5) * camera.height * 0.7;
                const ss = 1 + Math.sin(t * 0.002 + i) * 0.8;
                ctx.globalAlpha = 0.5 + Math.sin(t * 0.003 + i * 2) * 0.5;
                ctx.fillStyle = i % 3 === 0 ? '#4fc3f7' : i % 3 === 1 ? '#a78bfa' : '#fff';
                ctx.fillRect(sx, sy, ss, ss);
            }
            // Nebula glow
            ctx.globalAlpha = 0.06 + Math.sin(t * 0.001) * 0.03;
            ctx.fillStyle = '#6a11cb';
            ctx.fillRect(0, 0, camera.width, camera.height * 0.5);
            ctx.globalAlpha = 1;
        } else if (zone.theme === 'city') {
            // Rain effect
            ctx.strokeStyle = 'rgba(180,210,255,0.25)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 40; i++) {
                const rx = ((i * 173 + t * 0.3) % (camera.width + 60)) - 30;
                const ry = (i * 97 + t * 0.4) % camera.height;
                ctx.beginPath();
                ctx.moveTo(rx, ry);
                ctx.lineTo(rx - 3, ry + 10);
                ctx.stroke();
            }
        } else if (zone.theme === 'factory') {
            // Rising smoke/embers
            for (let i = 0; i < 20; i++) {
                const ex = (i * 211 + t * 0.05) % camera.width;
                const ey = camera.height - ((i * 137 + t * 0.08) % camera.height);
                ctx.globalAlpha = 0.12 + Math.sin(t * 0.004 + i) * 0.06;
                ctx.fillStyle = i % 2 === 0 ? '#ff6b35' : '#888';
                ctx.fillRect(ex, ey, 3, 3);
            }
            ctx.globalAlpha = 1;
        } else if (zone.theme === 'university') {
            // Falling leaves
            for (let i = 0; i < 15; i++) {
                const lx = (i * 241 + t * 0.06) % camera.width;
                const ly = (i * 113 + t * 0.09) % camera.height;
                ctx.globalAlpha = 0.35;
                ctx.fillStyle = i % 3 === 0 ? '#f0d000' : i % 3 === 1 ? '#ff6b35' : '#8bc34a';
                ctx.save();
                ctx.translate(lx, ly);
                ctx.rotate(t * 0.002 + i);
                ctx.fillRect(-3, -3, 6, 6);
                ctx.restore();
            }
            ctx.globalAlpha = 1;
        } else if (zone.theme === 'future') {
            // Neon scan line
            const scanY = (t * 0.08) % camera.height;
            ctx.globalAlpha = 0.08;
            ctx.fillStyle = '#4fc3f7';
            ctx.fillRect(0, scanY, camera.width, 2);
            ctx.globalAlpha = 1;
        }

        // Background elements (parallax)
        for (const el of this.bgElements) {
            const drawX = el.x - camera.x * el.parallax;
            if (drawX > -150 && drawX < camera.width + 50) {
                const sprite = Sprites.get(el.type);
                if (sprite) {
                    const drawY = camera.height - sprite.height;
                    ctx.drawImage(sprite, drawX, drawY);
                }
            }
        }

        // Clouds (parallax)
        for (const cloud of this.clouds) {
            const drawX = cloud.x - camera.x * cloud.parallax;
            const modX = ((drawX % (camera.width + 200)) + camera.width + 200) % (camera.width + 200) - 100;
            ctx.drawImage(Sprites.get(cloud.type), modX, cloud.y);
        }

        // Mid-distance silhouette layer (closer parallax = more depth)
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = zone.bgColor2;
        for (let i = 0; i < 12; i++) {
            const bx = (i * 500 - camera.x * 0.65 + 300) % (camera.width + 120) - 60;
            const bh = 40 + (i * 37 % 50);
            const bw = 30 + (i * 29 % 40);
            ctx.fillRect(bx, camera.height - bh - 40, bw, bh);
        }
        ctx.globalAlpha = 1;
    }

    drawTiles(ctx, camera) {
        const startCol = Math.max(0, Math.floor(camera.x / TILE_SIZE) - 1);
        const endCol = Math.min(MAP_COLS, startCol + Math.ceil(camera.width / TILE_SIZE) + 2);
        const startRow = Math.max(0, Math.floor(camera.y / TILE_SIZE) - 1);
        const endRow = Math.min(MAP_ROWS, startRow + Math.ceil(camera.height / TILE_SIZE) + 2);

        const theme = this.getThemeAt(camera.x + camera.width / 2);

        for (let row = startRow; row < endRow; row++) {
            for (let col = startCol; col < endCol; col++) {
                const tile = this.tiles[row][col];
                if (tile === 0 || tile === 4) continue; // 4 is question block (drawn by entity)

                const drawX = col * TILE_SIZE - camera.x;
                const drawY = col * TILE_SIZE - camera.x; // intentional: using col for zone detection
                const actualDrawY = row * TILE_SIZE - camera.y;

                // Determine theme for this column
                const colTheme = CAREER_DATA.zones[Utils.clamp(Math.floor(col / ZONE_WIDTH), 0, TOTAL_ZONES - 1)].theme;
                let sprite;
                if (tile === 2) sprite = Sprites.get(`ground_top_${colTheme}`);
                else if (tile === 3) sprite = Sprites.get(`platform_${colTheme}`);
                else sprite = Sprites.get(`ground_${colTheme}`);

                if (sprite) {
                    ctx.drawImage(sprite, col * TILE_SIZE - camera.x, actualDrawY);
                }
            }
        }
    }

    drawEntities(ctx, camera) {
        for (const sign of this.signs) sign.draw(ctx, camera);
        for (const pipe of this.pipes) pipe.draw(ctx, camera);
        for (const mp of this.movingPlatforms) mp.draw(ctx, camera);
        for (const npc of this.npcs) npc.draw(ctx, camera);
        for (const qb of this.questionBlocks) qb.draw(ctx, camera);
        for (const coin of this.coins) coin.draw(ctx, camera);
        for (const trophy of this.trophies) trophy.draw(ctx, camera);
        for (const pu of this.powerups) pu.draw(ctx, camera);
        for (const enemy of this.enemies) enemy.draw(ctx, camera);
        for (const boss of this.bosses) boss.draw(ctx, camera);
        if (this.flag) this.flag.draw(ctx, camera);
    }
}
