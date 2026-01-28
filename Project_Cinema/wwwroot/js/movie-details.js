// Movie Details Page Functionality

// Set minimum date for date picker
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('date-filter');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        dateInput.value = today;
    }
    
    // Handle time slot selection
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            if (!this.classList.contains('sold-out')) {
                // Remove active state from all slots
                timeSlots.forEach(s => s.classList.remove('selected'));
                // Add active state to clicked slot
                this.classList.add('selected');
                
                // Get time and price
                const time = this.querySelector('.time').textContent;
                const price = this.querySelector('.price').textContent;
                
                // Here you would normally redirect to booking page
                // window.location.href = `booking.html?time=${time}&price=${price}`;
                console.log('Selected time:', time, 'Price:', price);
            }
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Filter showtimes
    const theaterFilter = document.getElementById('theater-filter');
    const dateFilter = document.getElementById('date-filter');
    
    if (theaterFilter) {
        theaterFilter.addEventListener('change', filterShowtimes);
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', filterShowtimes);
    }
});

function filterShowtimes() {
    const theaterValue = document.getElementById('theater-filter').value;
    const dateValue = document.getElementById('date-filter').value;
    
    const theaterCards = document.querySelectorAll('.theater-card');
    
    theaterCards.forEach(card => {
        let shouldShow = true;
        
        // Filter by theater (if implemented with data attributes)
        // This is a placeholder for actual filtering logic
        
        if (shouldShow) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Trailer functionality
function playTrailer() {
    const preview = document.getElementById('trailerPreview');
    const video = document.getElementById('trailerVideo');
    const iframe = document.getElementById('trailerIframe');
    const trailerSection = document.querySelector('.trailer-section');
    
    if (preview && video && iframe) {
        // Set video source
        const dataUrl = trailerSection ? trailerSection.getAttribute('data-trailer-url') : '';
        const trailerUrl = dataUrl && dataUrl.trim().length > 0
            ? dataUrl
            : 'https://www.youtube.com/embed/TcMBFSGVi1c?autoplay=1';
        iframe.src = trailerUrl;
        
        // Hide preview and show video
        preview.style.display = 'none';
        video.style.display = 'block';
        
        // Smooth scroll to video
        video.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function closeTrailer() {
    const preview = document.getElementById('trailerPreview');
    const video = document.getElementById('trailerVideo');
    const iframe = document.getElementById('trailerIframe');
    
    if (preview && video && iframe) {
        // Stop video
        iframe.src = '';
        
        // Show preview and hide video
        preview.style.display = 'block';
        video.style.display = 'none';
        
        // Smooth scroll to preview
        preview.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Close trailer when clicking outside (optional)
document.addEventListener('click', function(e) {
    const video = document.getElementById('trailerVideo');
    const closeBtn = document.querySelector('.close-trailer');
    
    if (video && video.style.display === 'block') {
        if (e.target === video || (e.target.closest('.trailer-video') && e.target !== closeBtn)) {
            // Don't close if clicking inside iframe area
            if (!e.target.closest('iframe')) {
                // closeTrailer();
            }
        }
    }
});

// Parallax effect for banner (optional)
window.addEventListener('scroll', function() {
    const banner = document.querySelector('.movie-banner-image');
    if (banner) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        banner.style.transform = `translateY(${rate}px) scale(1.1)`;
    }
});
