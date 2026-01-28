// Payment Page Functionality

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadPaymentData();
    initializeFormValidation();
    initializeCardInputs();
    showPaymentDetails('momo'); // Show default payment method
});

// Load payment data from sessionStorage
function loadPaymentData() {
    // Load from seat selection or final booking
    const seatSelection = sessionStorage.getItem('seatSelection');
    const finalBooking = sessionStorage.getItem('finalBooking');
    
    let data = {};
    
    if (finalBooking) {
        data = JSON.parse(finalBooking);
        // Fill customer form if data exists
        if (data.name) {
            document.getElementById('customer-name-payment').value = data.name;
        }
        if (data.phone) {
            document.getElementById('customer-phone-payment').value = data.phone;
        }
        if (data.email) {
            document.getElementById('customer-email-payment').value = data.email;
        }
        if (data.paymentMethod) {
            const radio = document.querySelector(`input[name="payment-method-payment"][value="${data.paymentMethod}"]`);
            if (radio) {
                radio.checked = true;
                showPaymentDetails(data.paymentMethod);
            }
        }
    } else if (seatSelection) {
        data = JSON.parse(seatSelection);
    } else {
        // Fallback to booking data
        const bookingData = sessionStorage.getItem('bookingData');
        if (bookingData) {
            data = JSON.parse(bookingData);
        }
    }
    
    updateOrderInfo(data);
    calculatePaymentSummary(data);
}

// Update order information display (Rút gọn)
function updateOrderInfo(data) {
    if (data.movie || data.ticketInfo?.movie) {
        const movie = data.movie || data.ticketInfo?.movie;
        document.getElementById('order-movie').textContent = movie;
    }
    
    // Update datetime (rút gọn)
    let dateTime = '';
    if (data.ticketInfo) {
        dateTime = `${data.ticketInfo.time || ''} - ${data.ticketInfo.date || ''}`;
    } else if (data.showtime) {
        dateTime = data.showtime;
    }
    if (dateTime) {
        document.getElementById('order-datetime').textContent = dateTime;
    }
    
    // Update seats (compact)
    let seats = [];
    if (data.ticketInfo && data.ticketInfo.seats) {
        seats = data.ticketInfo.seats;
    } else if (data.seats) {
        seats = Array.isArray(data.seats) ? data.seats : [data.seats];
    }
    
    if (seats.length > 0) {
        const seatsContainer = document.getElementById('order-seats-compact');
        if (seatsContainer) {
            seatsContainer.innerHTML = '';
            seats.forEach(seat => {
                const badge = document.createElement('span');
                badge.className = 'seat-badge-compact';
                badge.textContent = seat;
                seatsContainer.appendChild(badge);
            });
        }
    }
    
    // Update counter cinema name
    if (data.cinema || data.ticketInfo?.cinema) {
        const cinema = data.cinema || data.ticketInfo?.cinema;
        const counterCinema = document.getElementById('counter-cinema-name');
        if (counterCinema) {
            counterCinema.textContent = cinema;
        }
    }
}

// Calculate payment summary
function calculatePaymentSummary(data) {
    const seatSelection = sessionStorage.getItem('seatSelection');
    const finalBooking = sessionStorage.getItem('finalBooking');
    
    let ticketPrice = 0;
    let ticketCount = 0;
    
    if (finalBooking && finalBooking.totalPrice) {
        const booking = JSON.parse(finalBooking);
        ticketPrice = parsePrice(booking.totalPrice);
        ticketCount = booking.ticketCount || 1;
    } else if (seatSelection) {
        const seatData = JSON.parse(seatSelection);
        ticketCount = seatData.ticketCount || 0;
        const priceText = seatData.totalPrice || '0đ';
        ticketPrice = parsePrice(priceText);
    }
    
    const surcharge = 0;
    const discount = 0;
    const total = ticketPrice + surcharge - discount;
    
    // Update summary display
    document.getElementById('summary-ticket-price-payment').textContent = formatPrice(ticketPrice);
    document.getElementById('summary-surcharge-payment').textContent = formatPrice(surcharge);
    document.getElementById('summary-discount-payment').textContent = '-' + formatPrice(discount);
    document.getElementById('summary-total-payment').textContent = formatPrice(total);
}

