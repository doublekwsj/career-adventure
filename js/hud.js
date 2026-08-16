const HUD = {
    el: document.getElementById('hud'),
    yearEl: document.getElementById('hud-year'),
    titleEl: document.getElementById('hud-zone-title'),
    hpEl: document.getElementById('hud-hp'),
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

        if (data.hp !== undefined && this.hpEl) {
            const hearts = Array.from({ length: data.maxHp }, (_, i) =>
                `<span style="color:${i < data.hp ? '#f44336' : '#444'}">♥</span>`
            ).join('');
            this.hpEl.innerHTML = `<span style="color:#aaa">x${data.lives}</span> ${hearts}`;
        }
    }
};
