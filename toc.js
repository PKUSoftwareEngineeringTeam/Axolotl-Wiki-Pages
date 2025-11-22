document.addEventListener('DOMContentLoaded', function () {
    const contentContainer = document.querySelector('.article-content');
    if (!contentContainer) return;

    const tocContainer = document.createElement('div');
    tocContainer.className = 'toc-sidebar';
    const articleTitle = document.querySelector('h1');
    const titleText = articleTitle ? articleTitle.innerText : '目录';

    tocContainer.innerHTML = `<h3 class="toc-title">${titleText}</h3>`;

    const tocList = document.createElement('ul');
    tocContainer.appendChild(tocList);

    const headings = contentContainer.querySelectorAll('h2, h3');
    if (headings.length === 0) return;

    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.className = heading.nodeName.toLowerCase() === 'h2' ? 'toc-h2' : 'toc-h3';

        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById(heading.id).scrollIntoView({
                behavior: 'smooth'
            });
        });

        li.appendChild(link);
        tocList.appendChild(li);
    });
    document.body.appendChild(tocContainer);
});
