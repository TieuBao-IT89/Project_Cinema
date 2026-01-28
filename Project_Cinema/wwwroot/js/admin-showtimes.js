// Admin Showtimes Management Functionality

// Global variables
let allShowtimes = [];
let filteredShowtimes = [];
let currentPage = 1;
let itemsPerPage = 10;
let editingShowtimeId = null;

// Mock data for movies and cinemas
const moviesData = [
    { id: 1, name: 'Avengers: Endgame' },
    { id: 2, name: 'Spider-Man: No Way Home' },
    { id: 3, name: 'Black Panther: Wakanda Forever' },
    { id: 4, name: 'Avatar: The Way of Water' },
    { id: 5, name: 'The Matrix Resurrections' },
    { id: 6, name: 'Top Gun: Maverick' },
    { id: 7, name: 'Doctor Strange in the Multiverse of Madness' },
    { id: 8, name: 'Jurassic World Dominion' }
];

const cinemasData = [
    { id: 1, name: 'CGV Vincom Center' },
    { id: 2, name: 'CGV Landmark' },
    { id: 3, name: 'Lotte Cinema' },
    { id: 4, name: 'BHD Star' },
    { id: 5, name: 'Galaxy Cinema' }
];

const roomsData = [
    { id: 1, name: 'Phòng 1', cinemaId: 1 },
    { id: 2, name: 'Phòng 2', cinemaId: 1 },
    { id: 3, name: 'Phòng 3', cinemaId: 1 },
    { id: 4, name: 'Phòng 1', cinemaId: 2 },
    { id: 5, name: 'Phòng 2', cinemaId: 2 },
    { id: 6, name: 'Phòng 1', cinemaId: 3 },
    { id: 7, name: 'Phòng 2', cinemaId: 3 },
    { id: 8, name: 'Phòng 1', cinemaId: 4 },
    { id: 9, name: 'Phòng 1', cinemaId: 5 }
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeDropdowns();
    loadShowtimes();
    initializeModal();
    initializeFilters();
    initializePagination();
});

// Initialize dropdowns with movies and cinemas
function initializeDropdowns() {
    // Initialize movie filter dropdown
    const movieFilter = document.getElementById('movieFilter');
    if (movieFilter) {
        moviesData.forEach(movie => {
            const option = document.createElement('option');
            option.value = movie.id;
            option.textContent = movie.name;
            movieFilter.appendChild(option);
        });
    }

    // Initialize cinema filter dropdown
    const cinemaFilter = document.getElementById('cinemaFilter');
    if (cinemaFilter) {
        cinemasData.forEach(cinema => {
            const option = document.createElement('option');
            option.value = cinema.id;
            option.textContent = cinema.name;
            cinemaFilter.appendChild(option);
        });
    }

    // Set min date to today
    const dateFilter = document.getElementById('dateFilter');
    const today = new Date().toISOString().split('T')[0];
    if (dateFilter) {
        dateFilter.setAttribute('max', '2099-12-31');
    }
}

