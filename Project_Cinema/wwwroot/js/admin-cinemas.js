// Admin Cinemas Management Functionality

// Global variables
let allCinemas = [];
let filteredCinemas = [];
let currentPage = 1;
let itemsPerPage = 10;
let editingCinemaId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadCinemas();
    initializeModal();
    initializeSearchAndFilters();
    initializePagination();
});

// Load cinemas from mock data
function loadCinemas() {
    // Mock cinemas data
    allCinemas = [
        {
            id: 1,
            name: 'CinemaHub Quận 1',
            address: '123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
            phone: '0123456789',
            email: 'q1@cinemahub.vn',
            rooms: 8,
            status: 'active',
            statusName: 'Hoạt động',
            description: 'Rạp chiếu hiện đại với 8 phòng chiếu, đầy đủ tiện ích.'
        },
        {
            id: 2,
            name: 'CinemaHub Quận 3',
            address: '456 Đường Lê Văn Sỹ, Quận 3, TP. Hồ Chí Minh',
            phone: '0987654321',
            email: 'q3@cinemahub.vn',
            rooms: 6,
            status: 'active',
            statusName: 'Hoạt động',
            description: 'Rạp chiếu tiện lợi, gần trung tâm thành phố.'
        },
        {
            id: 3,
            name: 'CinemaHub Quận 7',
            address: '789 Đường Nguyễn Thị Thập, Quận 7, TP. Hồ Chí Minh',
            phone: '0123456780',
            email: 'q7@cinemahub.vn',
            rooms: 10,
            status: 'active',
            statusName: 'Hoạt động',
            description: 'Rạp chiếu lớn nhất hệ thống với 10 phòng chiếu cao cấp.'
        },
        {
            id: 4,
            name: 'CinemaHub Quận 10',
            address: '321 Đường Cách Mạng Tháng 8, Quận 10, TP. Hồ Chí Minh',
            phone: '0123456781',
            email: 'q10@cinemahub.vn',
            rooms: 7,
            status: 'active',
            statusName: 'Hoạt động',
            description: 'Rạp chiếu với nhiều phòng IMAX và 3D.'
        },
        {
            id: 5,
            name: 'CinemaHub Quận 5',
            address: '654 Đường Trần Hưng Đạo, Quận 5, TP. Hồ Chí Minh',
            phone: '0123456782',
            email: 'q5@cinemahub.vn',
            rooms: 5,
            status: 'inactive',
            statusName: 'Ngừng hoạt động',
            description: 'Rạp đang bảo trì, dự kiến mở lại vào tháng sau.'
        }
    ];

    filteredCinemas = [...allCinemas];
    displayCinemas();
    updatePagination();
}

