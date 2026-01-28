// Login Page Functionality

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeLoginForm();
    initializePasswordToggle();
    initializeSocialLogin();
});

// Initialize login form
function initializeLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) {
        return;
    }
    const identifierInput = document.getElementById('loginIdentifier');
    const passwordInput = document.getElementById('loginPassword');
    const submitBtn = document.getElementById('loginSubmitBtn');

    if (form.dataset.serverAuth === 'true') {
        if (submitBtn) {
            submitBtn.addEventListener('click', function () {
                form.submit();
            });
        }
        return;
    }
    
    // Real-time validation
    identifierInput.addEventListener('input', function() {
        validateIdentifier(this.value, false);
    });
    
    identifierInput.addEventListener('blur', function() {
        validateIdentifier(this.value, true);
    });
    
    passwordInput.addEventListener('input', function() {
        validatePassword(this.value, false);
    });
    
    passwordInput.addEventListener('blur', function() {
        validatePassword(this.value, true);
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        if (form.dataset.serverAuth === 'true') {
            return;
        }
        e.preventDefault();
        handleLogin();
    });
}

// Validate identifier (email or phone)
function validateIdentifier(value, showError) {
    const errorElement = document.getElementById('identifierError');
    const input = document.getElementById('loginIdentifier');
    const inputWrapper = input.closest('.input-wrapper-modern');
    const successIcon = inputWrapper.querySelector('.input-success-icon');
    const errorIcon = inputWrapper.querySelector('.input-error-icon');
    
    // Remove previous validation states
    inputWrapper.classList.remove('valid', 'invalid');
    if (successIcon) successIcon.style.display = 'none';
    if (errorIcon) errorIcon.style.display = 'none';
    
    if (!value.trim()) {
        if (showError) {
            errorElement.textContent = 'Vui lòng nhập email hoặc số điện thoại';
            input.classList.add('invalid');
            errorIcon.style.display = 'block';
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

// Validate password
function validatePassword(value, showError) {
    const errorElement = document.getElementById('passwordError');
    const input = document.getElementById('loginPassword');
    const inputWrapper = input.closest('.input-wrapper-modern');
    const successIcon = inputWrapper.querySelector('.input-success-icon');
    const errorIcon = inputWrapper.querySelector('.input-error-icon');
    
    // Remove previous validation states
    inputWrapper.classList.remove('valid', 'invalid');
    if (successIcon) successIcon.style.display = 'none';
    if (errorIcon) errorIcon.style.display = 'none';
    
    if (!value) {
        if (showError) {
            errorElement.textContent = 'Vui lòng nhập mật khẩu';
            input.classList.add('invalid');
            errorIcon.style.display = 'block';
        } else {
            errorElement.textContent = '';
        }
        return false;
    }
    
    if (value.length < 6) {
        if (showError) {
            errorElement.textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
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

// Handle login
function handleLogin() {
    const identifier = document.getElementById('loginIdentifier').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const submitBtn = document.getElementById('loginSubmitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Validate inputs
    const isIdentifierValid = validateIdentifier(identifier, true);
    const isPasswordValid = validatePassword(password, true);
    
    if (!isIdentifierValid || !isPasswordValid) {
        showAlert('Vui lòng kiểm tra lại thông tin đăng nhập', 'error');
        return;
    }
    
    // Disable button and show loading
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
    
    // Simulate API call
    setTimeout(() => {
        // Mock login logic
        const mockUsers = [
            { identifier: 'user@example.com', password: '123456', name: 'Nguyễn Văn A' },
            { identifier: 'admin@cinemahub.vn', password: 'admin123', name: 'Admin' },
            { identifier: '0123456789', password: '123456', name: 'Nguyễn Văn B' }
        ];
        
        const user = mockUsers.find(u => 
            u.identifier === identifier && u.password === password
        );
        
        if (user) {
            // Success
            showAlert('Đăng nhập thành công! Đang chuyển hướng...', 'success');
            
            // Store user session (in real app, this would be handled by backend)
            if (rememberMe) {
                localStorage.setItem('userToken', 'mock_token_' + Date.now());
                localStorage.setItem('userName', user.name);
                localStorage.setItem('userIdentifier', identifier);
            } else {
                sessionStorage.setItem('userToken', 'mock_token_' + Date.now());
                sessionStorage.setItem('userName', user.name);
                sessionStorage.setItem('userIdentifier', identifier);
            }
            
            // Redirect after 1.5 seconds
            setTimeout(() => {
                // Get redirect URL from URL params or default to index
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect') || 'index.html';
                window.location.href = redirect;
            }, 1500);
        } else {
            // Error
            showAlert('Email/số điện thoại hoặc mật khẩu không chính xác', 'error');
            
            // Re-enable button
            submitBtn.disabled = false;
            btnText.style.display = 'flex';
            btnLoader.style.display = 'none';
            
            // Shake animation
            const form = document.getElementById('loginForm');
            form.style.animation = 'shake 0.5s';
            setTimeout(() => {
                form.style.animation = '';
            }, 500);
        }
    }, 1500); // Simulate network delay
}

// Initialize password toggle
function initializePasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('loginPassword');
    const icon = toggleBtn.querySelector('i');
    
    toggleBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle icon
        if (type === 'text') {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
}

// Initialize social login
function initializeSocialLogin() {
    const googleBtn = document.querySelector('.btn-google');
    const facebookBtn = document.querySelector('.btn-facebook');
    
    googleBtn.addEventListener('click', function() {
        showAlert('Đăng nhập với Google đang được phát triển...', 'info');
        // In real app: window.location.href = '/api/auth/google';
    });
    
    facebookBtn.addEventListener('click', function() {
        showAlert('Đăng nhập với Facebook đang được phát triển...', 'info');
        // In real app: window.location.href = '/api/auth/facebook';
    });
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertElement = document.getElementById('loginAlert');
    const alertIcon = alertElement.querySelector('.alert-icon');
    const alertText = alertElement.querySelector('.alert-text');
    
    // Remove previous classes
    alertElement.className = 'alert-message';
    alertElement.classList.add(type);
    
    // Set message
    alertText.textContent = message;
    
    // Show alert
    alertElement.style.display = 'flex';
    
    // Auto hide after 5 seconds (except for success)
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

// Check if user is already logged in
window.addEventListener('load', function() {
    const serverAuthForm = document.querySelector('form[data-server-auth="true"]');
    if (serverAuthForm) {
        return;
    }
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    if (token) {
        // User is already logged in
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect') || 'index.html';
        
        // Show info message
        showAlert('Bạn đã đăng nhập. Đang chuyển hướng...', 'info');
        
        // Redirect after 1 second
        setTimeout(() => {
            window.location.href = redirect;
        }, 1000);
    }
});
