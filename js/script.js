class ThemeManager {
    constructor() {
        this.themes = ['light', 'dark', 'axolotl'];
        const savedTheme = localStorage.getItem('theme');
        this.currentTheme = this.themes.includes(savedTheme) ? savedTheme : 'light';
        this.init();
    }
    
    isValidTheme(theme) {
        return this.themes.includes(theme);
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.bindEvents();
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;
    }

    cycleTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.applyTheme(this.themes[nextIndex]);
    }

    bindEvents() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.cycleTheme());
        }
    }
}

class MobileMenu {
    constructor() {
        this.menu = document.querySelector('.nav-menu');
        this.toggle = document.querySelector('.nav-toggle');
        if (this.menu && this.toggle) {
            this.init();
        }
    }

    init() {
        if (this.toggle) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }
    }

    toggleMenu() {
        this.menu.classList.toggle('active');
        this.toggle.classList.toggle('active');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new MobileMenu();
    colorizeTagPills();
    formatArticleDates();
});

/**
 * Format any <time class="article-date"> datetime attribute into a
 * localized, human-friendly date string (zh-CN format: YYYY年M月D日).
 */
function formatArticleDates() {
    const timeEls = document.querySelectorAll('time.article-date');
    timeEls.forEach((el) => {
        let dt = el.getAttribute('datetime');
        if (!dt) return;
        dt = dt.trim();
        const d = new Date(dt);
        if (isNaN(d)) {
            // debug: invalid date format
            console.warn('formatArticleDates: invalid date for element', el, 'datetime:', el.getAttribute('datetime'));
            return;
        }
        try {
            const formatted = d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
            el.textContent = formatted;
        } catch (e) {
            // Fallback: keep original content
        }
    });
}

/**
 * Deterministically assigns background colors to tag pills.
 * Restricted to Blue-Purple shades (Hue 210 - 275).
 */
function colorizeTagPills() {
    // Simple hash to map a string to an integer
    function getHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash |= 0; // Convert to 32bit int
        }
        return Math.abs(hash);
    }

    const tagPills = document.querySelectorAll('.tag-pill');

    tagPills.forEach((el) => {
        const tag = (el.textContent || el.innerText || '').trim();
        if (!tag) return;
        const hash = getHash(tag);
        const hue = 210 + (hash % 65);
        const sat = 50 + (hash % 25);
        const light = 42 + (hash % 16);
        el.style.backgroundColor = `hsl(${hue}, ${sat}%, ${light}%)`;
        el.style.color = '#ffffff';
        el.style.borderColor = `hsl(${hue}, ${sat}%, ${light - 5}%)`;
    });
}
