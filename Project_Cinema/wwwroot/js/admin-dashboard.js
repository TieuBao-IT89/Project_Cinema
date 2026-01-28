// Admin Dashboard Functionality

// Mock data
const dashboardData = {
    statistics: {
        totalMovies: 145,
        totalTickets: 12458,
        totalRevenue: 2450000000,
        totalUsers: 8923
    },
    topMovies: [
        { id: 1, name: 'Avengers: Endgame', tickets: 2450, revenue: 485000000 },
        { id: 2, name: 'Spider-Man: No Way Home', tickets: 1890, revenue: 375000000 },
        { id: 3, name: 'Black Panther: Wakanda Forever', tickets: 1650, revenue: 328000000 },
        { id: 4, name: 'Avatar: The Way of Water', tickets: 1520, revenue: 302000000 },
        { id: 5, name: 'The Matrix Resurrections', tickets: 1280, revenue: 254000000 }
    ],
    recentActivities: [
        {
            id: 1,
            type: 'booking',
            title: 'Đơn đặt vé mới',
            details: 'Avengers: Endgame - 4 vé - CGV Vincom Center',
            time: '2 phút trước',
            customer: 'Nguyễn Văn A'
        },
        {
            id: 2,
            type: 'payment',
            title: 'Thanh toán thành công',
            details: 'Spider-Man: No Way Home - 2.450.000 đ',
            time: '15 phút trước',
            customer: 'Trần Thị B'
        },
        {
            id: 3,
            type: 'user',
            title: 'Người dùng mới đăng ký',
            details: 'Email: user@example.com',
            time: '32 phút trước',
            customer: 'Lê Văn C'
        },
        {
            id: 4,
            type: 'booking',
            title: 'Đơn đặt vé mới',
            details: 'Black Panther - 6 vé - CGV Landmark',
            time: '1 giờ trước',
            customer: 'Phạm Thị D'
        },
        {
            id: 5,
            type: 'cancellation',
            title: 'Đơn đặt vé đã hủy',
            details: 'Avatar: The Way of Water - 2 vé',
            time: '2 giờ trước',
            customer: 'Hoàng Văn E'
        },
        {
            id: 6,
            type: 'payment',
            title: 'Thanh toán thành công',
            details: 'The Matrix Resurrections - 1.280.000 đ',
            time: '3 giờ trước',
            customer: 'Vũ Thị F'
        }
    ],
    notifications: [
        {
            id: 1,
            text: 'Hệ thống đã được cập nhật thành công',
            time: '5 phút trước'
        },
        {
            id: 2,
            text: 'Có 15 đơn đặt vé mới trong 1 giờ qua',
            time: '1 giờ trước'
        },
        {
            id: 3,
            text: 'Cảnh báo: Rạp CGV Landmark sắp hết ghế cho suất 20:00',
            time: '2 giờ trước'
        }
    ]
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    initializeNotifications();
    loadStatistics();
    loadTopMovies();
    loadRecentActivities();
});

// Initialize sidebar toggle
function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.admin-sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
}

// Initialize notifications
function initializeNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const closeNotifications = document.getElementById('closeNotifications');

    if (notificationBtn && notificationDropdown) {
        notificationBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            notificationDropdown.style.display = 
                notificationDropdown.style.display === 'none' ? 'block' : 'none';
        });

        if (closeNotifications) {
            closeNotifications.addEventListener('click', function() {
                notificationDropdown.style.display = 'none';
            });
        }

        // Close when clicking outside
        document.addEventListener('click', function(e) {
            if (!notificationBtn.contains(e.target) && !notificationDropdown.contains(e.target)) {
                notificationDropdown.style.display = 'none';
            }
        });
    }

    displayNotifications();
}

// Display notifications
function displayNotifications() {
    const notificationsList = document.getElementById('notificationsList');
    if (!notificationsList) return;

    if (dashboardData.notifications.length === 0) {
        notificationsList.innerHTML = '<div style="padding: 20px; text-align: center; color: rgba(255,255,255,0.5);">Không có thông báo mới</div>';
        return;
    }

    notificationsList.innerHTML = dashboardData.notifications.map(notif => `
        <div class="notification-item">
            <div class="notification-text">${notif.text}</div>
            <div class="notification-time">${notif.time}</div>
        </div>
    `).join('');
}

// Load statistics with animation
function loadStatistics() {
    const stats = dashboardData.statistics;
    
    animateValue('totalMovies', 0, stats.totalMovies, 1000);
    animateValue('totalTickets', 0, stats.totalTickets, 1500);
    animateValue('totalRevenue', 0, stats.totalRevenue, 2000, true);
    animateValue('totalUsers', 0, stats.totalUsers, 1800);
}

// Animate value
function animateValue(id, start, end, duration, isCurrency = false) {
    const element = document.getElementById(id);
    if (!element) return;

    const startTime = Date.now();
    const startValue = start;
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(startValue + (end - startValue) * easeOut);
        
        if (isCurrency) {
            element.textContent = formatCurrency(current);
        } else {
            element.textContent = formatNumber(current);
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            if (isCurrency) {
                element.textContent = formatCurrency(end);
            } else {
                element.textContent = formatNumber(end);
            }
        }
    }
    
    update();
}

// Format number
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Format currency
function formatCurrency(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
}

// Load top movies
function loadTopMovies() {
    const topMoviesList = document.getElementById('topMoviesList');
    if (!topMoviesList) return;

    topMoviesList.innerHTML = dashboardData.topMovies.map((movie, index) => `
        <div class="top-movie-item">
            <div class="movie-rank">${index + 1}</div>
            <div class="movie-info">
                <div class="movie-name">${movie.name}</div>
                <div class="movie-stats">
                    <span><i class="fas fa-ticket-alt"></i> ${formatNumber(movie.tickets)} vé</span>
                    <span>•</span>
                    <span><i class="fas fa-dollar-sign"></i> ${formatCurrency(movie.revenue)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Load recent activities
function loadRecentActivities() {
    const activitiesList = document.getElementById('activitiesList');
    if (!activitiesList) return;

    const activityIcons = {
        'booking': 'fas fa-ticket-alt',
        'payment': 'fas fa-check-circle',
        'user': 'fas fa-user-plus',
        'cancellation': 'fas fa-times-circle'
    };

    const activityStyles = {
        'booking': { bg: 'rgba(229, 9, 20, 0.15)', color: '#e50914' },
        'payment': { bg: 'rgba(76, 175, 80, 0.15)', color: '#4caf50' },
        'user': { bg: 'rgba(33, 150, 243, 0.15)', color: '#2196f3' },
        'cancellation': { bg: 'rgba(244, 67, 54, 0.15)', color: '#f44336' }
    };

    activitiesList.innerHTML = dashboardData.recentActivities.map(activity => {
        const style = activityStyles[activity.type] || activityStyles.booking;
        return `
            <div class="activity-item">
                <div class="activity-icon" style="background: ${style.bg}; color: ${style.color}">
                    <i class="${activityIcons[activity.type]}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-details">
                        <span>${activity.details}</span>
                        <span>•</span>
                        <span><i class="fas fa-user"></i> ${activity.customer}</span>
                    </div>
                </div>
                <div class="activity-time">${activity.time}</div>
            </div>
        `;
    }).join('');
}
