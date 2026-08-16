const Cutscene = {
    active: false,
    queue: [],
    currentText: '',
    currentTitle: '',
    currentYear: '',
    charIndex: 0,
    charTimer: 0,
    charSpeed: 2,
    displayTime: 0,
    fadeAlpha: 0,
    phase: 'fadein', // fadein, typing, display, fadeout
    callback: null,
    lastZone: -1,

    skipDelay: 0,

    show(zone, callback) {
        this.active = true;
        this.currentYear = zone.years;
        this.currentTitle = zone.title;
        this.currentText = zone.description;
        this.charIndex = 0;
        this.charTimer = 0;
        this.displayTime = 0;
        this.fadeAlpha = 0;
        this.phase = 'fadein';
        this.callback = callback;
        this.skipDelay = 20; // ignore input for first 20 frames

        const el = document.getElementById('cutscene');
        el.classList.remove('hidden');
        setTimeout(() => el.classList.add('show'), 10);
    },

    update() {
        if (!this.active) return;

        if (this.skipDelay > 0) {
            this.skipDelay--;
            // Still advance fadein but ignore input
            if (this.phase === 'fadein') {
                this.fadeAlpha += 0.03;
                if (this.fadeAlpha >= 1) {
                    this.fadeAlpha = 1;
                    this.phase = 'typing';
                }
                this._render();
            }
            return;
        }

        switch (this.phase) {
            case 'fadein':
                this.fadeAlpha += 0.03;
                if (this.fadeAlpha >= 1) {
                    this.fadeAlpha = 1;
                    this.phase = 'typing';
                }
                this._render();
                break;

            case 'typing':
                this.charTimer++;
                if (this.charTimer >= this.charSpeed) {
                    this.charTimer = 0;
                    this.charIndex++;
                    if (this.charIndex >= this.currentText.length) {
                        this.phase = 'display';
                    }
                }
                this._render();
                // Skip with any key
                if (Input.anyKey()) {
                    this.charIndex = this.currentText.length;
                    this.phase = 'display';
                    this.displayTime = 60;
                }
                break;

            case 'display':
                this.displayTime++;
                this._render();
                if (this.displayTime > 30 && Input.anyKey()) {
                    this.phase = 'fadeout';
                }
                break;

            case 'fadeout':
                this.fadeAlpha -= 0.05;
                if (this.fadeAlpha <= 0) {
                    this.active = false;
                    const el = document.getElementById('cutscene');
                    el.classList.remove('show');
                    el.classList.add('hidden');
                    if (this.callback) this.callback();
                }
                break;
        }
    },

    _render() {
        const content = document.getElementById('cutscene-content');
        const visibleText = this.currentText.substring(0, this.charIndex).replace(/\n/g, '<br>');
        const skipHint = this.phase === 'display' ? '<p class="skip-hint">PRESS ANY KEY TO CONTINUE</p>' : '';
        const zoneIdx = CAREER_DATA.zones.findIndex(z => z.years === this.currentYear);
        const levelData = Sprites.PLAYER_LEVELS[zoneIdx >= 0 ? zoneIdx : 0];
        const levelUpHtml = zoneIdx > 0 ?
            `<p style="color:#4fc3f7; font-size:9px; margin-top:8px;">LEVEL UP! → ${levelData.title}</p>` : '';
        const subtitle = CAREER_DATA.zones[zoneIdx]?.subtitle || '';
        content.innerHTML = `
            <p class="zone-year">${this.currentYear}</p>
            <h2>${this.currentTitle}</h2>
            <p style="font-size:8px; color:#888; margin-bottom:8px;">${subtitle}</p>
            ${levelUpHtml}
            <p>${visibleText}</p>
            ${skipHint}
        `;
    },

    tryZoneCutscene(zoneIdx, callback) {
        if (zoneIdx !== this.lastZone && zoneIdx >= 0) {
            this.lastZone = zoneIdx;
            const zone = CAREER_DATA.zones[zoneIdx];
            if (zone) {
                this.show(zone, callback);
                return true;
            }
        }
        return false;
    }
};
