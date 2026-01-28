// Contact Page Functionality

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializeFAQ();
    initializeCharCount();
});

// Initialize contact form
function initializeForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!form) return;

    form.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearError);
    });
    
    const checkbox = document.getElementById('agreeTerms');
    if (checkbox) {
        checkbox.addEventListener('change', clearError);
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // Validate all fields
    const isValid = validateForm();
    
    if (!isValid) {
        return;
    }
    
    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value.trim(),
        agreeTerms: document.getElementById('agreeTerms').checked
    };
    
    // Disable submit button
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
    }
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        resetCharCount();
        
        // Re-enable submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Gửi tin nhắn';
        }
        
        // Scroll to success message
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, 1500);
}

// Validate form
function validateForm() {
    let isValid = true;
    
    // Validate full name
    const fullName = document.getElementById('fullName');
    if (!fullName || !validateFullName(fullName.value.trim())) {
        showError('fullName', 'Vui lòng nhập họ và tên hợp lệ (ít nhất 2 ký tự)');
        isValid = false;
    }
    
    // Validate email
    const email = document.getElementById('email');
    if (!email || !validateEmail(email.value.trim())) {
        showError('email', 'Vui lòng nhập email hợp lệ');
        isValid = false;
    }
    
    // Validate phone
    const phone = document.getElementById('phone');
    if (!phone || !validatePhone(phone.value.trim())) {
        showError('phone', 'Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số)');
        isValid = false;
    }
    
    // Validate subject
    const subject = document.getElementById('subject');
    if (!subject || !subject.value) {
        showError('subject', 'Vui lòng chọn chủ đề');
        isValid = false;
    }
    
    // Validate message
    const message = document.getElementById('message');
    if (!message || !validateMessage(message.value.trim())) {
        showError('message', 'Vui lòng nhập nội dung tin nhắn (ít nhất 10 ký tự)');
        isValid = false;
    }
    
    // Validate terms
    const agreeTerms = document.getElementById('agreeTerms');
    if (!agreeTerms || !agreeTerms.checked) {
        showError('agreeTerms', 'Vui lòng đồng ý với điều khoản sử dụng');
        isValid = false;
    }
    
    return isValid;
}

// Validate individual field
function validateField(e) {
    const field = e.target;
    const fieldName = field.id;
    const value = field.value.trim();
    
    let isValid = false;
    
    switch (fieldName) {
        case 'fullName':
            isValid = validateFullName(value);
            if (!isValid) {
                showError(fieldName, 'Vui lòng nhập họ và tên hợp lệ (ít nhất 2 ký tự)');
            }
            break;
        case 'email':
            isValid = validateEmail(value);
            if (!isValid) {
                showError(fieldName, 'Vui lòng nhập email hợp lệ');
            }
            break;
        case 'phone':
            isValid = validatePhone(value);
            if (!isValid) {
                showError(fieldName, 'Vui lòng nhập số điện thoại hợp lệ (10-11 chữ số)');
            }
            break;
        case 'subject':
            isValid = value !== '';
            if (!isValid) {
                showError(fieldName, 'Vui lòng chọn chủ đề');
            }
            break;
        case 'message':
            isValid = validateMessage(value);
            if (!isValid) {
                showError(fieldName, 'Vui lòng nhập nội dung tin nhắn (ít nhất 10 ký tự)');
            }
            break;
    }
    
    if (isValid) {
        clearError(field);
        showSuccess(field);
    }
}

// Validation functions
function validateFullName(name) {
    return name.length >= 2 && /^[a-zA-ZÀ-ỹ\s]+$/.test(name);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[0-9]{10,11}$/;
    const cleanedPhone = phone.replace(/\s/g, '');
    return phoneRegex.test(cleanedPhone);
}

function validateMessage(message) {
    return message.length >= 10 && message.length <= 1000;
}

// Show error
function showError(fieldName, message) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + 'Error');
    
    if (field) {
        field.classList.add('error');
        field.classList.remove('success');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// Clear error
function clearError(e) {
    const field = e.target || e;
    const fieldName = field.id;
    const errorElement = document.getElementById(fieldName + 'Error');
    
    if (field) {
        field.classList.remove('error');
    }
    
    if (errorElement) {
        errorElement.classList.remove('show');
        errorElement.textContent = '';
    }
}

// Show success
function showSuccess(field) {
    if (field) {
        field.classList.add('success');
        field.classList.remove('error');
    }
}

// Initialize character count
function initializeCharCount() {
    const messageField = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    if (!messageField || !charCount) return;
    
    messageField.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = length;
        
        if (length > 1000) {
            charCount.style.color = '#e53935';
        } else if (length > 800) {
            charCount.style.color = '#ff9800';
        } else {
            charCount.style.color = '#6c757d';
        }
    });
}

