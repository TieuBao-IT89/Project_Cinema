// Movies page functionality

// Tab switching
function switchTab(tabName) {
    // Update tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach((btn, index) => {
        btn.classList.remove('active');
        // Activate the correct button based on tabName
        if ((tabName === 'now-showing' && index === 0) || (tabName === 'coming-soon' && index === 1)) {
            btn.classList.add('active');
        }
    });
    
    // Show/hide sections
    const sections = document.querySelectorAll('.movies-list-section');
    sections.forEach(section => {
        section.classList.remove('active-tab');
    });
    
    const activeSection = document.getElementById(tabName);
    if (activeSection) {
        activeSection.classList.add('active-tab');
        // Reset pagination
        currentPage = 1;
        displayPage(1, activeSection);
    }
    
    // Reset filters when switching tabs
    resetFilters();
}

// Filter movies
function filterMovies() {
    const genre = document.getElementById('genre-filter').value;
    const country = document.getElementById('country-filter').value;
    const age = document.getElementById('age-filter').value;
    const format = document.getElementById('format-filter').value;
    const status = document.getElementById('status-filter').value;
    
    // Get active tab
    const activeSection = document.querySelector('.movies-list-section.active-tab');
    if (!activeSection) return;
    
    const movieCards = activeSection.querySelectorAll('.movie-card');
    let visibleCount = 0;
    
    movieCards.forEach(card => {
        let shouldShow = true;
        
        // Filter by genre
        if (genre && !card.dataset.genre.includes(genre)) {
            shouldShow = false;
        }
        
        // Filter by country
        if (country && card.dataset.country !== country) {
            shouldShow = false;
        }
        
        // Filter by age
        if (age && card.dataset.age !== age) {
            shouldShow = false;
        }
        
        // Filter by format
        if (format && !card.dataset.format.includes(format)) {
            shouldShow = false;
        }
        
        // Filter by status
        if (status && card.dataset.status !== status) {
            shouldShow = false;
        }
        
        if (shouldShow) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });
    
    // Update count
    updateMovieCount(activeSection.id, visibleCount);
    
    // Reset pagination to first page
    currentPage = 1;
    displayPage(1, activeSection);
}

// Search movies
function searchMovies() {
    const searchTerm = document.getElementById('movie-search').value.toLowerCase().trim();
    
    // Get active tab
    const activeSection = document.querySelector('.movies-list-section.active-tab');
    if (!activeSection) return;
    
    const movieCards = activeSection.querySelectorAll('.movie-card');
    let visibleCount = 0;
    
    if (searchTerm === '') {
        // If search is empty, apply filters
        filterMovies();
        return;
    }
    
    movieCards.forEach(card => {
        const movieName = card.querySelector('.movie-name').textContent.toLowerCase();
        const genre = card.querySelector('.genre').textContent.toLowerCase();
        
        if (movieName.includes(searchTerm) || genre.includes(searchTerm)) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });
    
    // Update count
    updateMovieCount(activeSection.id, visibleCount);
    
    // Reset pagination to first page
    currentPage = 1;
    displayPage(1, activeSection);
}

// Reset all filters
function resetFilters() {
    document.getElementById('genre-filter').value = '';
    document.getElementById('country-filter').value = '';
    document.getElementById('age-filter').value = '';
    document.getElementById('format-filter').value = '';
    document.getElementById('status-filter').value = '';
    document.getElementById('movie-search').value = '';
    
    // Show all movies
    const activeSection = document.querySelector('.movies-list-section.active-tab');
    if (!activeSection) return;
    
    const movieCards = activeSection.querySelectorAll('.movie-card');
    movieCards.forEach(card => {
        card.classList.remove('hidden');
    });
    
    // Update count
    updateMovieCount(activeSection.id, movieCards.length);
    
    // Reset pagination to first page
    currentPage = 1;
    displayPage(1, activeSection);
}