// Parse price from string
function parsePrice(priceString) {
    if (typeof priceString === 'string') {
        return parseInt(priceString.replace(/[^\d]/g, '')) || 0;
    }
    return priceString || 0;
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

// Show payment details based on selected method
function showPaymentDetails(method) {
    // Hide all payment detail cards
    const allDetails = document.querySelectorAll('.payment-details-card');
    allDetails.forEach(card => {
        card.style.display = 'none';
    });
    
    // Show selected payment method details
    const detailCard = document.getElementById(method + 'Details');
    if (detailCard) {
        detailCard.style.display = 'block';
    }
}

// Initialize form validation
function initializeFormValidation() {
    const form = document.getElementById('customerFormPayment');
    const inputs = form.querySelectorAll('input[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateFieldPayment(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateFieldPayment(this);
            }
        });
    });
}

// Validate individual field
function validateFieldPayment(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error
    field.classList.remove('error');
    const existingError = field.parentElement.querySelector('.error-message-payment');
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
        errorDiv.className = 'error-message-payment';
        errorDiv.textContent = errorMessage;
        field.parentElement.appendChild(errorDiv);
    }
    
    return isValid;
}

// Validate entire form
function validatePaymentForm() {
    const form = document.getElementById('customerFormPayment');
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateFieldPayment(input)) {
            isValid = false;
        }
    });
    
    // Validate payment details based on method
    const selectedMethod = document.querySelector('input[name="payment-method-payment"]:checked').value;
    
    if (selectedMethod === 'momo') {
        const momoPhone = document.getElementById('momo-phone');
        if (momoPhone && (!momoPhone.value.trim() || !/^[0-9]{10,11}$/.test(momoPhone.value.replace(/[^\d]/g, '')))) {
            isValid = false;
            showPaymentStatus('Vui lòng nhập số điện thoại MoMo hợp lệ', 'error');
        }
    } else if (selectedMethod === 'vnpay') {
        const vnpayBank = document.getElementById('vnpay-bank');
        if (vnpayBank && !vnpayBank.value) {
            isValid = false;
            showPaymentStatus('Vui lòng chọn ngân hàng', 'error');
        }
    } else if (selectedMethod === 'banking') {
        const cardNumber = document.getElementById('card-number');
        const cardName = document.getElementById('card-name');
        const cardExpiry = document.getElementById('card-expiry');
        const cardCvv = document.getElementById('card-cvv');
        
        if (!cardNumber || !cardNumber.value.trim() || cardNumber.value.replace(/[^\d]/g, '').length < 16) {
            isValid = false;
            showPaymentStatus('Vui lòng nhập số thẻ hợp lệ', 'error');
        }
        if (!cardName || !cardName.value.trim()) {
            isValid = false;
            showPaymentStatus('Vui lòng nhập tên chủ thẻ', 'error');
        }
        if (!cardExpiry || !/^\d{2}\/\d{2}$/.test(cardExpiry.value)) {
            isValid = false;
            showPaymentStatus('Vui lòng nhập ngày hết hạn hợp lệ (MM/YY)', 'error');
        }
        if (!cardCvv || cardCvv.value.length < 3) {
            isValid = false;
            showPaymentStatus('Vui lòng nhập CVV hợp lệ', 'error');
        }
    }
    
    // Check terms checkbox
    const termsCheckbox = document.getElementById('termsCheckboxPayment');
    if (!termsCheckbox.checked) {
        isValid = false;
        showPaymentStatus('Vui lòng đồng ý với điều khoản sử dụng', 'error');
    }
    
    return isValid;
}

// Initialize card input formatting
function initializeCardInputs() {
    // Card number formatting
    const cardNumber = document.getElementById('card-number');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/[^\d]/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            if (formattedValue.length > 19) formattedValue = formattedValue.substr(0, 19);
            e.target.value = formattedValue;
        });
    }
    
    // Card expiry formatting
    const cardExpiry = document.getElementById('card-expiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // CVV formatting
    const cardCvv = document.getElementById('card-cvv');
    if (cardCvv) {
        cardCvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^\d]/g, '');
        });
    }
    
    // Phone formatting
    const momoPhone = document.getElementById('momo-phone');
    if (momoPhone) {
        momoPhone.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^\d]/g, '');
        });
    }
    
    const customerPhone = document.getElementById('customer-phone-payment');
    if (customerPhone) {
        customerPhone.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^\d]/g, '');
        });
    }
}

