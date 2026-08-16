const Input = {
    keys: {},
    justPressed: {},
    isMobile: false,
    touchActive: {},

    init() {
        // Keyboard
        window.addEventListener('keydown', (e) => {
            if (!this.keys[e.code]) this.justPressed[e.code] = true;
            this.keys[e.code] = true;
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Detect any touch capability
        this.isMobile = ('ontouchstart' in window || navigator.maxTouchPoints > 0);

        if (this.isMobile) {
            this._initMobile();
        }
    },

    _initMobile() {
        document.getElementById('mobile-controls').classList.remove('hidden');

        // Prevent all default touch behavior on game container
        const container = document.getElementById('game-container');
        container.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

        // Canvas tap = Space (for start, popups, cutscenes)
        const canvas = document.getElementById('game-canvas');
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!this.keys['Space']) this.justPressed['Space'] = true;
            this.keys['Space'] = true;
        }, { passive: false });
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['Space'] = false;
        }, { passive: false });

        // Popup tap = Space
        const popup = document.getElementById('popup');
        popup.addEventListener('touchstart', (e) => {
            if (e.target.tagName === 'A') return; // allow link clicks
            e.preventDefault();
            if (!this.keys['Space']) this.justPressed['Space'] = true;
            this.keys['Space'] = true;
            setTimeout(() => { this.keys['Space'] = false; }, 150);
        }, { passive: false });

        // Cutscene tap = Space
        const cutscene = document.getElementById('cutscene');
        cutscene.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (!this.keys['Space']) this.justPressed['Space'] = true;
            this.keys['Space'] = true;
            setTimeout(() => { this.keys['Space'] = false; }, 150);
        }, { passive: false });

        // D-pad and action buttons
        this._setupButton('btn-left', 'ArrowLeft');
        this._setupButton('btn-right', 'ArrowRight');
        this._setupButton('btn-jump', 'Space');
        this._setupButton('btn-down', 'ArrowDown');
        this._setupButton('btn-dash', 'ShiftLeft');
    },

    _setupButton(id, keyCode) {
        const btn = document.getElementById(id);
        if (!btn) return;

        const onStart = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!this.keys[keyCode]) this.justPressed[keyCode] = true;
            this.keys[keyCode] = true;
            btn.classList.add('pressed');
            this.touchActive[id] = true;
        };

        const onEnd = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.keys[keyCode] = false;
            btn.classList.remove('pressed');
            this.touchActive[id] = false;
        };

        btn.addEventListener('touchstart', onStart, { passive: false });
        btn.addEventListener('touchend', onEnd, { passive: false });
        btn.addEventListener('touchcancel', onEnd, { passive: false });

        // Also handle mouse for testing on desktop
        btn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (!this.keys[keyCode]) this.justPressed[keyCode] = true;
            this.keys[keyCode] = true;
            btn.classList.add('pressed');
        });
        btn.addEventListener('mouseup', (e) => {
            this.keys[keyCode] = false;
            btn.classList.remove('pressed');
        });
        btn.addEventListener('mouseleave', (e) => {
            this.keys[keyCode] = false;
            btn.classList.remove('pressed');
        });
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
