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
    addCopyButtons();
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
 * Restricted to pastel colors for better aesthetics.
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

        const hue = hash % 360; // Hue between 0-359
        const sat = 40 + (hash % 25); // Saturation between 40-64%
        const light = 82 + (hash % 10); // Lightness between 82-91% 

        const bgColor = `hsl(${hue}, ${sat}%, ${light}%)`;
        el.style.backgroundColor = bgColor;

        const textLight = light - 60;
        el.style.color = `hsl(${hue}, ${sat}%, ${textLight}%)`;

        const borderLight = light - 20;
        el.style.borderColor = `hsl(${hue}, ${sat}%, ${borderLight}%)`;
    });
}

function workspace(path) {
    const siteMeta = document.getElementById('site-meta');
    const baseUrl = siteMeta ? siteMeta.getAttribute('data-base') || '' : '';
    return baseUrl.trim() + path;
}

/**
 * Fetch the site map JSON file.
 */
async function fetchSiteMap() {
    const siteMap = workspace("sitemap.json");
    try {
        const response = await fetch(siteMap);
        if (!response.ok) {
            console.error('Failed to fetch sitemap:', response.statusText);
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching sitemap:', error);
        return null;
    }
}

/**
 * Toggle the theme between light and dark.
 */
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// static/js/base.js

function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre');

    codeBlocks.forEach((pre) => {
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.textContent = 'Copy';
        button.type = 'button';
        
        button.addEventListener('click', async () => {
            const code = pre.querySelector('code');
            const text = code ? code.innerText : pre.innerText;

            try {
                await navigator.clipboard.writeText(text);
                
                button.textContent = 'Copied!';
                button.classList.add('copied');
                
                setTimeout(() => {
                    button.textContent = 'Copy';
                    button.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
                button.textContent = 'Error';
            }
        });

        pre.appendChild(button);
    });
}