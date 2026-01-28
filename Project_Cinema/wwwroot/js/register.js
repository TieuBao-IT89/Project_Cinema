// Register Page Functionality

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeRegisterForm();
    initializePasswordToggles();
    initializePasswordStrength();
    initializeSocialRegister();
});

// Initialize register form
function initializeRegisterForm() {
    const form = document.getElementById('registerForm');
    const fullNameInput = document.getElementById('registerFullName');
    const emailInput = document.getElementById('registerEmail');
    const phoneInput = document.getElementById('registerPhone');
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('registerConfirmPassword');
    
    // Real-time validation
    fullNameInput.addEventListener('input', function() {
        validateFullName(this.value, false);
    });
    
    fullNameInput.addEventListener('blur', function() {
        validateFullName(this.value, true);
    });
    
    emailInput.addEventListener('input', function() {
        validateEmail(this.value, false);
    });
    
    emailInput.addEventListener('blur', function() {
        validateEmail(this.value, true);
    });
    
    phoneInput.addEventListener('input', function() {
        validatePhone(this.value, false);
    });
    
    phoneInput.addEventListener('blur', function() {
        validatePhone(this.value, true);
    });
    
    passwordInput.addEventListener('input', function() {
        validatePassword(this.value, false);
        checkPasswordStrength(this.value);
        if (confirmPasswordInput.value) {
            validateConfirmPassword(confirmPasswordInput.value, false);
        }
    });
    
    passwordInput.addEventListener('blur', function() {
        validatePassword(this.value, true);
    });
    
    confirmPasswordInput.addEventListener('input', function() {
        validateConfirmPassword(this.value, false);
    });
    
    confirmPasswordInput.addEventListener('blur', function() {
        validateConfirmPassword(this.value, true);
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleRegister();
    });
}

