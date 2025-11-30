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
        groupList.className = 'blog-group-list';

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

document.addEventListener('DOMContentLoaded', organizeBlogPosts);