// Admin Login Page Functionality

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializePasswordToggle();
});

// Initialize login form
function initializeForm() {
    const form = document.getElementById('adminLoginForm');
    const emailInput = document.getElementById('adminEmail');
    const passwordInput = document.getElementById('adminPassword');
    
    if (!form) return;

    form.addEventListener('submit', handleAdminLogin);
    
    // Real-time validation
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmail(this.value.trim());
        });
        emailInput.addEventListener('input', function() {
            clearError('emailError');
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            validatePassword(this.value);
        });
        passwordInput.addEventListener('input', function() {
            clearError('passwordError');
        });
    }
}

// Handle admin login
function handleAdminLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const submitBtn = document.getElementById('submitBtn');
    
    // Validate inputs
    let isValid = true;
    
    if (!validateEmail(email)) {
        isValid = false;
    }
    
    if (!validatePassword(password)) {
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
    
    // Hide previous alerts
    hideAlert();
    
    // Simulate API call
    setTimeout(() => {
        // Mock admin credentials
        const mockAdmins = [
            { email: 'admin@cinemahub.vn', password: 'admin123', username: 'admin' },
            { email: 'manager@cinemahub.vn', password: 'manager123', username: 'manager' }
        ];
        
        const admin = mockAdmins.find(a => 
            (a.email === email || a.username === email) && a.password === password
        );
        
        if (admin) {
            // Login successful
            showAlert('success', 'fas fa-check-circle', 'Đăng nhập thành công! Đang chuyển hướng...');
            
            // Store admin session
            if (rememberMe) {
                localStorage.setItem('adminRememberMe', 'true');
                localStorage.setItem('adminEmail', email);
            } else {
                sessionStorage.setItem('adminLoggedIn', 'true');
                sessionStorage.setItem('adminEmail', email);
            }
            
            // Redirect to admin dashboard (not created yet, so redirect to index for now)
            setTimeout(() => {
                window.location.href = 'index.html'; // In real app: 'admin-dashboard.html'
            }, 1500);
        } else {
            // Login failed
            showAlert('error', 'fas fa-exclamation-circle', 'Email/Username hoặc mật khẩu không chính xác. Vui lòng thử lại.');
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Đăng nhập';
            
            // Clear password field
            document.getElementById('adminPassword').value = '';
        }
    }, 1500);
}

// Validate email/username
function validateEmail(email) {
    const emailError = document.getElementById('emailError');
    const emailInput = document.getElementById('adminEmail');
    
    if (!email || email.length < 3) {
        showFieldError('emailError', 'Vui lòng nhập email hoặc username hợp lệ');
        if (emailInput) {
            emailInput.classList.add('error');
        }
        return false;
    }
    
    clearError('emailError');
    if (emailInput) {
        emailInput.classList.remove('error');
    }
    return true;
}

// Validate password
function validatePassword(password) {
    const passwordError = document.getElementById('passwordError');
    const passwordInput = document.getElementById('adminPassword');
    
    if (!password || password.length < 6) {
        showFieldError('passwordError', 'Mật khẩu phải có ít nhất 6 ký tự');
        if (passwordInput) {
            passwordInput.classList.add('error');
        }
        return false;
    }
    
    clearError('passwordError');
    if (passwordInput) {
        passwordInput.classList.remove('error');
    }
    return true;
}

// Show field error
function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Clear error
function clearError(fieldId) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Show alert message
function showAlert(type, icon, message) {
    const alertMessage = document.getElementById('alertMessage');
    const alertIcon = document.getElementById('alertIcon');
    const alertText = document.getElementById('alertText');
    
    if (!alertMessage || !alertIcon || !alertText) return;
    
    // Remove previous classes
    alertMessage.classList.remove('success', 'error', 'info');
    
    // Add new class
    alertMessage.classList.add(type);
    
    // Set icon and message
    alertIcon.className = 'alert-icon ' + icon;
    alertText.textContent = message;
    
    // Show alert
    alertMessage.style.display = 'flex';
    
    // Auto-hide after 5 seconds (except for success which redirects)
    if (type !== 'success') {
        setTimeout(() => {
            hideAlert();
        }, 5000);
    }
}

// Hide alert message
function hideAlert() {
    const alertMessage = document.getElementById('alertMessage');
    if (alertMessage) {
        alertMessage.style.display = 'none';
    }
}

// Initialize password toggle
function initializePasswordToggle() {
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('adminPassword');
    const passwordIcon = document.getElementById('passwordIcon');
    
    if (!passwordToggle || !passwordInput || !passwordIcon) return;
    
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle icon
        if (type === 'password') {
            passwordIcon.classList.remove('fa-eye-slash');
            passwordIcon.classList.add('fa-eye');
        } else {
            passwordIcon.classList.remove('fa-eye');
            passwordIcon.classList.add('fa-eye-slash');
        }
    });
}

// Check if remember me is set
document.addEventListener('DOMContentLoaded', function() {
    const rememberMe = localStorage.getItem('adminRememberMe');
    const savedEmail = localStorage.getItem('adminEmail');
    
    if (rememberMe === 'true' && savedEmail) {
        const emailInput = document.getElementById('adminEmail');
        const rememberCheckbox = document.getElementById('rememberMe');
        
        if (emailInput) {
            emailInput.value = savedEmail;
        }
        
        if (rememberCheckbox) {
            rememberCheckbox.checked = true;
        }
    }
});