// Reset character count
function resetCharCount() {
    const charCount = document.getElementById('charCount');
    if (charCount) {
        charCount.textContent = '0';
        charCount.style.color = '#6c757d';
    }
}

// Show success message
function showSuccessMessage() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    if (form) {
        form.style.display = 'none';
    }
    
    if (successMessage) {
        successMessage.style.display = 'block';
    }
}

// Initialize FAQ
function initializeFAQ() {
    // Mock FAQ data
    const faqData = [
        {
            question: 'Làm thế nào để đặt vé xem phim?',
            answer: 'Bạn có thể đặt vé trực tuyến trên website CinemaHub bằng cách: 1) Chọn phim muốn xem, 2) Chọn rạp chiếu và suất chiếu, 3) Chọn ghế ngồi, 4) Nhập thông tin và thanh toán. Hoặc bạn có thể gọi hotline 1900 1234 để được hỗ trợ đặt vé.'
        },
        {
            question: 'Tôi có thể đổi hoặc hủy vé đã đặt không?',
            answer: 'Có, bạn có thể đổi hoặc hủy vé trước giờ chiếu ít nhất 2 giờ. Vé sẽ được hoàn tiền vào tài khoản hoặc thẻ thanh toán trong vòng 3-5 ngày làm việc. Vui lòng liên hệ hotline 1900 1234 hoặc email support@cinemahub.vn để được hỗ trợ.'
        },
        {
            question: 'Các phương thức thanh toán nào được chấp nhận?',
            answer: 'CinemaHub chấp nhận các phương thức thanh toán: Thẻ tín dụng/ghi nợ (Visa, Mastercard), Ví điện tử (MoMo, ZaloPay, VNPay), Thẻ ATM nội địa, và Thanh toán tại quầy.'
        },
        {
            question: 'Làm sao để nhận vé sau khi đặt?',
            answer: 'Sau khi đặt vé thành công, bạn sẽ nhận được email xác nhận kèm mã đặt vé (booking code). Bạn có thể sử dụng mã này để lấy vé tại quầy rạp hoặc quét mã QR tại cổng vào. Bạn cũng có thể xem vé trong mục "Lịch sử đặt vé" trên website.'
        },
        {
            question: 'Tôi quên mật khẩu tài khoản, làm sao để lấy lại?',
            answer: 'Bạn có thể khôi phục mật khẩu bằng cách: 1) Vào trang "Quên mật khẩu", 2) Nhập email hoặc số điện thoại đã đăng ký, 3) Kiểm tra email để nhận link đặt lại mật khẩu. Nếu gặp vấn đề, vui lòng liên hệ hotline 1900 1234.'
        },
        {
            question: 'Có chương trình khuyến mãi nào không?',
            answer: 'CinemaHub thường xuyên có các chương trình khuyến mãi như: Giảm giá cho thành viên, Combo vé + bắp nước, Ngày đặc biệt (Thứ 3, Thứ 4), và các ưu đãi theo sự kiện. Vui lòng theo dõi trang "Khuyến mãi" hoặc đăng ký nhận thông báo để không bỏ lỡ các ưu đãi.'
        },
        {
            question: 'Rạp chiếu có chỗ đậu xe không?',
            answer: 'Hầu hết các rạp chiếu của CinemaHub đều có bãi đậu xe miễn phí hoặc có phí tùy theo từng rạp. Vui lòng kiểm tra thông tin chi tiết của từng rạp trên trang "Rạp chiếu" hoặc liên hệ hotline để biết thêm thông tin.'
        },
        {
            question: 'Tôi có thể đặt vé cho nhiều người cùng lúc không?',
            answer: 'Có, bạn có thể đặt vé cho nhiều người trong một lần đặt. Khi chọn ghế, bạn có thể chọn nhiều ghế liền kề hoặc rời nhau. Tối đa có thể đặt 10 vé trong một lần đặt.'
        }
    ];
    
    displayFAQ(faqData);
}

// Display FAQ
function displayFAQ(faqData) {
    const faqList = document.getElementById('faqList');
    if (!faqList) return;
    
    faqList.innerHTML = faqData.map((faq, index) => `
        <div class="faq-item" data-index="${index}">
            <div class="faq-question" onclick="toggleFAQ(${index})">
                <div class="faq-question-text">
                    <i class="fas fa-question-circle"></i>
                    <span>${faq.question}</span>
                </div>
                <div class="faq-toggle">
                    <i class="fas fa-chevron-down"></i>
                </div>
            </div>
            <div class="faq-answer">
                <div class="faq-answer-content">
                    ${faq.answer}
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle FAQ item
function toggleFAQ(index) {
    const faqItem = document.querySelector(`.faq-item[data-index="${index}"]`);
    if (!faqItem) return;
    
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}