// Load showtimes from mock data
function loadShowtimes() {
    allShowtimes = [
        {
            id: 1,
            movieId: 1,
            movieName: 'Avengers: Endgame',
            cinemaId: 1,
            cinemaName: 'CGV Vincom Center',
            roomId: 1,
            roomName: 'Phòng 1',
            date: '2024-03-20',
            time: '10:00',
            price: 75000,
            status: 'available',
            statusName: 'Đang mở bán'
        },
        {
            id: 2,
            movieId: 1,
            movieName: 'Avengers: Endgame',
            cinemaId: 1,
            cinemaName: 'CGV Vincom Center',
            roomId: 2,
            roomName: 'Phòng 2',
            date: '2024-03-20',
            time: '14:30',
            price: 85000,
            status: 'available',
            statusName: 'Đang mở bán'
        },
        {
            id: 3,
            movieId: 2,
            movieName: 'Spider-Man: No Way Home',
            cinemaId: 2,
            cinemaName: 'CGV Landmark',
            roomId: 4,
            roomName: 'Phòng 1',
            date: '2024-03-20',
            time: '18:00',
            price: 80000,
            status: 'available',
            statusName: 'Đang mở bán'
        },
        {
            id: 4,
            movieId: 3,
            movieName: 'Black Panther: Wakanda Forever',
            cinemaId: 3,
            cinemaName: 'Lotte Cinema',
            roomId: 6,
            roomName: 'Phòng 1',
            date: '2024-03-21',
            time: '11:00',
            price: 75000,
            status: 'sold-out',
            statusName: 'Hết vé'
        },
        {
            id: 5,
            movieId: 4,
            movieName: 'Avatar: The Way of Water',
            cinemaId: 4,
            cinemaName: 'BHD Star',
            roomId: 8,
            roomName: 'Phòng 1',
            date: '2024-03-21',
            time: '15:30',
            price: 90000,
            status: 'available',
            statusName: 'Đang mở bán'
        },
        {
            id: 6,
            movieId: 5,
            movieName: 'The Matrix Resurrections',
            cinemaId: 5,
            cinemaName: 'Galaxy Cinema',
            roomId: 9,
            roomName: 'Phòng 1',
            date: '2024-03-21',
            time: '20:00',
            price: 70000,
            status: 'available',
            statusName: 'Đang mở bán'
        },
        {
            id: 7,
            movieId: 2,
            movieName: 'Spider-Man: No Way Home',
            cinemaId: 1,
            cinemaName: 'CGV Vincom Center',
            roomId: 3,
            roomName: 'Phòng 3',
            date: '2024-03-22',
            time: '12:00',
            price: 75000,
            status: 'available',
            statusName: 'Đang mở bán'
        },
        {
            id: 8,
            movieId: 6,
            movieName: 'Top Gun: Maverick',
            cinemaId: 2,
            cinemaName: 'CGV Landmark',
            roomId: 5,
            roomName: 'Phòng 2',
            date: '2024-03-22',
            time: '16:00',
            price: 80000,
            status: 'cancelled',
            statusName: 'Đã hủy'
        },
        {
            id: 9,
            movieId: 7,
            movieName: 'Doctor Strange in the Multiverse of Madness',
            cinemaId: 3,
            cinemaName: 'Lotte Cinema',
            roomId: 7,
            roomName: 'Phòng 2',
            date: '2024-03-23',
            time: '13:30',
            price: 75000,
            status: 'available',
            statusName: 'Đang mở bán'
        },
        {
            id: 10,
            movieId: 8,
            movieName: 'Jurassic World Dominion',
            cinemaId: 4,
            cinemaName: 'BHD Star',
            roomId: 8,
            roomName: 'Phòng 1',
            date: '2024-03-23',
            time: '19:00',
            price: 85000,
            status: 'available',
            statusName: 'Đang mở bán'
        },
        {
            id: 11,
            movieId: 1,
            movieName: 'Avengers: Endgame',
            cinemaId: 5,
            cinemaName: 'Galaxy Cinema',
            roomId: 9,
            roomName: 'Phòng 1',
            date: '2024-03-24',
            time: '10:30',
            price: 70000,
            status: 'available',
            statusName: 'Đang mở bán'
        },
        {
            id: 12,
            movieId: 3,
            movieName: 'Black Panther: Wakanda Forever',
            cinemaId: 1,
            cinemaName: 'CGV Vincom Center',
            roomId: 1,
            roomName: 'Phòng 1',
            date: '2024-03-24',
            time: '17:00',
            price: 80000,
            status: 'available',
            statusName: 'Đang mở bán'
        }
    ];

    filteredShowtimes = [...allShowtimes];
    displayShowtimes();
    updatePagination();
}

