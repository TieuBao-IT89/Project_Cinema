// Profile Page Functionality

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
    initializeTabs();
    initializeForms();
    initializeAvatarEdit();
    loadBookingHistory();
});

// Initialize profile
function initializeProfile() {
    // Load user data from localStorage/sessionStorage
    const userName = localStorage.getItem('userName') || sessionStorage.getItem('userName');
    const userIdentifier = localStorage.getItem('userIdentifier') || sessionStorage.getItem('userIdentifier');
    
    if (userName) {
        document.getElementById('profileName').textContent = userName;
    }
    
    if (userIdentifier) {
        document.getElementById('profileEmail').textContent = userIdentifier;
        document.getElementById('email').value = userIdentifier;
        
        // Update avatar
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=e50914&color=fff&size=200`;
        document.getElementById('profileAvatar').src = avatarUrl;
    }
    
    // Check if user is logged in
    // Uncomment below to enable login check and redirect
    /*
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    if (!token) {
        // Redirect to login if not logged in
        window.location.href = 'login.html?redirect=profile.html';
    }
    */
}

// Initialize tabs
function initializeTabs() {
    const navItems = document.querySelectorAll('.nav-item');
    const tabs = document.querySelectorAll('.profile-tab');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetTab = this.dataset.tab;
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab
            tabs.forEach(tab => tab.classList.remove('active'));
            document.getElementById(targetTab + '-tab').classList.add('active');
        });
    });
}

// Initialize forms
function initializeForms() {
    // Personal Info Form
    const personalInfoForm = document.getElementById('personalInfoForm');
    if (personalInfoForm) {
        personalInfoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePersonalInfoSave();
        });
    }
    
    // Security Form
    const securityForm = document.getElementById('securityForm');
    if (securityForm) {
        securityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePasswordChange();
        });
    }
    
    // Notifications Form
    const notificationsForm = document.getElementById('notificationsForm');
    if (notificationsForm) {
        notificationsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNotificationsSave();
        });
    }
    
    // Password toggle buttons
    const passwordToggleBtns = document.querySelectorAll('.password-toggle-btn');
    passwordToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.dataset.target;
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Cancel button
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            // Reset form (in real app, reload from server)
            location.reload();
        });
    }
}

// Handle personal info save
function handlePersonalInfoSave() {
    const saveBtn = document.getElementById('saveBtn');
    const btnText = saveBtn.querySelector('.btn-text');
    
    // Disable button
    saveBtn.disabled = true;
    btnText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
    
    // Simulate API call
    setTimeout(() => {
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const fullName = firstName + ' ' + lastName;
        
        // Update display
        document.getElementById('profileName').textContent = fullName;
        
        // Update avatar
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=e50914&color=fff&size=200`;
        document.getElementById('profileAvatar').src = avatarUrl;
        
        // Show success message
        showAlert('Đã cập nhật thông tin thành công!', 'success');
        
        // Re-enable button
        saveBtn.disabled = false;
        btnText.innerHTML = '<i class="fas fa-save"></i> Lưu thay đổi';
    }, 1500);
}

// Handle password change
function handlePasswordChange() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (newPassword.length < 8) {
        showAlert('Mật khẩu mới phải có ít nhất 8 ký tự', 'error');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        showAlert('Mật khẩu xác nhận không khớp', 'error');
        return;
    }
    
    // Simulate API call
    setTimeout(() => {
        showAlert('Đã đổi mật khẩu thành công!', 'success');
        
        // Clear form
        document.getElementById('securityForm').reset();
    }, 1500);
}

// Handle notifications save
function handleNotificationsSave() {
    // Simulate API call
    setTimeout(() => {
        showAlert('Đã lưu cài đặt thông báo!', 'success');
    }, 1000);
}

// Initialize avatar edit
function initializeAvatarEdit() {
    const avatarEditBtn = document.getElementById('avatarEditBtn');
    if (avatarEditBtn) {
        avatarEditBtn.addEventListener('click', function() {
            // In real app, this would open a file picker
            alert('Tính năng đổi ảnh đại diện đang được phát triển');
            // const input = document.createElement('input');
            // input.type = 'file';
            // input.accept = 'image/*';
            // input.click();
        });
    }
}

