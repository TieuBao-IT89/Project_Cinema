// Booking Success Page Functionality

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Prefer server-rendered data (ASP.NET MVC)
    if (window.__bookingSuccessData) {
        applyServerData(window.__bookingSuccessData);
        return;
    }

    // Fallback to old demo behavior (sessionStorage)
    loadBookingData();
    generateBookingCode();
});

function applyServerData(data) {
    try {
        if (data.bookingCode) {
            document.getElementById('bookingCode').textContent = data.bookingCode;
        }
        if (data.customerEmail) {
            document.getElementById('customerEmail').textContent = data.customerEmail;
        }
        if (data.movie) document.getElementById('ticketMovie').textContent = data.movie;
        if (data.cinema) document.getElementById('ticketCinema').textContent = data.cinema;
        if (data.room) document.getElementById('ticketRoom').textContent = data.room;
        if (data.date) document.getElementById('ticketDate').textContent = data.date;
        if (data.time) document.getElementById('ticketTime').textContent = data.time;
        if (data.customerName) document.getElementById('ticketCustomer').textContent = data.customerName;
        if (data.totalPrice) document.getElementById('ticketPrice').textContent = data.totalPrice;

        if (Array.isArray(data.seats)) {
            const seatsContainer = document.getElementById('ticketSeats');
            if (seatsContainer) {
                seatsContainer.innerHTML = '';
                data.seats.forEach(seat => {
                    const badge = document.createElement('span');
                    badge.className = 'ticket-seat-badge';
                    badge.textContent = seat;
                    seatsContainer.appendChild(badge);
                });
            }
        }

        if (data.cinema) {
            const cinemaName = document.getElementById('cinemaName');
            if (cinemaName) cinemaName.textContent = data.cinema;
        }
        if (data.cinemaAddress) {
            const cinemaAddress = document.getElementById('cinemaAddress');
            if (cinemaAddress) cinemaAddress.textContent = data.cinemaAddress;
        }
    } catch (e) {
        // noop
    }
}

// Load booking data from sessionStorage
function loadBookingData() {
    const finalBooking = sessionStorage.getItem('finalBooking');
    const bookingData = sessionStorage.getItem('bookingData');
    
    let data = {};
    
    if (finalBooking) {
        data = JSON.parse(finalBooking);
    } else if (bookingData) {
        data = JSON.parse(bookingData);
    } else {
        // Fallback to seat selection
        const seatSelection = sessionStorage.getItem('seatSelection');
        if (seatSelection) {
            data = JSON.parse(seatSelection);
        }
    }
    
    // Update ticket information
    if (data.ticketInfo) {
        updateTicketInfo(data.ticketInfo, data);
    } else {
        // Fallback display
        updateTicketInfo(data, data);
    }
    
    // Update customer email
    if (data.email) {
        document.getElementById('customerEmail').textContent = data.email;
    }
    
    // Update cinema info
    if (data.ticketInfo?.cinema) {
        document.getElementById('cinemaName').textContent = data.ticketInfo.cinema;
    }
}

// Update ticket information display
function updateTicketInfo(ticketInfo, fullData) {
    // Movie
    if (ticketInfo.movie) {
        document.getElementById('ticketMovie').textContent = ticketInfo.movie;
    }
    
    // Cinema
    if (ticketInfo.cinema) {
        document.getElementById('ticketCinema').textContent = ticketInfo.cinema;
    }
    
    // Room
    if (ticketInfo.room) {
        document.getElementById('ticketRoom').textContent = ticketInfo.room;
    }
    
    // Date
    if (ticketInfo.date) {
        document.getElementById('ticketDate').textContent = ticketInfo.date;
    }
    
    // Time
    if (ticketInfo.time) {
        document.getElementById('ticketTime').textContent = ticketInfo.time;
    }
    
    // Seats
    if (ticketInfo.seats && Array.isArray(ticketInfo.seats)) {
        const seatsContainer = document.getElementById('ticketSeats');
        seatsContainer.innerHTML = '';
        ticketInfo.seats.forEach(seat => {
            const badge = document.createElement('span');
            badge.className = 'ticket-seat-badge';
            badge.textContent = seat;
            seatsContainer.appendChild(badge);
        });
    }
    
    // Customer name
    if (fullData.name) {
        document.getElementById('ticketCustomer').textContent = fullData.name;
    }
    
    // Price
    if (fullData.totalPrice) {
        document.getElementById('ticketPrice').textContent = fullData.totalPrice;
    }
}