// Update movie count
function updateMovieCount(sectionId, count) {
    const countElement = document.getElementById(sectionId + '-count');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Pagination functions
let currentPage = 1;
const moviesPerPage = 12;

function changePage(direction) {
    const activeSection = document.querySelector('.movies-list-section.active-tab');
    if (!activeSection) return;
    
    const visibleCards = Array.from(activeSection.querySelectorAll('.movie-card:not(.hidden)'));
    const totalPages = Math.ceil(visibleCards.length / moviesPerPage);
    
    currentPage += direction;
    
    if (currentPage < 1) {
        currentPage = 1;
    } else if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    
    displayPage(currentPage, activeSection);
}

function goToPage(page) {
    currentPage = page;
    const activeSection = document.querySelector('.movies-list-section.active-tab');
    if (activeSection) {
        displayPage(currentPage, activeSection);
    }
}

function displayPage(page, section) {
    const visibleCards = Array.from(section.querySelectorAll('.movie-card:not(.hidden)'));
    const totalPages = Math.ceil(visibleCards.length / moviesPerPage) || 1;
    
    // If only one page or less, show all cards
    if (totalPages <= 1) {
        visibleCards.forEach(card => {
            card.style.display = 'block';
        });
        // Hide pagination if not needed
        const pagination = section.querySelector('.pagination-wrapper');
        if (pagination && visibleCards.length <= moviesPerPage) {
            pagination.style.display = 'none';
        } else if (pagination) {
            pagination.style.display = 'flex';
        }
        return;
    }
    
    // Show pagination
    const pagination = section.querySelector('.pagination-wrapper');
    if (pagination) {
        pagination.style.display = 'flex';
    }
    
    // Hide all cards first
    visibleCards.forEach(card => {
        card.style.display = 'none';
    });
    
    // Show cards for current page
    const startIndex = (page - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    
    visibleCards.slice(startIndex, endIndex).forEach(card => {
        card.style.display = 'block';
    });
    
    // Update pagination UI
    updatePaginationUI(page, totalPages);
}

function updatePaginationUI(currentPage, totalPages) {
    const pageNumbers = document.querySelectorAll('.page-number');
    pageNumbers.forEach((btn, index) => {
        if (index + 1 === currentPage) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Disable prev/next buttons
    const prevBtn = document.querySelector('.page-btn:first-child');
    const nextBtn = document.querySelector('.page-btn:last-child');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
    }
}

// Load more movies
function loadMoreMovies() {
    const activeSection = document.querySelector('.movies-list-section.active-tab');
    if (!activeSection) return;
    
    const hiddenCards = activeSection.querySelectorAll('.movie-card.hidden');
    
    // Show next batch of hidden cards
    const batchSize = 6;
    let shown = 0;
    
    hiddenCards.forEach(card => {
        if (shown < batchSize) {
            card.classList.remove('hidden');
            shown++;
        }
    });
    
    // Update count
    const visibleCards = activeSection.querySelectorAll('.movie-card:not(.hidden)');
    updateMovieCount(activeSection.id, visibleCards.length);
    
    // If no more cards to show, hide the button
    if (activeSection.querySelectorAll('.movie-card.hidden').length === 0) {
        const loadMoreBtn = document.querySelector('.btn-load-more');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for search input (real-time search)
    const searchInput = document.getElementById('movie-search');
    if (searchInput) {
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchMovies();
            }, 300); // Debounce search
        });
        
        // Also search on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchMovies();
            }
        });
    }
    
    // Initialize pagination for active tab
    const activeSection = document.querySelector('.movies-list-section.active-tab');
    if (activeSection) {
        displayPage(1, activeSection);
    }
    
    // Smooth scroll for anchor links
    if (window.location.hash === '#coming-soon') {
        setTimeout(() => {
            switchTab('coming-soon');
            const comingSoonSection = document.getElementById('coming-soon');
            if (comingSoonSection) {
                comingSoonSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
});

// Filter movies when any filter changes
document.addEventListener('DOMContentLoaded', function() {
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            // If search is active, combine with search
            const searchTerm = document.getElementById('movie-search').value.trim();
            if (searchTerm) {
                // Apply both filters and search
                applyCombinedFilters();
            } else {
                filterMovies();
            }
        });
    });
});

// Apply combined filters and search
function applyCombinedFilters() {
    const searchTerm = document.getElementById('movie-search').value.toLowerCase().trim();
    const genre = document.getElementById('genre-filter').value;
    const country = document.getElementById('country-filter').value;
    const age = document.getElementById('age-filter').value;
    const format = document.getElementById('format-filter').value;
    const status = document.getElementById('status-filter').value;
    
    const activeSection = document.querySelector('.movies-list-section.active-tab');
    if (!activeSection) return;
    
    const movieCards = activeSection.querySelectorAll('.movie-card');
    let visibleCount = 0;
    
    movieCards.forEach(card => {
        let shouldShow = true;
        
        // Search filter
        if (searchTerm) {
            const movieName = card.querySelector('.movie-name').textContent.toLowerCase();
            const genreText = card.querySelector('.genre').textContent.toLowerCase();
            if (!movieName.includes(searchTerm) && !genreText.includes(searchTerm)) {
                shouldShow = false;
            }
        }
        
        // Genre filter
        if (genre && !card.dataset.genre.includes(genre)) {
            shouldShow = false;
        }
        
        // Country filter
        if (country && card.dataset.country !== country) {
            shouldShow = false;
        }
        
        // Age filter
        if (age && card.dataset.age !== age) {
            shouldShow = false;
        }
        
        // Format filter
        if (format && !card.dataset.format.includes(format)) {
            shouldShow = false;
        }
        
        // Status filter
        if (status && card.dataset.status !== status) {
            shouldShow = false;
        }
        
        if (shouldShow) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });
    
    updateMovieCount(activeSection.id, visibleCount);
    
    // Reset pagination to first page
    currentPage = 1;
    displayPage(1, activeSection);
}
