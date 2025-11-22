const urlParams = new URLSearchParams(window.location.search);
const topic = urlParams.get('topic');

if (topic) {
    fetchArticle(topic);
} else {
    document.getElementById('article-content').innerHTML = '<p>No topic specified. <a href="index.html">Go back</a></p>';
}

async function fetchArticle(topic) {
    try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/html/${encodeURIComponent(topic)}`);
        if (response.ok) {
            const html = await response.text();
            document.getElementById('article-content').innerHTML = html;
            // Update title
            document.title = `${topic} - InfoMedia`;
        } else {
            document.getElementById('article-content').innerHTML = '<p>Article not found. Try another search. <a href="index.html">Go back</a></p>';
        }
    } catch (error) {
        console.error('Error fetching article:', error);
        document.getElementById('article-content').innerHTML = '<p>Error loading article. <a href="index.html">Go back</a></p>';
    }
}