// Validate full name
function validateFullName(value, showError) {
    const errorElement = document.getElementById('fullNameError');
    const input = document.getElementById('registerFullName');
    const inputWrapper = input.closest('.input-wrapper-modern');
    const successIcon = inputWrapper.querySelector('.input-success-icon');
    const errorIcon = inputWrapper.querySelector('.input-error-icon');
    
    inputWrapper.classList.remove('valid', 'invalid');
    if (successIcon) successIcon.style.display = 'none';
    if (errorIcon) errorIcon.style.display = 'none';
    
    if (!value.trim()) {
        if (showError) {
            errorElement.textContent = 'Vui lòng nhập họ và tên';
            inputWrapper.classList.add('invalid');
            if (errorIcon) errorIcon.style.display = 'block';
        } else {
            errorElement.textContent = '';
        }
        return false;
    }
    
    if (value.trim().length < 2) {
        if (showError) {
            errorElement.textContent = 'Họ và tên phải có ít nhất 2 ký tự';
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

// Validate email
function validateEmail(value, showError) {
    const errorElement = document.getElementById('emailError');
    const input = document.getElementById('registerEmail');
    const inputWrapper = input.closest('.input-wrapper-modern');
    const successIcon = inputWrapper.querySelector('.input-success-icon');
    const errorIcon = inputWrapper.querySelector('.input-error-icon');
    
    inputWrapper.classList.remove('valid', 'invalid');
    if (successIcon) successIcon.style.display = 'none';
    if (errorIcon) errorIcon.style.display = 'none';
    
    if (!value.trim()) {
        if (showError) {
            errorElement.textContent = 'Vui lòng nhập email';
            inputWrapper.classList.add('invalid');
            if (errorIcon) errorIcon.style.display = 'block';
        } else {
            errorElement.textContent = '';
        }
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(value)) {
        if (showError) {
            errorElement.textContent = 'Email không hợp lệ';
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

// Validate phone
function validatePhone(value, showError) {
    const errorElement = document.getElementById('phoneError');
    const input = document.getElementById('registerPhone');
    const inputWrapper = input.closest('.input-wrapper-modern');
    const successIcon = inputWrapper.querySelector('.input-success-icon');
    const errorIcon = inputWrapper.querySelector('.input-error-icon');
    
    inputWrapper.classList.remove('valid', 'invalid');
    if (successIcon) successIcon.style.display = 'none';
    if (errorIcon) errorIcon.style.display = 'none';
    
    if (!value.trim()) {
        if (showError) {
            errorElement.textContent = 'Vui lòng nhập số điện thoại';
            inputWrapper.classList.add('invalid');
            if (errorIcon) errorIcon.style.display = 'block';
        } else {
            errorElement.textContent = '';
        }
        return false;
    }
    
    const phoneRegex = /^[0-9]{10,11}$/;
    const cleanPhone = value.replace(/\s/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
        if (showError) {
            errorElement.textContent = 'Số điện thoại phải có 10-11 chữ số';
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
    const input = document.getElementById('registerPassword');
    const inputWrapper = input.closest('.input-wrapper-modern');
    const successIcon = inputWrapper.querySelector('.input-success-icon');
    const errorIcon = inputWrapper.querySelector('.input-error-icon');
    
    inputWrapper.classList.remove('valid', 'invalid');
    if (successIcon) successIcon.style.display = 'none';
    if (errorIcon) errorIcon.style.display = 'none';
    
    if (!value) {
        if (showError) {
            errorElement.textContent = 'Vui lòng nhập mật khẩu';
            inputWrapper.classList.add('invalid');
            if (errorIcon) errorIcon.style.display = 'block';
        } else {
            errorElement.textContent = '';
        }
        return false;
    }
    
    if (value.length < 8) {
        if (showError) {
            errorElement.textContent = 'Mật khẩu phải có ít nhất 8 ký tự';
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

// Check password strength
function checkPasswordStrength(password) {
    const strengthContainer = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!password) {
        strengthContainer.style.display = 'none';
        return;
    }
    
    strengthContainer.style.display = 'block';
    
    let strength = 0;
    let strengthLabel = '';
    let strengthClass = '';
    
    // Length check
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    if (strength <= 2) {
        strengthLabel = 'Yếu';
        strengthClass = 'weak';
    } else if (strength <= 4) {
        strengthLabel = 'Trung bình';
        strengthClass = 'medium';
    } else {
        strengthLabel = 'Mạnh';
        strengthClass = 'strong';
    }
    
    strengthFill.className = 'strength-fill ' + strengthClass;
    strengthText.className = 'strength-text ' + strengthClass;
    strengthText.textContent = 'Độ mạnh mật khẩu: ' + strengthLabel;
}

// Validate confirm password
function validateConfirmPassword(value, showError) {
    const errorElement = document.getElementById('confirmPasswordError');
    const input = document.getElementById('registerConfirmPassword');
    const passwordInput = document.getElementById('registerPassword');
    const inputWrapper = input.closest('.input-wrapper-modern');
    const successIcon = inputWrapper.querySelector('.input-success-icon');
    const errorIcon = inputWrapper.querySelector('.input-error-icon');
    
    inputWrapper.classList.remove('valid', 'invalid');
    if (successIcon) successIcon.style.display = 'none';
    if (errorIcon) errorIcon.style.display = 'none';
    
    if (!value) {
        if (showError) {
            errorElement.textContent = 'Vui lòng xác nhận mật khẩu';
            inputWrapper.classList.add('invalid');
            if (errorIcon) errorIcon.style.display = 'block';
        } else {
            errorElement.textContent = '';
        }
        return false;
    }
    
    if (value !== passwordInput.value) {
        if (showError) {
            errorElement.textContent = 'Mật khẩu xác nhận không khớp';
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

// Initialize password toggles
function initializePasswordToggles() {
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('registerConfirmPassword');
    
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        if (type === 'text') {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
    
    toggleConfirmPassword.addEventListener('click', function() {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        if (type === 'text') {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
}

// Initialize password strength checker
function initializePasswordStrength() {
    // Already handled in form initialization
}

// Initialize social register
function initializeSocialRegister() {
    const googleBtn = document.querySelector('.btn-google');
    const facebookBtn = document.querySelector('.btn-facebook');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            showAlert('Đăng ký với Google đang được phát triển...', 'info');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            showAlert('Đăng ký với Facebook đang được phát triển...', 'info');
        });
    }
}

// Handle register
function handleRegister() {
    const fullName = document.getElementById('registerFullName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    const submitBtn = document.getElementById('registerSubmitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Validate all inputs
    const isFullNameValid = validateFullName(fullName, true);
    const isEmailValid = validateEmail(email, true);
    const isPhoneValid = validatePhone(phone, true);
    const isPasswordValid = validatePassword(password, true);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword, true);
    
    if (!agreeTerms) {
        showAlert('Vui lòng đồng ý với điều khoản sử dụng', 'error');
        return;
    }
    
    if (!isFullNameValid || !isEmailValid || !isPhoneValid || !isPasswordValid || !isConfirmPasswordValid) {
        showAlert('Vui lòng kiểm tra lại thông tin đăng ký', 'error');
        return;
    }
    
    // Disable button and show loading
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'flex';
    
    // Simulate API call
    setTimeout(() => {
        // Mock register logic
        const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userExists = existingUsers.find(u => u.email === email || u.phone === phone);
        
        if (userExists) {
            showAlert('Email hoặc số điện thoại đã được sử dụng', 'error');
            
            submitBtn.disabled = false;
            btnText.style.display = 'flex';
            btnLoader.style.display = 'none';
            
            // Shake animation
            const form = document.getElementById('registerForm');
            form.style.animation = 'shake 0.5s';
            setTimeout(() => {
                form.style.animation = '';
            }, 500);
        } else {
            // Success
            const newUser = {
                fullName,
                email,
                phone,
                password: '***', // In real app, this would be hashed
                createdAt: new Date().toISOString()
            };
            
            existingUsers.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
            
            showAlert('Đăng ký thành công! Đang chuyển đến trang đăng nhập...', 'success');
            
            // Redirect to login after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html?registered=true';
            }, 2000);
        }
    }, 1500);
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertElement = document.getElementById('registerAlert');
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

// Check if user is already logged in
window.addEventListener('load', function() {
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    if (token) {
        const urlParams = new URLSearchParams(window.location.search);
        const redirect = urlParams.get('redirect') || 'index.html';
        
        showAlert('Bạn đã đăng nhập. Đang chuyển hướng...', 'info');
        
        setTimeout(() => {
            window.location.href = redirect;
        }, 1000);
    }
    
    // Check if redirected from login after registration
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        showAlert('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
    }
});
