// Error 404 Page Functionality

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('errorSearchInput');
    
    if (searchInput) {
        // Search on Enter key press
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                handleErrorSearch();
            }
        });
    }
}

// Handle search from error page
function handleErrorSearch() {
    const searchInput = document.getElementById('errorSearchInput');
    const searchValue = searchInput ? searchInput.value.trim() : '';

    if (searchValue) {
        // Redirect to movies page with search query
        window.location.href = `movies.html?search=${encodeURIComponent(searchValue)}`;
    } else {
        // If no search value, just go to movies page
        window.location.href = 'movies.html';
    }
}
