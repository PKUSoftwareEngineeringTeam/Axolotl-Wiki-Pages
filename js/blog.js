function organizeBlogPosts() {
    const blogList = document.getElementById('blogList');
    const blogCards = Array.from(blogList.querySelectorAll('.blog-card'));

    blogList.innerHTML = '';

    const groupedCards = {};
    const otherGroups = [];

    blogCards.forEach(card => {
        const groupElement = card.querySelector('[data-group]');
        const group = groupElement ? groupElement.getAttribute('data-group') : null;

        if (group) {
            if (!groupedCards[group]) {
                groupedCards[group] = [];
                otherGroups.push(group);
            }
            groupedCards[group].push(card);
        } else {
            if (!groupedCards['未分组']) {
                groupedCards['未分组'] = [];
            }
            groupedCards['未分组'].push(card);
        }
    });

    otherGroups.forEach(groupName => {
        const groupContainer = document.createElement('div');
        groupContainer.className = 'blog-group';
        groupContainer.setAttribute('data-group', groupName);

        const groupHeader = document.createElement('div');
        groupHeader.className = 'blog-group-header';

        const groupTitle = document.createElement('h2');
        groupTitle.className = 'blog-group-title';
        groupTitle.textContent = groupName;

        const groupCount = document.createElement('span');
        groupCount.className = 'blog-group-count';
        groupCount.textContent = `${groupedCards[groupName].length}篇文章`;

        groupHeader.appendChild(groupTitle);
        groupHeader.appendChild(groupCount);
        groupContainer.appendChild(groupHeader);

        const groupList = document.createElement('div');
        groupList.className = 'blog-list';

        groupedCards[groupName].forEach(card => {
            groupList.appendChild(card);
        });

        groupContainer.appendChild(groupList);
        blogList.appendChild(groupContainer);
    });

    // render "未分组" at the end
    if (groupedCards['未分组'] && groupedCards['未分组'].length > 0) {
        const groupContainer = document.createElement('div');
        groupContainer.className = 'blog-group';
        groupContainer.setAttribute('data-group', '未分组');

        const noGroupTitle = document.createElement('h2');
        noGroupTitle.className = 'no-group-title';
        noGroupTitle.textContent = '未分组文章';
        groupContainer.appendChild(noGroupTitle);

        const groupList = document.createElement('div');
        groupList.className = 'blog-group-list';

        groupedCards['未分组'].forEach(card => {
            groupList.appendChild(card);
        });

        groupContainer.appendChild(groupList);
        blogList.appendChild(groupContainer);
    }

    const groups = document.querySelectorAll('.blog-group');
    groups.forEach((group, index) => {
        group.style.animationDelay = `${index * 0.1}s`;
    });
}

function performSearch(query) {
    const blogCards = document.querySelectorAll('.blog-card');
    let hasResults = false;

    const existingNoResults = document.querySelector('.no-results-message');
    existingNoResults.style.display = 'none';

    if (!query.trim()) {
        blogCards.forEach(card => {
            card.style.display = 'flex';
        });
        return;
    }

    const lowerQuery = query.toLowerCase().trim();
    blogCards.forEach(card => {
        const title = card.querySelector('.blog-card-title').textContent.toLowerCase();
        const excerpt = card.querySelector('.blog-card-excerpt').textContent.toLowerCase();
        const tags = Array.from(card.querySelectorAll('.tag-pill'))
            .map(tag => tag.textContent.toLowerCase())
            .join(' ');

        const matches = title.includes(lowerQuery) ||
            excerpt.includes(lowerQuery) ||
            tags.includes(lowerQuery);

        if (matches) {
            card.style.display = 'flex';
            hasResults = true;

            highlightText(card, lowerQuery);
        } else {
            card.style.display = 'none';
        }
    });

    if (!hasResults) {
        existingNoResults.style.display = 'block';
        const queryElement = document.getElementById('search-query');
        queryElement.textContent = query;
    }
}

function highlightText(element, query) {
    const highlights = element.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });

    if (query.length < 2) return;

    highlightElement(element.querySelector('.blog-card-title'), query);
    highlightElement(element.querySelector('.blog-card-excerpt'), query);
}

function highlightElement(element, query) {
    if (!element) return;

    const text = element.textContent;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');

    if (regex.test(text)) {
        const newHTML = text.replace(regex, '<span class="search-highlight">$1</span>');
        element.innerHTML = newHTML;
    }
}

function initSearch() {
    const searchForm = document.getElementById('blog-search-form');
    const searchInput = document.getElementById('blog-search-input');
    const searchButton = document.getElementById('blog-search-button');

    let searchTimeout;
    searchInput.addEventListener('input', function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(this.value);
        }, 300);
    });

    searchButton.addEventListener('click', function () {
        const query = searchInput.value.trim();
        performSearch(query);

        if (window.innerWidth < 768) {
            searchInput.blur();
        }
    });

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = searchInput.value.trim();
        performSearch(query);
    });

    document.addEventListener('click', function (e) {
        if (!searchForm.contains(e.target)) {
            searchForm.classList.remove('active');
        }
    });

    searchInput.addEventListener('focus', function () {
        searchForm.classList.add('active');
    });

    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            this.value = '';
            performSearch('');
            this.blur();
            searchForm.classList.remove('active');
        }
    });

    const clearButton = document.getElementById('search-clear-button');

    clearButton.addEventListener('click', function () {
        searchInput.value = '';
        performSearch('');
        searchInput.focus();
        this.style.display = 'none';
    });

    searchInput.addEventListener('input', function () {
        clearButton.style.display = this.value ? 'block' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initSearch();
    organizeBlogPosts();
});
