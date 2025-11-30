async function countArticleNumber() {
    const siteMap = await fetchSiteMap();
    if (!siteMap) return;
    const articleCount = Object.keys(siteMap.urlset).length;
    const statNumberEl = document.getElementById('article-number');
    if (statNumberEl) {
        statNumberEl.textContent = articleCount.toString();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    countArticleNumber();
});