// Generate booking code
function generateBookingCode() {
    // In server version we already have booking code
    if (window.__bookingSuccessData && window.__bookingSuccessData.bookingCode) {
        document.getElementById('bookingCode').textContent = window.__bookingSuccessData.bookingCode;
        return;
    }

    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const date = new Date();
    const dateStr = date.getFullYear().toString().substring(2) + 
                   (date.getMonth() + 1).toString().padStart(2, '0') + 
                   date.getDate().toString().padStart(2, '0');
    const bookingCode = `CTMH${dateStr}${random}`;
    
    document.getElementById('bookingCode').textContent = bookingCode;
    
    // Store booking code
    if (!sessionStorage.getItem('bookingCode')) {
        sessionStorage.setItem('bookingCode', bookingCode);
    }
}

// Copy booking code
function copyBookingCode() {
    const bookingCode = document.getElementById('bookingCode').textContent;
    const btnCopy = document.querySelector('.btn-copy-code');
    
    // Copy to clipboard
    navigator.clipboard.writeText(bookingCode).then(() => {
        // Show success feedback
        const originalHTML = btnCopy.innerHTML;
        btnCopy.innerHTML = '<i class="fas fa-check"></i>';
        btnCopy.style.background = '#28a745';
        btnCopy.style.borderColor = '#28a745';
        btnCopy.style.color = '#fff';
        
        // Show toast notification
        showToast('Đã sao chép mã đặt vé!', 'success');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            btnCopy.innerHTML = originalHTML;
            btnCopy.style.background = '';
            btnCopy.style.borderColor = '';
            btnCopy.style.color = '';
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showToast('Không thể sao chép mã. Vui lòng thử lại.', 'error');
    });
}

// Download ticket as PDF
function downloadTicket() {
    // Simulate PDF download
    showToast('Đang tạo file PDF...', 'info');
    
    setTimeout(() => {
        showToast('Đã tải xuống thành công!', 'success');
        
        // In a real application, this would trigger a PDF download
        // window.open('/api/tickets/download/' + bookingCode, '_blank');
    }, 1500);
}

// Send email again
function sendEmail() {
    const email = document.getElementById('customerEmail').textContent;
    
    showToast('Đang gửi lại email...', 'info');
    
    setTimeout(() => {
        showToast(`Đã gửi lại email đến ${email}`, 'success');
        
        // In a real application, this would call an API to resend email
        // fetch('/api/bookings/resend-email', { method: 'POST', body: JSON.stringify({ email }) });
    }, 1500);
}

// Share ticket
function shareTicket() {
    const bookingCode = document.getElementById('bookingCode').textContent;
    
    if (navigator.share) {
        navigator.share({
            title: 'Mã đặt vé CinemaHub',
            text: `Mã đặt vé của tôi: ${bookingCode}`,
            url: window.location.href
        }).then(() => {
            showToast('Đã chia sẻ thành công!', 'success');
        }).catch(err => {
            console.error('Share failed:', err);
        });
    } else {
        // Fallback: copy to clipboard
        copyBookingCode();
        showToast('Đã sao chép mã đặt vé để chia sẻ!', 'success');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    
    const icons = {
        success: '<i class="fas fa-check-circle"></i>',
        error: '<i class="fas fa-exclamation-circle"></i>',
        info: '<i class="fas fa-info-circle"></i>'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type] || icons.success}</div>
        <div class="toast-message">${message}</div>
    `;
    
    document.body.appendChild(toast);
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Add toast styles dynamically
const style = document.createElement('style');
style.textContent = `
    .toast-notification {
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--bg-card);
        padding: 16px 24px;
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease-out;
        border: 2px solid var(--border-color);
        max-width: 400px;
    }
    
    .toast-notification.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .toast-success {
        border-color: #28a745;
        background: rgba(40, 167, 69, 0.1);
    }
    
    .toast-error {
        border-color: #dc3545;
        background: rgba(220, 53, 69, 0.1);
    }
    
    .toast-info {
        border-color: #17a2b8;
        background: rgba(23, 162, 184, 0.1);
    }
    
    .toast-icon {
        font-size: 24px;
        flex-shrink: 0;
    }
    
    .toast-success .toast-icon {
        color: #28a745;
    }
    
    .toast-error .toast-icon {
        color: #dc3545;
    }
    
    .toast-info .toast-icon {
        color: #17a2b8;
    }
    
    .toast-message {
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
    }
    
    @media (max-width: 768px) {
        .toast-notification {
            bottom: 20px;
            right: 20px;
            left: 20px;
            max-width: none;
        }
    }
`;
document.head.appendChild(style);
