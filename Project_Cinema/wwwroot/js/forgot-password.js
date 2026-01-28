// Forgot Password Page Functionality

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeForgotPasswordForm();
});

// Initialize forgot password form
function initializeForgotPasswordForm() {
    const form = document.getElementById('forgotPasswordForm');
    const identifierInput = document.getElementById('forgotPasswordIdentifier');
    
    // Real-time validation
    identifierInput.addEventListener('input', function() {
        validateIdentifier(this.value, false);
    });
    
    identifierInput.addEventListener('blur', function() {
        validateIdentifier(this.value, true);
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleForgotPassword();
    });
}

// Validate identifier (email or phone)
function validateIdentifier(value, showError) {
    const errorElement = document.getElementById('identifierError');
    const input = document.getElementById('forgotPasswordIdentifier');
    const inputWrapper = input.closest('.input-wrapper-modern');
    const successIcon = inputWrapper.querySelector('.input-success-icon');
    const errorIcon = inputWrapper.querySelector('.input-error-icon');
    
    inputWrapper.classList.remove('valid', 'invalid');
    if (successIcon) successIcon.style.display = 'none';
    if (errorIcon) errorIcon.style.display = 'none';
    
    if (!value.trim()) {
        if (showError) {
            errorElement.textContent = 'Vui lòng nhập email hoặc số điện thoại';
            inputWrapper.classList.add('invalid');
            if (errorIcon) errorIcon.style.display = 'block';
        } else {
            errorElement.textContent = '';
        }
        return false;
    }
    
    // Check if it's email or phone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,11}$/;
    
    const isValidEmail = emailRegex.test(value);
    const isValidPhone = phoneRegex.test(value.replace(/\s/g, ''));
    
    if (!isValidEmail && !isValidPhone) {
        if (showError) {
            errorElement.textContent = 'Email hoặc số điện thoại không hợp lệ';
            inputWrapper.classList.add('invalid');
            if (errorIcon) errorIcon.style.display = 'block';
        } else {
            errorElement.textContent = '';
        }
        return false;
    }
    
    // Valid
    errorElement.textContent = '';
    inputWrapper.classList.add('valid');
    if (successIcon) successIcon.style.display = 'block';
    return true;
}

// Handle forgot password
function handleForgotPassword() {
    const identifier = document.getElementById('forgotPasswordIdentifier').value.trim();
    const submitBtn = document.getElementById('forgotPasswordSubmitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Validate input
    const isValid = validateIdentifier(identifier, true);
    
    if (!isValid) {
        showAlert('Vui lòng kiểm tra lại thông tin đã nhập', 'error');
        return;
    }
    
    // Disable button and show loading
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
    
    // Simulate API call
    setTimeout(() => {
        // Mock check - in real app, this would check if email/phone exists
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userExists = registeredUsers.find(u => 
            u.email === identifier || u.phone === identifier
        );
        
        if (!userExists && identifier !== 'user@example.com' && identifier !== '0123456789') {
            // Email/phone not found
            showAlert('Email hoặc số điện thoại không tồn tại trong hệ thống', 'error');
            
            submitBtn.disabled = false;
            btnText.style.display = 'flex';
            btnLoader.style.display = 'none';
            
            // Shake animation
            const form = document.getElementById('forgotPasswordForm');
            form.style.animation = 'shake 0.5s';
            setTimeout(() => {
                form.style.animation = '';
            }, 500);
        } else {
            // Success - simulate sending email
            showAlert('Đã gửi liên kết khôi phục mật khẩu! Vui lòng kiểm tra email của bạn.', 'success');
            
            // Store recovery request (in real app, this would be handled by backend)
            const recoveryData = {
                identifier: identifier,
                timestamp: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
            };
            sessionStorage.setItem('passwordRecovery', JSON.stringify(recoveryData));
            
            // Show success message with redirect option
            setTimeout(() => {
                const confirmRedirect = confirm('Bạn có muốn quay lại trang đăng nhập không?');
                if (confirmRedirect) {
                    window.location.href = 'login.html?recovery=sent';
                }
            }, 2000);
        }
    }, 1500); // Simulate network delay
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertElement = document.getElementById('forgotPasswordAlert');
    const alertIcon = alertElement.querySelector('.alert-icon');
    const alertText = alertElement.querySelector('.alert-text');
    
    alertElement.className = 'alert-message';
    alertElement.classList.add(type);
    
    alertText.textContent = message;
    
    alertElement.style.display = 'flex';
    
    if (type !== 'success') {
        setTimeout(() => {
            alertElement.style.display = 'none';
        }, 5000);
    }
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% {
            transform: translateX(0);
        }
        10%, 30%, 50%, 70%, 90% {
            transform: translateX(-10px);
        }
        20%, 40%, 60%, 80% {
            transform: translateX(10px);
        }
    }
`;
document.head.appendChild(style);

// Check if recovery was already sent
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('recovery') === 'sent') {
        showAlert('Liên kết khôi phục đã được gửi đến email của bạn!', 'success');
    }
});
