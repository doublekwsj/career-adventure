const Input = {
    keys: {},
    justPressed: {},
    isMobile: false,

    init() {
        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.code]) {
                this.justPressed[e.code] = true;
            }
            this.keys[e.code] = true;
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Detect mobile
        this.isMobile = ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
                        (window.innerWidth <= 1024);

        if (this.isMobile) {
            document.getElementById('mobile-controls').classList.remove('hidden');
            document.getElementById('mobile-tap-zone').classList.remove('hidden');
            this._setupMobileControls();
            this._setupTapZone();
        }
    },

    _setupMobileControls() {
        // Use a unified touch handler for multi-touch support
        const buttons = {
            'btn-left': 'ArrowLeft',
            'btn-right': 'ArrowRight',
            'btn-jump': 'Space',
            'btn-down': 'ArrowDown'
        };

        for (const [id, keyCode] of Object.entries(buttons)) {
            const btn = document.getElementById(id);
            if (!btn) continue;

            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!this.keys[keyCode]) this.justPressed[keyCode] = true;
                this.keys[keyCode] = true;
                btn.classList.add('pressed');
            }, { passive: false });

            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.keys[keyCode] = false;
                btn.classList.remove('pressed');
            }, { passive: false });

            btn.addEventListener('touchcancel', (e) => {
                this.keys[keyCode] = false;
                btn.classList.remove('pressed');
            }, { passive: false });

            // Handle finger sliding off button
            btn.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                const rect = btn.getBoundingClientRect();
                const inside = touch.clientX >= rect.left && touch.clientX <= rect.right &&
                               touch.clientY >= rect.top && touch.clientY <= rect.bottom;
                if (!inside) {
                    this.keys[keyCode] = false;
                    btn.classList.remove('pressed');
                }
            }, { passive: false });
        }
    },

    _setupTapZone() {
        // Tap anywhere on screen (outside buttons) to trigger "anyKey" for menus/popups
        const tapZone = document.getElementById('mobile-tap-zone');
        tapZone.addEventListener('touchstart', (e) => {
            // Only act as "any key" press for title/cutscene/popup
            this.justPressed['Space'] = true;
            this.keys['Space'] = true;
            // Auto-release after short time
            setTimeout(() => { this.keys['Space'] = false; }, 100);
        }, { passive: true });
    },

    isDown(code) {
        return !!this.keys[code];
    },

    wasPressed(code) {
        return !!this.justPressed[code];
    },

    anyKey() {
        return Object.keys(this.justPressed).length > 0;
    },

    update() {
        this.justPressed = {};
    }
};
