// Booking Page Functionality

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadBookingData();
    initializeFormValidation();
    calculateTotal();
});

// Load booking data from sessionStorage
function loadBookingData() {
    // Load from seat selection
    const seatSelection = sessionStorage.getItem('seatSelection');
    if (seatSelection) {
        const data = JSON.parse(seatSelection);
        updateTicketInfo(data);
        calculatePaymentSummary(data);
    } else {
        // Fallback to showtime data if seat selection not available
        const bookingData = sessionStorage.getItem('bookingData');
        if (bookingData) {
            const data = JSON.parse(bookingData);
            updateTicketInfo(data);
        }
    }
}

// Update ticket information display
function updateTicketInfo(data) {
    if (data.movie) {
        document.getElementById('ticket-movie').textContent = data.movie;
    }
    if (data.cinema) {
        document.getElementById('ticket-cinema').textContent = data.cinema;
    }
    if (data.room) {
        document.getElementById('ticket-room').textContent = data.room;
    }
    if (data.showtime) {
        const parts = data.showtime.split(' - ');
        if (parts.length === 2) {
            document.getElementById('ticket-time').textContent = parts[0];
            document.getElementById('ticket-date').textContent = parts[1];
        }
    }
    
    // Update seats
    if (data.seats && Array.isArray(data.seats)) {
        const seatsContainer = document.getElementById('ticket-seats');
        seatsContainer.innerHTML = '';
        data.seats.forEach(seat => {
            const badge = document.createElement('span');
            badge.className = 'seat-badge-ticket';
            badge.textContent = seat;
            seatsContainer.appendChild(badge);
        });
    }
}

// Calculate payment summary
function calculatePaymentSummary(data) {
    const seatSelection = sessionStorage.getItem('seatSelection');
    let ticketPrice = 0;
    let ticketCount = 0;
    
    if (seatSelection) {
        const seatData = JSON.parse(seatSelection);
        ticketCount = seatData.ticketCount || 0;
        // Extract price from totalPrice string (e.g., "300.000đ")
        const priceText = seatData.totalPrice || '0đ';
        ticketPrice = parsePrice(priceText);
    }
    
    const surcharge = 0; // No surcharge for now
    const discount = 0; // No discount for now
    const total = ticketPrice + surcharge - discount;
    
    // Update summary display
    document.getElementById('summary-ticket-price').textContent = formatPrice(ticketPrice);
    document.getElementById('summary-surcharge').textContent = formatPrice(surcharge);
    document.getElementById('summary-discount').textContent = '-' + formatPrice(discount);
    document.getElementById('summary-total').textContent = formatPrice(total);
}

// Parse price from string (e.g., "300.000đ" -> 300000)
function parsePrice(priceString) {
    return parseInt(priceString.replace(/[^\d]/g, '')) || 0;
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

// Initialize form validation
function initializeFormValidation() {
    const form = document.getElementById('customerForm');
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error
    field.classList.remove('error');
    const existingError = field.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Validate required
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Trường này là bắt buộc';
    }
    
    // Validate email
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Email không hợp lệ';
        }
    }
    
    // Validate phone
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(value.replace(/[^\d]/g, ''))) {
            isValid = false;
            errorMessage = 'Số điện thoại không hợp lệ (10-11 số)';
        }
    }
    
    // Show error if invalid
    if (!isValid) {
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        field.parentElement.appendChild(errorDiv);
    }
    
    return isValid;
}

// Validate entire form
function validateForm() {
    const form = document.getElementById('customerForm');
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    // Check terms checkbox
    const termsCheckbox = document.getElementById('termsCheckbox');
    if (!termsCheckbox.checked) {
        isValid = false;
        showNotification('Vui lòng đồng ý với điều khoản sử dụng', 'warning');
    }
    
    return isValid;
}

// Apply promo code
let appliedPromoCode = null;
const promoCodes = {
    'WELCOME10': { discount: 0.1, type: 'percent' },
    'CINEMA50K': { discount: 50000, type: 'fixed' },
    'VIP20': { discount: 0.2, type: 'percent' },
    'SAVE30K': { discount: 30000, type: 'fixed' }
};

