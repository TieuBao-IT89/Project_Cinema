// Payment Failed Page Functionality

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadPaymentData();
});

// Load payment data from sessionStorage or URL params
function loadPaymentData() {
    // Try to get data from sessionStorage first
    const bookingData = sessionStorage.getItem('bookingData');
    let paymentData = null;

    if (bookingData) {
        try {
            paymentData = JSON.parse(bookingData);
        } catch (e) {
            console.error('Error parsing booking data:', e);
        }
    }

    // Get failure reason from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const reason = urlParams.get('reason') || 'Số dư tài khoản không đủ hoặc thông tin thẻ không hợp lệ.';
    const transactionCode = urlParams.get('code') || generateTransactionCode();

    // Update failure reason
    const failureReasonElement = document.getElementById('failureReason');
    if (failureReasonElement) {
        failureReasonElement.textContent = reason;
    }

    // Update transaction code
    const transactionCodeElement = document.getElementById('transactionCode');
    if (transactionCodeElement) {
        transactionCodeElement.textContent = transactionCode;
    }
}

// Generate transaction code
function generateTransactionCode() {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    return `TXN-${dateStr}-${randomNum}`;
}
