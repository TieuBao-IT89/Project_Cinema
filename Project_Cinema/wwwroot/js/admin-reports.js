// Admin Reports Management Functionality

// Global variables
let allReports = [];
let filteredReports = [];
let currentPage = 1;
let itemsPerPage = 10;
let currentPeriod = 'month';
let currentReportType = 'revenue';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadReportsData();
    initializeFilters();
    displaySummaryCards();
    displayTopMovies();
    displayReports();
    initializePagination();
});

// Load reports data from mock data
function loadReportsData() {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Mock reports data
    allReports = [
        {
            id: 1,
            date: formatDateForInput(today),
            cinema: 'CinemaHub Quận 1',
            movie: 'Avengers: Endgame',
            showtimes: 12,
            tickets: 456,
            revenue: 68400000,
            occupancy: 85
        },
        {
            id: 2,
            date: formatDateForInput(today),
            cinema: 'CinemaHub Quận 3',
            movie: 'Spider-Man: No Way Home',
            showtimes: 10,
            tickets: 380,
            revenue: 57000000,
            occupancy: 76
        },
        {
            id: 3,
            date: formatDateForInput(today),
            cinema: 'CinemaHub Quận 7',
            movie: 'The Batman',
            showtimes: 15,
            tickets: 620,
            revenue: 93000000,
            occupancy: 82
        },
        {
            id: 4,
            date: formatDateForInput(yesterday),
            cinema: 'CinemaHub Quận 1',
            movie: 'Dune',
            showtimes: 8,
            tickets: 320,
            revenue: 48000000,
            occupancy: 80
        },
        {
            id: 5,
            date: formatDateForInput(yesterday),
            cinema: 'CinemaHub Quận 10',
            movie: 'Top Gun: Maverick',
            showtimes: 12,
            tickets: 540,
            revenue: 81000000,
            occupancy: 90
        },
        {
            id: 6,
            date: formatDateForInput(twoDaysAgo),
            cinema: 'CinemaHub Quận 7',
            movie: 'Doctor Strange',
            showtimes: 14,
            tickets: 580,
            revenue: 87000000,
            occupancy: 82
        },
        {
            id: 7,
            date: formatDateForInput(twoDaysAgo),
            cinema: 'CinemaHub Quận 3',
            movie: 'Black Widow',
            showtimes: 9,
            tickets: 340,
            revenue: 51000000,
            occupancy: 75
        },
        {
            id: 8,
            date: formatDateForInput(today),
            cinema: 'CinemaHub Quận 10',
            movie: 'Shang-Chi',
            showtimes: 11,
            tickets: 420,
            revenue: 63000000,
            occupancy: 76
        },
        {
            id: 9,
            date: formatDateForInput(yesterday),
            cinema: 'CinemaHub Quận 7',
            movie: 'Eternals',
            showtimes: 13,
            tickets: 500,
            revenue: 75000000,
            occupancy: 77
        },
        {
            id: 10,
            date: formatDateForInput(today),
            cinema: 'CinemaHub Quận 5',
            movie: 'Black Panther',
            showtimes: 7,
            tickets: 280,
            revenue: 42000000,
            occupancy: 80
        }
    ];

    filteredReports = [...allReports];
}

// Format date for input (YYYY-MM-DD)
function formatDateForInput(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Format date for display (DD/MM/YYYY)
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0
    }).format(amount);
}

// Format number
function formatNumber(number) {
    return new Intl.NumberFormat('vi-VN').format(number);
}

// Initialize filters
function initializeFilters() {
    const timePeriod = document.getElementById('timePeriod');
    const customDateRange = document.getElementById('customDateRange');
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    const exportBtn = document.getElementById('exportBtn');

    if (timePeriod) {
        timePeriod.addEventListener('change', function() {
            if (this.value === 'custom') {
                customDateRange.style.display = 'block';
            } else {
                customDateRange.style.display = 'none';
            }
        });
    }

    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', applyFilters);
    }

    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', resetFilters);
    }

    if (exportBtn) {
        exportBtn.addEventListener('click', exportReport);
    }
}