function applyPromoCode() {
    const promoInput = document.getElementById('promo-code');
    const promoValue = promoInput.value.trim().toUpperCase();
    const promoMessage = document.getElementById('promoMessage');
    const promoIcon = promoMessage.querySelector('.promo-icon');
    const promoText = promoMessage.querySelector('.promo-text');
    
    if (!promoValue) {
        showPromoMessage('Vui lòng nhập mã giảm giá', 'error');
        return;
    }
    
    if (promoCodes[promoValue]) {
        appliedPromoCode = {
            code: promoValue,
            ...promoCodes[promoValue]
        };
        showPromoMessage(`Mã ${promoValue} đã được áp dụng thành công!`, 'success');
        updateSummaryWithPromo();
    } else {
        appliedPromoCode = null;
        showPromoMessage('Mã giảm giá không hợp lệ', 'error');
        updateSummaryWithPromo();
    }
}

function removePromoCode() {
    appliedPromoCode = null;
    document.getElementById('promo-code').value = '';
    document.getElementById('promoMessage').style.display = 'none';
    updateSummaryWithPromo();
}

function showPromoMessage(message, type) {
    const promoMessage = document.getElementById('promoMessage');
    const promoIcon = promoMessage.querySelector('.promo-icon');
    const promoText = promoMessage.querySelector('.promo-text');
    
    promoMessage.className = 'promo-code-message ' + type;
    promoMessage.style.display = 'flex';
    
    if (type === 'success') {
        promoIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
    } else {
        promoIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
    }
    
    promoText.textContent = message;
}

function updateSummaryWithPromo() {
    const ticketPrice = parsePrice(document.getElementById('summary-ticket-price').textContent);
    const surcharge = 0;
    let discount = 0;
    
    if (appliedPromoCode) {
        if (appliedPromoCode.type === 'percent') {
            discount = Math.floor(ticketPrice * appliedPromoCode.discount);
        } else {
            discount = appliedPromoCode.discount;
        }
        
        // Show applied promo code
        document.getElementById('promoCodeApplied').textContent = appliedPromoCode.code;
        document.getElementById('promoApplied').style.display = 'flex';
    } else {
        document.getElementById('promoApplied').style.display = 'none';
    }
    
    const total = ticketPrice + surcharge - discount;
    
    document.getElementById('summary-discount').textContent = '-' + formatPrice(discount);
    document.getElementById('summary-total').textContent = formatPrice(total);
}

// Continue to payment page
function continueToPayment() {
    // Validate form
    if (!validateForm()) {
        showNotification('Vui lòng điền đầy đủ thông tin và đồng ý với điều khoản', 'error');
        return;
    }
    
    // Get form data
    const formData = {
        name: document.getElementById('customer-name').value.trim(),
        phone: document.getElementById('customer-phone').value.trim(),
        email: document.getElementById('customer-email').value.trim()
    };
    
    // Prepare booking data
    const bookingData = {
        ...formData,
        ticketInfo: {
            movie: document.getElementById('ticket-movie').textContent,
            cinema: document.getElementById('ticket-cinema').textContent,
            room: document.getElementById('ticket-room').textContent,
            date: document.getElementById('ticket-date').textContent,
            time: document.getElementById('ticket-time').textContent,
            seats: Array.from(document.querySelectorAll('.seat-badge-ticket')).map(b => b.textContent)
        },
        totalPrice: document.getElementById('summary-total').textContent,
        promoCode: appliedPromoCode,
        bookingDate: new Date().toISOString()
    };
    
    // Store booking data
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    // Redirect to payment page
    window.location.href = 'payment.html';
}

// Show notification
function showNotification(message, type = 'success') {
    const notificationSection = document.getElementById('notificationSection');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationIcon = notification.querySelector('.notification-icon');
    
    // Remove existing classes
    notification.className = 'notification';
    notification.classList.add(type);
    
    // Set icon based on type
    const icons = {
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-exclamation-circle"></i>',
        warning: '<i class="fas fa-exclamation-triangle"></i>'
    };
    notificationIcon.innerHTML = icons[type] || icons.success;
    
    // Set message
    notificationMessage.textContent = message;
    
    // Show notification
    notificationSection.style.display = 'block';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        closeNotification();
    }, 5000);
    
    // Scroll to notification
    notificationSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Close notification
function closeNotification() {
    const notificationSection = document.getElementById('notificationSection');
    notificationSection.style.display = 'none';
}

// Format phone number on input
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('customer-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove non-numeric characters
            let value = e.target.value.replace(/[^\d]/g, '');
            e.target.value = value;
        });
    }
});
