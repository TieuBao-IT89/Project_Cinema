// Slider functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const indicators = document.querySelectorAll('.indicator');

// Auto-play slider
function autoPlaySlider() {
    // Only run if slider exists
    if (slides.length === 0) return;
    
    setInterval(() => {
        changeSlide(1);
    }, 5000); // Change slide every 5 seconds
}

// Change slide function
function changeSlide(direction) {
    // Check if slider exists
    if (!slides || slides.length === 0) return;
    
    // Remove active class from current slide
    if (slides[currentSlideIndex]) {
        slides[currentSlideIndex].classList.remove('active');
    }
    if (indicators[currentSlideIndex]) {
        indicators[currentSlideIndex].classList.remove('active');
    }
    
    currentSlideIndex += direction;
    
    // Handle wrapping
    if (currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = slides.length - 1;
    }
    
    // Add active class to new slide
    if (slides[currentSlideIndex]) {
        slides[currentSlideIndex].classList.add('active');
    }
    if (indicators[currentSlideIndex]) {
        indicators[currentSlideIndex].classList.add('active');
    }
}

// Go to specific slide
function currentSlide(index) {
    // Check if slider exists
    if (!slides || slides.length === 0) return;
    
    // Remove active class from current slide
    if (slides[currentSlideIndex]) {
        slides[currentSlideIndex].classList.remove('active');
    }
    if (indicators[currentSlideIndex]) {
        indicators[currentSlideIndex].classList.remove('active');
    }
    
    currentSlideIndex = index - 1;
    
    // Validate index
    if (currentSlideIndex < 0 || currentSlideIndex >= slides.length) {
        currentSlideIndex = 0;
    }
    
    // Add active class to new slide
    if (slides[currentSlideIndex]) {
        slides[currentSlideIndex].classList.add('active');
    }
    if (indicators[currentSlideIndex]) {
        indicators[currentSlideIndex].classList.add('active');
    }
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Set minimum date for date picker (today)
const dateInput = document.getElementById('date-select');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// Quick booking form validation
const bookingForm = document.querySelector('.booking-form');
if (bookingForm) {
    const bookingButton = document.querySelector('.btn-booking');
    if (bookingButton) {
        bookingButton.addEventListener('click', function(e) {
            e.preventDefault();
            const movie = document.getElementById('movie-select').value;
            const theater = document.getElementById('theater-select').value;
            const date = document.getElementById('date-select').value;
            const time = document.getElementById('time-select').value;
            
            if (!movie || !theater || !date || !time) {
                alert('Vui lòng điền đầy đủ thông tin để đặt vé!');
                return;
            }
            
            // Here you would normally submit the form or navigate to booking page
            alert('Đang chuyển đến trang đặt vé...');
            // window.location.href = 'booking.html';
        });
    }
}

// Initialize auto-play when page loads
window.addEventListener('DOMContentLoaded', function() {
    autoPlaySlider();
});

// Header scroll effect - Modern
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});