// Initialize modal
function initializeModal() {
    const addBtn = document.getElementById('addShowtimeBtn');
    const modal = document.getElementById('showtimeModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('showtimeForm');
    const cinemaSelect = document.getElementById('showtimeCinema');

    if (addBtn && modal) {
        addBtn.addEventListener('click', () => openModal());
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => closeModal());
    }

    if (cancelBtn && modal) {
        cancelBtn.addEventListener('click', () => closeModal());
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Initialize movie dropdown in modal
    const movieSelect = document.getElementById('showtimeMovie');
    if (movieSelect) {
        moviesData.forEach(movie => {
            const option = document.createElement('option');
            option.value = movie.id;
            option.textContent = movie.name;
            movieSelect.appendChild(option);
        });
    }

    // Initialize cinema dropdown in modal
    if (cinemaSelect) {
        cinemasData.forEach(cinema => {
            const option = document.createElement('option');
            option.value = cinema.id;
            option.textContent = cinema.name;
            cinemaSelect.appendChild(option);
        });

        // Update rooms when cinema changes
        cinemaSelect.addEventListener('change', updateRoomOptions);
    }

    // Set min date for date input
    const dateInput = document.getElementById('showtimeDate');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    // Handle form submission
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Initialize delete modal
    initializeDeleteModal();
}

// Update room options based on selected cinema
function updateRoomOptions() {
    const cinemaId = parseInt(document.getElementById('showtimeCinema').value);
    const roomSelect = document.getElementById('showtimeRoom');

    if (!roomSelect) return;

    // Clear existing options
    roomSelect.innerHTML = '<option value="">Chọn phòng</option>';

    if (!cinemaId) return;

    // Filter rooms by cinema
    const filteredRooms = roomsData.filter(room => room.cinemaId === cinemaId);
    filteredRooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.id;
        option.textContent = room.name;
        roomSelect.appendChild(option);
    });
}

// Initialize delete modal
function initializeDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    const closeDeleteBtn = document.getElementById('closeDeleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    if (closeDeleteBtn && deleteModal) {
        closeDeleteBtn.addEventListener('click', () => {
            deleteModal.style.display = 'none';
        });
    }

    if (cancelDeleteBtn && deleteModal) {
        cancelDeleteBtn.addEventListener('click', () => {
            deleteModal.style.display = 'none';
        });
    }

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDelete);
    }

    // Close when clicking outside
    if (deleteModal) {
        deleteModal.addEventListener('click', (e) => {
            if (e.target === deleteModal) {
                deleteModal.style.display = 'none';
            }
        });
    }
}

// Initialize filters
function initializeFilters() {
    const resetBtn = document.getElementById('resetFiltersBtn');
    const movieFilter = document.getElementById('movieFilter');
    const cinemaFilter = document.getElementById('cinemaFilter');
    const dateFilter = document.getElementById('dateFilter');

    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }

    if (movieFilter) {
        movieFilter.addEventListener('change', applyFilters);
    }

    if (cinemaFilter) {
        cinemaFilter.addEventListener('change', applyFilters);
    }

    if (dateFilter) {
        dateFilter.addEventListener('change', applyFilters);
    }

    applyFilters();
}

// Apply filters
function applyFilters() {
    const movieId = document.getElementById('movieFilter').value;
    const cinemaId = document.getElementById('cinemaFilter').value;
    const dateValue = document.getElementById('dateFilter').value;

    filteredShowtimes = allShowtimes.filter(showtime => {
        // Movie filter
        if (movieId !== 'all' && showtime.movieId !== parseInt(movieId)) {
            return false;
        }

        // Cinema filter
        if (cinemaId !== 'all' && showtime.cinemaId !== parseInt(cinemaId)) {
            return false;
        }

        // Date filter
        if (dateValue && showtime.date !== dateValue) {
            return false;
        }

        return true;
    });

    currentPage = 1;
    displayShowtimes();
    updatePagination();
}

// Reset filters
function resetFilters() {
    document.getElementById('movieFilter').value = 'all';
    document.getElementById('cinemaFilter').value = 'all';
    document.getElementById('dateFilter').value = '';
    applyFilters();
}