// Apply filters
function applyFilters() {
    const reportType = document.getElementById('reportType').value;
    const timePeriod = document.getElementById('timePeriod').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    currentReportType = reportType;
    currentPeriod = timePeriod;

    // Filter by date period
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    filteredReports = allReports.filter(report => {
        const reportDate = new Date(report.date);
        reportDate.setHours(0, 0, 0, 0);

        if (timePeriod === 'custom') {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            return reportDate >= start && reportDate <= end;
        } else if (timePeriod === 'today') {
            return reportDate.getTime() === today.getTime();
        } else if (timePeriod === 'week') {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            return reportDate >= weekStart && reportDate <= today;
        } else if (timePeriod === 'month') {
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            return reportDate >= monthStart && reportDate <= today;
        } else if (timePeriod === 'quarter') {
            const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
            return reportDate >= quarterStart && reportDate <= today;
        } else if (timePeriod === 'year') {
            const yearStart = new Date(today.getFullYear(), 0, 1);
            return reportDate >= yearStart && reportDate <= today;
        }

        return true;
    });

    // Update display
    displaySummaryCards();
    displayTopMovies();
    displayReports();
    updatePagination();

    // Show notification
    showNotification('Đã áp dụng bộ lọc thành công!', 'success');
}

// Reset filters
function resetFilters() {
    document.getElementById('reportType').value = 'revenue';
    document.getElementById('timePeriod').value = 'month';
    document.getElementById('customDateRange').style.display = 'none';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';

    currentReportType = 'revenue';
    currentPeriod = 'month';
    filteredReports = [...allReports];

    displaySummaryCards();
    displayTopMovies();
    displayReports();
    updatePagination();

    showNotification('Đã đặt lại bộ lọc!', 'success');
}

// Display summary cards
function displaySummaryCards() {
    const totalRevenue = filteredReports.reduce((sum, report) => sum + report.revenue, 0);
    const totalTickets = filteredReports.reduce((sum, report) => sum + report.tickets, 0);
    const totalMovies = new Set(filteredReports.map(r => r.movie)).size;
    const totalViews = Math.floor(totalTickets * 8.2); // Mock calculation

    const totalRevenueEl = document.getElementById('totalRevenue');
    const totalTicketsEl = document.getElementById('totalTickets');
    const totalMoviesEl = document.getElementById('totalMovies');
    const totalViewsEl = document.getElementById('totalViews');

    if (totalRevenueEl) {
        totalRevenueEl.textContent = formatCurrency(totalRevenue);
    }
    if (totalTicketsEl) {
        totalTicketsEl.textContent = formatNumber(totalTickets);
    }
    if (totalMoviesEl) {
        totalMoviesEl.textContent = totalMovies;
    }
    if (totalViewsEl) {
        totalViewsEl.textContent = formatNumber(totalViews);
    }
}

