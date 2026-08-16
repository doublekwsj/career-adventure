const Utils = {
    lerp(a, b, t) {
        return a + (b - a) * t;
    },

    clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    },

    rand(min, max) {
        return Math.random() * (max - min) + min;
    },

    randInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    easeOutBounce(t) {
        if (t < 1 / 2.75) return 7.5625 * t * t;
        if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    },

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    },

    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    },

    // Screen shake helper
    shake: { x: 0, y: 0, intensity: 0, duration: 0 },

    startShake(intensity, duration) {
        this.shake.intensity = intensity;
        this.shake.duration = duration;
    },

    updateShake() {
        if (this.shake.duration > 0) {
            this.shake.duration--;
            this.shake.x = (Math.random() - 0.5) * this.shake.intensity;
            this.shake.y = (Math.random() - 0.5) * this.shake.intensity;
            this.shake.intensity *= 0.9;
        } else {
            this.shake.x = 0;
            this.shake.y = 0;
        }
    }
};
