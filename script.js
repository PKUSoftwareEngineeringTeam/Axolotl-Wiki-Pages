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
});