// Load booking history
function loadBookingHistory() {
    const bookingHistoryList = document.getElementById('bookingHistoryList');
    if (!bookingHistoryList) return;
    
    // Mock booking data
    const mockBookings = [
        {
            movie: 'Avengers: Endgame',
            cinema: 'CGV Vincom Center',
            room: 'Phòng 5',
            date: 'Thứ 2, 15/01/2024',
            time: '19:00',
            seats: ['A5', 'A6'],
            price: '300.000đ',
            status: 'completed',
            bookingCode: 'CTMH20240115001'
        },
        {
            movie: 'Spider-Man: No Way Home',
            cinema: 'CGV Landmark 81',
            room: 'Phòng 3',
            date: 'Thứ 6, 19/01/2024',
            time: '21:30',
            seats: ['B10', 'B11', 'B12'],
            price: '450.000đ',
            status: 'upcoming',
            bookingCode: 'CTMH20240119002'
        }
    ];
    
    if (mockBookings.length === 0) {
        bookingHistoryList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">
                    <i class="fas fa-ticket-alt"></i>
                </div>
                <h3 class="empty-state-title">Chưa có vé nào</h3>
                <p class="empty-state-text">Bạn chưa có lịch sử đặt vé nào. Hãy đặt vé để xem phim tuyệt vời!</p>
                <a href="movies.html" class="btn btn-primary">
                    <i class="fas fa-film"></i> Xem phim ngay
                </a>
            </div>
        `;
        return;
    }
    
    bookingHistoryList.innerHTML = mockBookings.map(booking => `
        <div class="booking-item">
            <div class="booking-header">
                <h3 class="booking-title">${booking.movie}</h3>
                <span class="booking-status ${booking.status}">
                    ${booking.status === 'completed' ? 'Đã xem' : booking.status === 'upcoming' ? 'Sắp chiếu' : 'Đã hủy'}
                </span>
            </div>
            <div class="booking-details">
                <div class="booking-detail-item">
                    <i class="fas fa-building"></i>
                    <div>
                        <div class="booking-detail-label">Rạp chiếu</div>
                        <div class="booking-detail-value">${booking.cinema} - ${booking.room}</div>
                    </div>
                </div>
                <div class="booking-detail-item">
                    <i class="fas fa-calendar"></i>
                    <div>
                        <div class="booking-detail-label">Ngày & Giờ</div>
                        <div class="booking-detail-value">${booking.date}, ${booking.time}</div>
                    </div>
                </div>
                <div class="booking-detail-item">
                    <i class="fas fa-chair"></i>
                    <div>
                        <div class="booking-detail-label">Ghế</div>
                        <div class="booking-detail-value">
                            <div class="booking-seats">
                                ${booking.seats.map(seat => `<span class="seat-tag">${seat}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="booking-detail-item">
                    <i class="fas fa-barcode"></i>
                    <div>
                        <div class="booking-detail-label">Mã đặt vé</div>
                        <div class="booking-detail-value">${booking.bookingCode}</div>
                    </div>
                </div>
            </div>
            <div class="booking-footer">
                <div class="booking-price">${booking.price}</div>
                <div class="booking-actions">
                    <button class="btn-view-details" onclick="viewBookingDetails('${booking.bookingCode}')">
                        <i class="fas fa-eye"></i> Chi tiết
                    </button>
                    <button class="btn-download" onclick="downloadTicket('${booking.bookingCode}')">
                        <i class="fas fa-download"></i> Tải vé
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// View booking details
function viewBookingDetails(bookingCode) {
    // In real app, this would open a modal or navigate to details page
    alert(`Xem chi tiết đặt vé: ${bookingCode}`);
    // window.location.href = `booking-details.html?code=${bookingCode}`;
}

// Download ticket
function downloadTicket(bookingCode) {
    // Simulate download
    showAlert('Đang tải vé...', 'info');
    
    setTimeout(() => {
        showAlert('Đã tải vé thành công!', 'success');
    }, 1500);
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertElement = document.getElementById('profileAlert');
    const alertIcon = alertElement.querySelector('.alert-icon');
    const alertText = alertElement.querySelector('.alert-text');
    
    alertElement.className = 'alert-message';
    alertElement.classList.add(type);
    
    alertText.textContent = message;
    
    alertElement.style.display = 'flex';
    
    // Auto hide after 5 seconds (except for success)
    if (type !== 'success') {
        setTimeout(() => {
            alertElement.style.display = 'none';
        }, 5000);
    }
}
