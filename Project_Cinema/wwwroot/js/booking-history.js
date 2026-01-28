// Booking History Page Functionality

// Global variables
let allBookings = [];
let filteredBookings = [];
let currentPage = 1;
const itemsPerPage = 5;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadBookings();
    initializeFilters();
    initializePagination();
});

// Load bookings from mock data or localStorage/sessionStorage
function loadBookings() {
    // Mock booking data - In real app, this would come from API
    allBookings = [
        {
            id: 1,
            movie: 'Avengers: Endgame',
            cinema: 'CGV Vincom Center',
            room: 'Phòng 5',
            date: '15/01/2024',
            time: '19:00',
            seats: ['A5', 'A6'],
            price: '300.000đ',
            status: 'completed',
            bookingCode: 'CTMH20240115001',
            format: 'IMAX',
            bookingDate: '2024-01-10'
        },
        {
            id: 2,
            movie: 'Spider-Man: No Way Home',
            cinema: 'CGV Landmark 81',
            room: 'Phòng 3',
            date: '19/01/2024',
            time: '21:30',
            seats: ['B10', 'B11', 'B12'],
            price: '450.000đ',
            status: 'upcoming',
            bookingCode: 'CTMH20240119002',
            format: '2D',
            bookingDate: '2024-01-15'
        },
        {
            id: 3,
            movie: 'Dune',
            cinema: 'Lotte Cinema Đà Nẵng',
            room: 'Phòng 1',
            date: '25/01/2024',
            time: '14:00',
            seats: ['C8', 'C9'],
            price: '280.000đ',
            status: 'upcoming',
            bookingCode: 'CTMH20240125003',
            format: '3D',
            bookingDate: '2024-01-20'
        },
        {
            id: 4,
            movie: 'The Matrix Resurrections',
            cinema: 'Galaxy Cinema Nguyễn Du',
            room: 'Phòng 7',
            date: '05/01/2024',
            time: '16:30',
            seats: ['D15'],
            price: '150.000đ',
            status: 'completed',
            bookingCode: 'CTMH20240105004',
            format: '2D',
            bookingDate: '2024-01-02'
        },
        {
            id: 5,
            movie: 'No Time to Die',
            cinema: 'BHD Star Cineplex',
            room: 'Phòng 2',
            date: '12/01/2024',
            time: '19:00',
            seats: ['E12', 'E13'],
            price: '320.000đ',
            status: 'cancelled',
            bookingCode: 'CTMH20240112005',
            format: '2D',
            bookingDate: '2024-01-08'
        },
        {
            id: 6,
            movie: 'Inception',
            cinema: 'CGV Vincom Center',
            room: 'Phòng 4',
            date: '30/01/2024',
            time: '20:00',
            seats: ['F5', 'F6', 'F7'],
            price: '510.000đ',
            status: 'upcoming',
            bookingCode: 'CTMH20240130006',
            format: 'IMAX',
            bookingDate: '2024-01-25'
        },
        {
            id: 7,
            movie: 'Interstellar',
            cinema: 'CGV Landmark 81',
            room: 'Phòng 6',
            date: '08/01/2024',
            time: '17:30',
            seats: ['G10', 'G11'],
            price: '360.000đ',
            status: 'completed',
            bookingCode: 'CTMH20240108007',
            format: '3D',
            bookingDate: '2024-01-05'
        },
        {
            id: 8,
            movie: 'Black Panther',
            cinema: 'Lotte Cinema Đà Nẵng',
            room: 'Phòng 8',
            date: '02/02/2024',
            time: '18:00',
            seats: ['H8', 'H9'],
            price: '290.000đ',
            status: 'upcoming',
            bookingCode: 'CTMH20240202008',
            format: '2D',
            bookingDate: '2024-01-28'
        }
    ];

    // Try to load from localStorage/sessionStorage if available
    const savedBookings = localStorage.getItem('bookingHistory') || sessionStorage.getItem('bookingHistory');
    if (savedBookings) {
        try {
            const parsed = JSON.parse(savedBookings);
            if (Array.isArray(parsed) && parsed.length > 0) {
                allBookings = parsed;
            }
        } catch (e) {
            console.error('Error loading booking history:', e);
        }
    }

    filteredBookings = [...allBookings];
    displayBookings();
    updatePagination();
}

// Initialize filters
function initializeFilters() {
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('date-filter');
    const searchInput = document.getElementById('search-input');
    const resetBtn = document.getElementById('resetFilterBtn');

    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }

    if (dateFilter) {
        dateFilter.addEventListener('change', applyFilters);
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }
}