// Process payment
function processPayment() {
    // Validate form
    if (!validatePaymentForm()) {
        return;
    }
    
    // Get form data
    const formData = {
        name: document.getElementById('customer-name-payment').value.trim(),
        phone: document.getElementById('customer-phone-payment').value.trim(),
        email: document.getElementById('customer-email-payment').value.trim(),
        paymentMethod: document.querySelector('input[name="payment-method-payment"]:checked').value
    };
    
    // Get payment details based on method
    const paymentDetails = {};
    if (formData.paymentMethod === 'momo') {
        paymentDetails.phone = document.getElementById('momo-phone').value.trim();
    } else if (formData.paymentMethod === 'vnpay') {
        paymentDetails.bank = document.getElementById('vnpay-bank').value;
    } else if (formData.paymentMethod === 'banking') {
        paymentDetails.cardNumber = document.getElementById('card-number').value.trim();
        paymentDetails.cardName = document.getElementById('card-name').value.trim();
        paymentDetails.cardExpiry = document.getElementById('card-expiry').value.trim();
        paymentDetails.cardCvv = document.getElementById('card-cvv').value.trim();
    }
    
    // Show processing status
    showPaymentStatus('Đang xử lý thanh toán...', 'processing');
    
    // Disable button
    const processBtn = document.getElementById('processPaymentBtn');
    processBtn.disabled = true;
    processBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    
    // Simulate payment processing
    setTimeout(() => {
        // Simulate payment success/failure (90% success rate)
        const success = Math.random() > 0.1;
        
        if (success) {
            // Payment success
            showPaymentStatus('Thanh toán thành công! Đang chuyển hướng...', 'success');
            
            // Store final booking data
            const finalBooking = {
                ...formData,
                paymentDetails,
                orderInfo: {
                    movie: document.getElementById('order-movie').textContent,
                    cinema: document.getElementById('order-cinema').textContent,
                    room: document.getElementById('order-room').textContent,
                    date: document.getElementById('order-date').textContent,
                    time: document.getElementById('order-time').textContent,
                    seats: Array.from(document.querySelectorAll('.seat-badge-order')).map(b => b.textContent),
                    quantity: parseInt(document.getElementById('order-quantity').textContent)
                },
                totalPrice: document.getElementById('summary-total-payment').textContent,
                bookingDate: new Date().toISOString(),
                paymentStatus: 'success'
            };
            
            sessionStorage.setItem('finalBooking', JSON.stringify(finalBooking));
            
            // Redirect to confirmation page after 2 seconds
            setTimeout(() => {
                window.location.href = 'confirmation.html';
            }, 2000);
        } else {
            // Payment failed
            showPaymentStatus('Thanh toán thất bại. Vui lòng thử lại hoặc chọn phương thức thanh toán khác.', 'error');
            
            // Re-enable button
            processBtn.disabled = false;
            processBtn.innerHTML = '<i class="fas fa-lock"></i> Thanh toán';
        }
    }, 2000);
}

// Show payment status
function showPaymentStatus(message, type = 'processing') {
    const statusSection = document.getElementById('paymentStatusSection');
    const statusDiv = document.getElementById('paymentStatus');
    const statusTitle = document.getElementById('statusTitle');
    const statusMessage = document.getElementById('statusMessage');
    const statusIcon = statusDiv.querySelector('.status-icon i');
    
    // Remove existing classes
    statusDiv.className = 'payment-status';
    statusDiv.classList.add(type);
    
    // Set icon and message based on type
    const statusConfig = {
        processing: {
            icon: '<i class="fas fa-spinner fa-spin"></i>',
            title: 'Đang xử lý thanh toán...',
            message: message
        },
        success: {
            icon: '<i class="fas fa-check-circle"></i>',
            title: 'Thanh toán thành công!',
            message: message
        },
        error: {
            icon: '<i class="fas fa-times-circle"></i>',
            title: 'Thanh toán thất bại',
            message: message
        }
    };
    
    const config = statusConfig[type] || statusConfig.processing;
    statusIcon.innerHTML = config.icon;
    statusTitle.textContent = config.title;
    statusMessage.textContent = config.message;
    
    // Show status section
    statusSection.style.display = 'block';
    
    // Scroll to status
    statusSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