// Initialize modal
function initializeModal() {
    const addBtn = document.getElementById('addCinemaBtn');
    const modal = document.getElementById('cinemaModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('cinemaForm');

    if (addBtn) {
        addBtn.addEventListener('click', () => openModal(null));
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Close when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Initialize delete modal
    const deleteModal = document.getElementById('deleteModal');
    const closeDeleteBtn = document.getElementById('closeDeleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    if (closeDeleteBtn) {
        closeDeleteBtn.addEventListener('click', () => {
            if (deleteModal) {
                deleteModal.style.display = 'none';
            }
        });
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            if (deleteModal) {
                deleteModal.style.display = 'none';
            }
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

// Initialize search and filters
function initializeSearchAndFilters() {
    const searchInput = document.getElementById('cinemaSearch');
    const statusFilter = document.getElementById('statusFilter');

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
}

// Apply filters
function applyFilters() {
    const searchValue = document.getElementById('cinemaSearch').value.trim().toLowerCase();
    const statusValue = document.getElementById('statusFilter').value;

    filteredCinemas = allCinemas.filter(cinema => {
        // Search filter
        if (searchValue && !cinema.name.toLowerCase().includes(searchValue) && 
            !cinema.address.toLowerCase().includes(searchValue)) {
            return false;
        }

        // Status filter
        if (statusValue !== 'all' && cinema.status !== statusValue) {
            return false;
        }

        return true;
    });

    currentPage = 1;
    displayCinemas();
    updatePagination();
}

// Display cinemas
function displayCinemas() {
    const tbody = document.getElementById('cinemasTableBody');
    const emptyState = document.getElementById('emptyState');

    if (!tbody) return;

    if (filteredCinemas.length === 0) {
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
    const cinemasToShow = filteredCinemas.slice(startIndex, endIndex);

    tbody.innerHTML = cinemasToShow.map(cinema => `
        <tr>
            <td>
                <div class="cinema-name">${cinema.name}</div>
            </td>
            <td>
                <div class="cinema-address">${cinema.address}</div>
            </td>
            <td class="cinema-phone">${cinema.phone}</td>
            <td class="cinema-email">${cinema.email}</td>
            <td class="cinema-rooms">${cinema.rooms} phòng</td>
            <td>
                <span class="status-badge ${cinema.status}">${cinema.statusName}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-edit" onclick="editCinema(${cinema.id})" title="Sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-delete" onclick="confirmDeleteCinema(${cinema.id})" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
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

    if (!pagination) return;

    const totalPages = Math.ceil(filteredCinemas.length / itemsPerPage);

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
    const totalPages = Math.ceil(filteredCinemas.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    displayCinemas();
    updatePagination();

    // Scroll to top of table
    const tableWrapper = document.querySelector('.cinemas-table-wrapper');
    if (tableWrapper) {
        tableWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Open modal
function openModal(cinemaId = null) {
    const modal = document.getElementById('cinemaModal');
    const form = document.getElementById('cinemaForm');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');

    if (!modal || !form) return;

    editingCinemaId = cinemaId;

    if (cinemaId) {
        // Edit mode
        const cinema = allCinemas.find(c => c.id === cinemaId);
        if (!cinema) return;

        modalTitle.innerHTML = '<i class="fas fa-edit"></i> Sửa thông tin rạp';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Cập nhật rạp';

        // Fill form
        document.getElementById('cinemaName').value = cinema.name;
        document.getElementById('cinemaAddress').value = cinema.address;
        document.getElementById('cinemaPhone').value = cinema.phone;
        document.getElementById('cinemaEmail').value = cinema.email;
        document.getElementById('cinemaRooms').value = cinema.rooms;
        document.getElementById('cinemaStatus').value = cinema.status;
        document.getElementById('cinemaDescription').value = cinema.description || '';
    } else {
        // Add mode
        modalTitle.innerHTML = '<i class="fas fa-plus"></i> Thêm rạp mới';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Lưu rạp';
        form.reset();
    }

    modal.style.display = 'flex';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('cinemaModal');
    if (modal) {
        modal.style.display = 'none';
        editingCinemaId = null;
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
        name: document.getElementById('cinemaName').value.trim(),
        address: document.getElementById('cinemaAddress').value.trim(),
        phone: document.getElementById('cinemaPhone').value.trim(),
        email: document.getElementById('cinemaEmail').value.trim(),
        rooms: parseInt(document.getElementById('cinemaRooms').value),
        status: document.getElementById('cinemaStatus').value,
        description: document.getElementById('cinemaDescription').value.trim()
    };

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
    }

    // Simulate API call
    setTimeout(() => {
        if (editingCinemaId) {
            // Update existing cinema
            const cinemaIndex = allCinemas.findIndex(c => c.id === editingCinemaId);
            if (cinemaIndex !== -1) {
                const statusNames = {
                    'active': 'Hoạt động',
                    'inactive': 'Ngừng hoạt động'
                };

                allCinemas[cinemaIndex] = {
                    ...allCinemas[cinemaIndex],
                    ...formData,
                    statusName: statusNames[formData.status]
                };
            }
            alert('Cập nhật rạp chiếu thành công!');
        } else {
            // Add new cinema
            const statusNames = {
                'active': 'Hoạt động',
                'inactive': 'Ngừng hoạt động'
            };

            const newCinema = {
                id: allCinemas.length > 0 ? Math.max(...allCinemas.map(c => c.id)) + 1 : 1,
                ...formData,
                statusName: statusNames[formData.status]
            };

            allCinemas.push(newCinema);
            alert('Thêm rạp chiếu mới thành công!');
        }

        // Reapply filters and refresh display
        applyFilters();

        // Close modal
        closeModal();

        // Re-enable submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = editingCinemaId ? '<i class="fas fa-save"></i> Cập nhật rạp' : '<i class="fas fa-save"></i> Lưu rạp';
        }

        editingCinemaId = null;
    }, 1000);
}

// Validate form
function validateForm() {
    let isValid = true;

    // Validate name
    const name = document.getElementById('cinemaName').value.trim();
    if (!name || name.length < 2) {
        showFieldError('nameError', 'Tên rạp phải có ít nhất 2 ký tự');
        document.getElementById('cinemaName').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('nameError');
        document.getElementById('cinemaName').classList.remove('error');
    }

    // Validate address
    const address = document.getElementById('cinemaAddress').value.trim();
    if (!address || address.length < 5) {
        showFieldError('addressError', 'Địa chỉ phải có ít nhất 5 ký tự');
        document.getElementById('cinemaAddress').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('addressError');
        document.getElementById('cinemaAddress').classList.remove('error');
    }

    // Validate phone
    const phone = document.getElementById('cinemaPhone').value.trim();
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phone || !phoneRegex.test(phone)) {
        showFieldError('phoneError', 'Số điện thoại phải có 10-11 chữ số');
        document.getElementById('cinemaPhone').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('phoneError');
        document.getElementById('cinemaPhone').classList.remove('error');
    }

    // Validate email
    const email = document.getElementById('cinemaEmail').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showFieldError('emailError', 'Email không hợp lệ');
        document.getElementById('cinemaEmail').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('emailError');
        document.getElementById('cinemaEmail').classList.remove('error');
    }

    // Validate rooms
    const rooms = parseInt(document.getElementById('cinemaRooms').value);
    if (!rooms || rooms < 1) {
        showFieldError('roomsError', 'Số phòng phải lớn hơn 0');
        document.getElementById('cinemaRooms').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('roomsError');
        document.getElementById('cinemaRooms').classList.remove('error');
    }

    // Validate status
    const status = document.getElementById('cinemaStatus').value;
    if (!status) {
        showFieldError('statusError', 'Vui lòng chọn trạng thái');
        document.getElementById('cinemaStatus').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('statusError');
        document.getElementById('cinemaStatus').classList.remove('error');
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

// Edit cinema
function editCinema(cinemaId) {
    openModal(cinemaId);
}

// Confirm delete cinema
let cinemaToDelete = null;

function confirmDeleteCinema(cinemaId) {
    const cinema = allCinemas.find(c => c.id === cinemaId);
    if (!cinema) return;

    cinemaToDelete = cinemaId;
    const deleteModal = document.getElementById('deleteModal');
    const deleteCinemaName = document.getElementById('deleteCinemaName');

    if (deleteModal && deleteCinemaName) {
        deleteCinemaName.textContent = cinema.name;
        deleteModal.style.display = 'flex';
    }
}

// Confirm delete
function confirmDelete() {
    if (!cinemaToDelete) return;

    // Simulate API call
    setTimeout(() => {
        allCinemas = allCinemas.filter(c => c.id !== cinemaToDelete);
        
        // Reapply filters and refresh display
        applyFilters();

        // Close modal
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) {
            deleteModal.style.display = 'none';
        }

        cinemaToDelete = null;
        alert('Xóa rạp chiếu thành công!');
    }, 500);
}
