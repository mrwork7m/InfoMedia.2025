document.getElementById('search-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('search-input').value.trim();
    if (query) {
        // Redirect to article page with query as URL param
        window.location.href = `article.html?topic=${encodeURIComponent(query)}`;
    }
});

// Optional: Add search suggestions (basic autocomplete using Wikipedia API)
document.getElementById('search-input').addEventListener('input', async (e) => {
    const query = e.target.value.trim();
    const suggestionsDiv = document.getElementById('suggestions');
    if (query.length < 3) {
        suggestionsDiv.innerHTML = '';
        return;
    }
    try {
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        if (response.ok) {
            const data = await response.json();
            suggestionsDiv.innerHTML = `<p>Suggestion: <a href="article.html?topic=${encodeURIComponent(query)}">${data.title}</a></p>`;
        } else {
            suggestionsDiv.innerHTML = '';
        }
    } catch (error) {
        console.error('Suggestion error:', error);
    }
});