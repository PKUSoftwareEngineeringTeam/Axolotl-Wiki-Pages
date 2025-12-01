
async function getArticleStats() {
    const siteMap = await fetchSiteMap();
    if (!siteMap) return;
    const articleCount = Object.keys(siteMap.urlset).length;
    const statNumberEl = document.getElementById('article-number');
    if (statNumberEl) {
        statNumberEl.textContent = articleCount.toString();
    }
    var allTags = new Set();
    Object.values(siteMap.urlset).forEach(article => {
        if (article.meta && article.meta.tags) {
            article.meta.tags.forEach(tag => allTags.add(tag));
        }
    });
    const tagCountEl = document.getElementById('tag-number');
    if (tagCountEl) {
        tagCountEl.textContent = allTags.size.toString();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    getArticleStats();
});
