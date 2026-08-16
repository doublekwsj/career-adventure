const Input = {
    keys: {},
    justPressed: {},
    mouseX: 0,
    mouseY: 0,

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

        // Mouse/touch for menus
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Mobile controls
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.getElementById('mobile-controls').classList.remove('hidden');
            this._setupMobileButton('btn-left', 'ArrowLeft');
            this._setupMobileButton('btn-right', 'ArrowRight');
            this._setupMobileButton('btn-jump', 'Space');
            this._setupMobileButton('btn-down', 'ArrowDown');
        }
    },

    _setupMobileButton(id, keyCode) {
        const btn = document.getElementById(id);
        const start = (e) => {
            e.preventDefault();
            if (!this.keys[keyCode]) this.justPressed[keyCode] = true;
            this.keys[keyCode] = true;
        };
        const end = (e) => {
            e.preventDefault();
            this.keys[keyCode] = false;
        };
        btn.addEventListener('touchstart', start, { passive: false });
        btn.addEventListener('touchend', end, { passive: false });
        btn.addEventListener('touchcancel', end, { passive: false });
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