// Apply filters
function applyFilters() {
    const statusFilter = document.getElementById('status-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    filteredBookings = allBookings.filter(booking => {
        // Status filter
        if (statusFilter !== 'all' && booking.status !== statusFilter) {
            return false;
        }

        // Date filter
        if (dateFilter !== 'all') {
            const bookingDate = new Date(booking.bookingDate);
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            
            switch (dateFilter) {
                case 'this-week':
                    const weekAgo = new Date(today);
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    if (bookingDate < weekAgo) return false;
                    break;
                case 'this-month':
                    if (bookingDate.getMonth() !== now.getMonth() || bookingDate.getFullYear() !== now.getFullYear()) {
                        return false;
                    }
                    break;
                case 'last-month':
                    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
                    if (bookingDate.getMonth() !== lastMonth.getMonth() || bookingDate.getFullYear() !== lastMonth.getFullYear()) {
                        return false;
                    }
                    break;
                case 'last-3months':
                    const threeMonthsAgo = new Date(today);
                    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                    if (bookingDate < threeMonthsAgo) return false;
                    break;
            }
        }

        // Search filter
        if (searchInput) {
            const searchText = searchInput;
            if (!booking.movie.toLowerCase().includes(searchText) && 
                !booking.bookingCode.toLowerCase().includes(searchText) &&
                !booking.cinema.toLowerCase().includes(searchText)) {
                return false;
            }
        }

        return true;
    });

    currentPage = 1;
    displayBookings();
    updatePagination();
}

// Reset filters
function resetFilters() {
    document.getElementById('status-filter').value = 'all';
    document.getElementById('date-filter').value = 'all';
    document.getElementById('search-input').value = '';
    
    filteredBookings = [...allBookings];
    currentPage = 1;
    displayBookings();
    updatePagination();
}

// Display bookings
function displayBookings() {
    const bookingList = document.getElementById('bookingHistoryList');
    const emptyState = document.getElementById('emptyState');
    
    if (!bookingList) return;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const bookingsToShow = filteredBookings.slice(startIndex, endIndex);

    if (filteredBookings.length === 0) {
        bookingList.innerHTML = '';
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }

    if (emptyState) {
        emptyState.style.display = 'none';
    }

    bookingList.innerHTML = bookingsToShow.map(booking => `
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
                    <i class="fas fa-film"></i>
                    <div>
                        <div class="booking-detail-label">Định dạng</div>
                        <div class="booking-detail-value">${booking.format}</div>
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
                    ${booking.status !== 'cancelled' ? `
                        <button class="btn-download" onclick="downloadTicket('${booking.bookingCode}')">
                            <i class="fas fa-download"></i> Tải vé
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize pagination
function initializePagination() {
    updatePagination();
}

// Update pagination
function updatePagination() {
    const paginationWrapper = document.getElementById('paginationWrapper');
    const pagination = document.getElementById('pagination');
    
    if (!pagination || filteredBookings.length === 0) {
        if (paginationWrapper) {
            paginationWrapper.style.display = 'none';
        }
        return;
    }

    if (paginationWrapper) {
        paginationWrapper.style.display = 'flex';
    }

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i> Trước
        </button>
    `;

    // Page numbers
    paginationHTML += '<div class="page-numbers">';
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHTML += `<span class="page-number ${1 === currentPage ? 'active' : ''}" onclick="changePage(1)">1</span>`;
        if (startPage > 2) {
            paginationHTML += '<span class="page-number" style="cursor: default; opacity: 0.5;">...</span>';
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<span class="page-number ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</span>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += '<span class="page-number" style="cursor: default; opacity: 0.5;">...</span>';
        }
        paginationHTML += `<span class="page-number ${totalPages === currentPage ? 'active' : ''}" onclick="changePage(${totalPages})">${totalPages}</span>`;
    }

    paginationHTML += '</div>';

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
    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayBookings();
    updatePagination();
    
    // Scroll to top of booking list
    const bookingSection = document.querySelector('.booking-history-section');
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// View booking details
function viewBookingDetails(bookingCode) {
    // In real app, this would open a modal or navigate to details page
    const booking = allBookings.find(b => b.bookingCode === bookingCode);
    if (booking) {
        alert(`Chi tiết đặt vé:\n\nPhim: ${booking.movie}\nRạp: ${booking.cinema} - ${booking.room}\nNgày: ${booking.date}, ${booking.time}\nGhế: ${booking.seats.join(', ')}\nMã đặt vé: ${booking.bookingCode}\nGiá: ${booking.price}`);
    }
}

// Download ticket
function downloadTicket(bookingCode) {
    // Simulate download
    const booking = allBookings.find(b => b.bookingCode === bookingCode);
    if (!booking) return;

    // In real app, this would download a PDF ticket
    alert(`Đang tải vé cho mã đặt vé: ${bookingCode}...\n\nSau vài giây, file vé sẽ được tải xuống.`);
    
    // Simulate download delay
    setTimeout(() => {
        alert('Đã tải vé thành công!');
    }, 1500);
}