// Display showtimes
function displayShowtimes() {
    const tbody = document.getElementById('showtimesTableBody');
    const emptyState = document.getElementById('emptyState');

    if (!tbody) return;

    if (filteredShowtimes.length === 0) {
        tbody.innerHTML = '';
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }

    if (emptyState) {
        emptyState.style.display = 'none';
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const showtimesToShow = filteredShowtimes.slice(startIndex, endIndex);

    tbody.innerHTML = showtimesToShow.map(showtime => `
        <tr>
            <td>
                <div class="showtime-movie">${showtime.movieName}</div>
            </td>
            <td class="showtime-cinema">${showtime.cinemaName}</td>
            <td class="showtime-room">${showtime.roomName}</td>
            <td class="showtime-date">${formatDate(showtime.date)}</td>
            <td class="showtime-time">${showtime.time}</td>
            <td class="showtime-price">${formatCurrency(showtime.price)}</td>
            <td>
                <span class="status-badge ${showtime.status}">${showtime.statusName}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-edit" onclick="editShowtime(${showtime.id})" title="Sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-delete" onclick="confirmDeleteShowtime(${showtime.id})" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
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

    const totalPages = Math.ceil(filteredShowtimes.length / itemsPerPage);

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
    const totalPages = Math.ceil(filteredShowtimes.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    displayShowtimes();
    updatePagination();

    // Scroll to top of table
    const tableWrapper = document.querySelector('.showtimes-table-wrapper');
    if (tableWrapper) {
        tableWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Open modal
function openModal(showtimeId = null) {
    const modal = document.getElementById('showtimeModal');
    const form = document.getElementById('showtimeForm');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');
    const dateInput = document.getElementById('showtimeDate');

    if (!modal || !form) return;

    editingShowtimeId = showtimeId;

    // Set min date to today
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    if (showtimeId) {
        // Edit mode
        const showtime = allShowtimes.find(s => s.id === showtimeId);
        if (!showtime) return;

        modalTitle.innerHTML = '<i class="fas fa-edit"></i> Sửa lịch chiếu';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Cập nhật lịch chiếu';

        // Fill form
        document.getElementById('showtimeMovie').value = showtime.movieId;
        document.getElementById('showtimeCinema').value = showtime.cinemaId;
        updateRoomOptions(); // Update rooms before setting room value
        setTimeout(() => {
            document.getElementById('showtimeRoom').value = showtime.roomId;
        }, 100);
        document.getElementById('showtimeDate').value = showtime.date;
        document.getElementById('showtimeTime').value = showtime.time;
        document.getElementById('showtimePrice').value = showtime.price;
        document.getElementById('showtimeStatus').value = showtime.status;
    } else {
        // Add mode
        modalTitle.innerHTML = '<i class="fas fa-plus"></i> Thêm lịch chiếu mới';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Lưu lịch chiếu';
        form.reset();
        
        // Reset room dropdown
        const roomSelect = document.getElementById('showtimeRoom');
        if (roomSelect) {
            roomSelect.innerHTML = '<option value="">Chọn phòng</option>';
        }

        // Set default date to today
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.value = today;
        }
    }

    modal.style.display = 'flex';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('showtimeModal');
    if (modal) {
        modal.style.display = 'none';
        editingShowtimeId = null;
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
        return;
    }

    const formData = {
        movieId: parseInt(document.getElementById('showtimeMovie').value),
        cinemaId: parseInt(document.getElementById('showtimeCinema').value),
        roomId: parseInt(document.getElementById('showtimeRoom').value),
        date: document.getElementById('showtimeDate').value,
        time: document.getElementById('showtimeTime').value,
        price: parseInt(document.getElementById('showtimePrice').value),
        status: document.getElementById('showtimeStatus').value
    };

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
    }

    // Simulate API call
    setTimeout(() => {
        if (editingShowtimeId) {
            // Update existing showtime
            const showtimeIndex = allShowtimes.findIndex(s => s.id === editingShowtimeId);
            if (showtimeIndex !== -1) {
                const movie = moviesData.find(m => m.id === formData.movieId);
                const cinema = cinemasData.find(c => c.id === formData.cinemaId);
                const room = roomsData.find(r => r.id === formData.roomId);
                
                const statusNames = {
                    'available': 'Đang mở bán',
                    'sold-out': 'Hết vé',
                    'cancelled': 'Đã hủy'
                };

                allShowtimes[showtimeIndex] = {
                    ...allShowtimes[showtimeIndex],
                    ...formData,
                    movieName: movie ? movie.name : '',
                    cinemaName: cinema ? cinema.name : '',
                    roomName: room ? room.name : '',
                    statusName: statusNames[formData.status]
                };
            }
            alert('Cập nhật lịch chiếu thành công!');
        } else {
            // Add new showtime
            const movie = moviesData.find(m => m.id === formData.movieId);
            const cinema = cinemasData.find(c => c.id === formData.cinemaId);
            const room = roomsData.find(r => r.id === formData.roomId);
            
            const statusNames = {
                'available': 'Đang mở bán',
                'sold-out': 'Hết vé',
                'cancelled': 'Đã hủy'
            };

            const newShowtime = {
                id: allShowtimes.length > 0 ? Math.max(...allShowtimes.map(s => s.id)) + 1 : 1,
                ...formData,
                movieName: movie ? movie.name : '',
                cinemaName: cinema ? cinema.name : '',
                roomName: room ? room.name : '',
                statusName: statusNames[formData.status]
            };

            allShowtimes.push(newShowtime);
            alert('Thêm lịch chiếu mới thành công!');
        }

        // Reapply filters and refresh display
        applyFilters();

        // Close modal
        closeModal();

        // Re-enable submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = editingShowtimeId ? '<i class="fas fa-save"></i> Cập nhật lịch chiếu' : '<i class="fas fa-save"></i> Lưu lịch chiếu';
        }

        editingShowtimeId = null;
    }, 1000);
}

// Validate form
function validateForm() {
    let isValid = true;

    // Validate movie
    const movie = document.getElementById('showtimeMovie').value;
    if (!movie) {
        showFieldError('movieError', 'Vui lòng chọn phim');
        document.getElementById('showtimeMovie').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('movieError');
        document.getElementById('showtimeMovie').classList.remove('error');
    }

    // Validate cinema
    const cinema = document.getElementById('showtimeCinema').value;
    if (!cinema) {
        showFieldError('cinemaError', 'Vui lòng chọn rạp');
        document.getElementById('showtimeCinema').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('cinemaError');
        document.getElementById('showtimeCinema').classList.remove('error');
    }

    // Validate room
    const room = document.getElementById('showtimeRoom').value;
    if (!room) {
        showFieldError('roomError', 'Vui lòng chọn phòng');
        document.getElementById('showtimeRoom').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('roomError');
        document.getElementById('showtimeRoom').classList.remove('error');
    }

    // Validate date
    const date = document.getElementById('showtimeDate').value;
    if (!date) {
        showFieldError('dateError', 'Vui lòng chọn ngày chiếu');
        document.getElementById('showtimeDate').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('dateError');
        document.getElementById('showtimeDate').classList.remove('error');
    }

    // Validate time
    const time = document.getElementById('showtimeTime').value;
    if (!time) {
        showFieldError('timeError', 'Vui lòng chọn giờ chiếu');
        document.getElementById('showtimeTime').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('timeError');
        document.getElementById('showtimeTime').classList.remove('error');
    }

    // Validate price
    const price = parseInt(document.getElementById('showtimePrice').value);
    if (!price || price < 0) {
        showFieldError('priceError', 'Giá vé phải lớn hơn hoặc bằng 0');
        document.getElementById('showtimePrice').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('priceError');
        document.getElementById('showtimePrice').classList.remove('error');
    }

    // Validate status
    const status = document.getElementById('showtimeStatus').value;
    if (!status) {
        showFieldError('statusError', 'Vui lòng chọn trạng thái');
        document.getElementById('showtimeStatus').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('statusError');
        document.getElementById('showtimeStatus').classList.remove('error');
    }

    return isValid;
}

// Show field error
function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

// Clear field error
function clearFieldError(fieldId) {
    const errorElement = document.getElementById(fieldId);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

// Edit showtime
function editShowtime(showtimeId) {
    openModal(showtimeId);
}

// Confirm delete showtime
let showtimeToDelete = null;

function confirmDeleteShowtime(showtimeId) {
    showtimeToDelete = showtimeId;
    const deleteModal = document.getElementById('deleteModal');

    if (deleteModal) {
        deleteModal.style.display = 'flex';
    }
}

// Confirm delete
function confirmDelete() {
    if (!showtimeToDelete) return;

    // Simulate API call
    setTimeout(() => {
        allShowtimes = allShowtimes.filter(s => s.id !== showtimeToDelete);
        
        // Reapply filters and refresh display
        applyFilters();

        // Close modal
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) {
            deleteModal.style.display = 'none';
        }

        showtimeToDelete = null;
        alert('Xóa lịch chiếu thành công!');
    }, 500);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Format currency
function formatCurrency(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
}