// Display top movies
function displayTopMovies() {
    const tbody = document.getElementById('topMoviesTableBody');
    if (!tbody) return;

    // Calculate movie stats
    const movieStats = {};
    filteredReports.forEach(report => {
        if (!movieStats[report.movie]) {
            movieStats[report.movie] = {
                name: report.movie,
                tickets: 0,
                revenue: 0,
                showtimes: 0
            };
        }
        movieStats[report.movie].tickets += report.tickets;
        movieStats[report.movie].revenue += report.revenue;
        movieStats[report.movie].showtimes += report.showtimes;
    });

    // Sort by revenue
    const topMovies = Object.values(movieStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

    tbody.innerHTML = topMovies.map((movie, index) => {
        const rank = index + 1;
        const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : 'other';
        const occupancy = movie.tickets / (movie.showtimes * 80) * 100; // Mock: 80 seats per showtime

        return `
            <tr>
                <td style="text-align: center;">
                    <span class="rank-badge ${rankClass}">${rank}</span>
                </td>
                <td>
                    <img src="https://via.placeholder.com/70x100?text=${encodeURIComponent(movie.name.substring(0, 10))}" 
                         alt="${movie.name}" 
                         class="movie-poster"
                         onerror="this.src='https://via.placeholder.com/70x100'">
                </td>
                <td>
                    <div class="movie-name">${movie.name}</div>
                </td>
                <td style="text-align: right;">${formatNumber(movie.tickets)}</td>
                <td style="text-align: right;">${formatCurrency(movie.revenue)}</td>
                <td>
                    <div class="occupancy-bar">
                        <div class="occupancy-fill ${occupancy >= 80 ? 'high' : occupancy >= 60 ? 'medium' : 'low'}" 
                             style="width: ${occupancy}%"></div>
                    </div>
                    <span class="occupancy-text">${occupancy.toFixed(1)}%</span>
                </td>
            </tr>
        `;
    }).join('');
}

// Display reports
function displayReports() {
    const tbody = document.getElementById('reportsTableBody');
    if (!tbody) return;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const reportsToShow = filteredReports.slice(startIndex, endIndex);

    tbody.innerHTML = reportsToShow.map(report => {
        const occupancyClass = report.occupancy >= 80 ? 'high' : report.occupancy >= 60 ? 'medium' : 'low';

        return `
            <tr>
                <td>${formatDate(report.date)}</td>
                <td>${report.cinema}</td>
                <td>${report.movie}</td>
                <td class="text-right">${formatNumber(report.showtimes)}</td>
                <td class="text-right">${formatNumber(report.tickets)}</td>
                <td class="text-right">${formatCurrency(report.revenue)}</td>
                <td>
                    <div class="occupancy-bar">
                        <div class="occupancy-fill ${occupancyClass}" 
                             style="width: ${report.occupancy}%"></div>
                    </div>
                    <span class="occupancy-text">${report.occupancy}%</span>
                </td>
            </tr>
        `;
    }).join('');

    // Show empty state if no reports
    if (filteredReports.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: rgba(255, 255, 255, 0.5);">
                    <i class="fas fa-chart-bar" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                    <p>Không có dữ liệu báo cáo cho khoảng thời gian đã chọn.</p>
                </td>
            </tr>
        `;
    }
}

// Initialize pagination
function initializePagination() {
    updatePagination();
}

// Update pagination
function updatePagination() {
    const paginationWrapper = document.getElementById('paginationWrapper');
    const pagination = document.getElementById('pagination');

    if (!pagination) return;

    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

    if (totalPages <= 1) {
        if (paginationWrapper) {
            paginationWrapper.style.display = 'none';
        }
        pagination.innerHTML = '';
        return;
    }

    if (paginationWrapper) {
        paginationWrapper.style.display = 'flex';
    }

    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i> Trước
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `<span class="page-number ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</span>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += `<span class="page-number" style="pointer-events: none; opacity: 0.5;">...</span>`;
        }
    }

    // Next button
    paginationHTML += `
        <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">
            Sau <i class="fas fa-chevron-right"></i>
        </button>
    `;

    pagination.innerHTML = paginationHTML;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    displayReports();
    updatePagination();

    // Scroll to top of table
    const tableWrapper = document.querySelector('.reports-table-wrapper');
    if (tableWrapper) {
        tableWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Export report
function exportReport() {
    const reportType = document.getElementById('reportType').value;
    const timePeriod = document.getElementById('timePeriod').value;

    // Simulate export
    showNotification('Đang xuất báo cáo...', 'info');

    setTimeout(() => {
        showNotification(`Đã xuất báo cáo ${reportType} (${timePeriod}) thành công!`, 'success');
        // In a real application, this would download a file (PDF, Excel, etc.)
    }, 1500);
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(76, 175, 80, 0.9)' : type === 'error' ? 'rgba(244, 67, 54, 0.9)' : 'rgba(33, 150, 243, 0.9)'};
        color: #ffffff;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);
