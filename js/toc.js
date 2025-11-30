document.addEventListener('DOMContentLoaded', function () {
    const contentContainer = document.querySelector('.article-content');
    if (!contentContainer) return;

    const tocContainer = document.createElement('div');
    tocContainer.className = 'toc-sidebar';

    const HEADER_OFFSET = 100;
    const OBSERVER_MARGIN = '-90px 0px -60% 0px';
    let isClicking = false; 

    const articleTitle = document.querySelector('h1');
    const titleText = articleTitle ? articleTitle.innerText : '目录';

    const tocTitle = document.createElement('h3');
    tocTitle.className = 'toc-title';
    tocTitle.innerText = titleText;

    tocTitle.addEventListener('click', () => {
        isClicking = true; 

        tocContainer.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        tocContainer.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        setTimeout(() => {
            isClicking = false;
        }, 1000);
    });

    tocContainer.appendChild(tocTitle);

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

        // 点击目录项跳转
        link.addEventListener('click', (e) => {
            e.preventDefault();
            isClicking = true;

            tocContainer.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');

            const elementPosition = heading.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - HEADER_OFFSET;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            setTimeout(() => {
                isClicking = false;
            }, 1000);
        });

        li.appendChild(link);
        tocList.appendChild(li);
    });
    document.body.appendChild(tocContainer);

    const tocLinks = tocContainer.querySelectorAll('a');

    // 滚动监听
    const observerOptions = {
        root: null,
        rootMargin: OBSERVER_MARGIN,
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        if (isClicking) return;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                tocLinks.forEach(link => link.classList.remove('active'));

                const activeLink = tocContainer.querySelector(`a[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    activeLink.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'start'
                    });
                }
            }
        });
    }, observerOptions);

    headings.forEach(heading => {
        observer.observe(heading);
    });
});