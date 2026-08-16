const HUD = {
    el: document.getElementById('hud'),
    yearEl: document.getElementById('hud-year'),
    titleEl: document.getElementById('hud-zone-title'),
    scoreEl: document.getElementById('hud-score'),
    comboEl: document.getElementById('hud-combo'),
    coinsEl: document.getElementById('hud-coins'),
    progressBar: document.getElementById('hud-progress-bar'),

    show() {
        this.el.classList.remove('hidden');
    },

    hide() {
        this.el.classList.add('hidden');
    },

    update(data) {
        this.yearEl.textContent = data.year;
        this.titleEl.textContent = data.title;
        this.scoreEl.textContent = `SCORE: ${data.score.toLocaleString()}`;
        this.coinsEl.textContent = `★ ${data.collected} / ${data.total}`;
        this.progressBar.style.width = `${data.progress}%`;

        if (data.combo > 1) {
            this.comboEl.classList.remove('hidden');
            this.comboEl.textContent = `COMBO x${data.combo}`;
        } else {
            this.comboEl.classList.add('hidden');
        }
    }
};
