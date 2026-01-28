// Admin Rooms Management Functionality

// Global variables
let allRooms = [];
let filteredRooms = [];
let currentPage = 1;
let itemsPerPage = 10;
let editingRoomId = null;

// Cinema data for mapping
const cinemas = {
    1: 'CinemaHub Quận 1',
    2: 'CinemaHub Quận 3',
    3: 'CinemaHub Quận 7',
    4: 'CinemaHub Quận 10'
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadRooms();
    initializeModal();
    initializeSearchAndFilters();
    initializePagination();
});

// Load rooms from mock data
function loadRooms() {
    // Mock rooms data
    allRooms = [
        {
            id: 1,
            name: 'Phòng 1',
            cinemaId: 1,
            cinemaName: 'CinemaHub Quận 1',
            seats: 120,
            type: '2D',
            status: 'active',
            statusName: 'Hoạt động',
            description: 'Phòng chiếu 2D với 120 ghế, hệ thống âm thanh Dolby.'
        },
        {
            id: 2,
            name: 'Phòng 2',
            cinemaId: 1,
            cinemaName: 'CinemaHub Quận 1',
            seats: 150,
            type: '3D',
            status: 'active',
            statusName: 'Hoạt động',
            description: 'Phòng chiếu 3D cao cấp với 150 ghế.'
        },
        {
            id: 3,
            name: 'Phòng IMAX',
            cinemaId: 1,
            cinemaName: 'CinemaHub Quận 1',
            seats: 300,
            type: 'IMAX',
            status: 'active',
            statusName: 'Hoạt động',
            description: 'Phòng IMAX lớn nhất với màn hình khổng lồ và 300 ghế.'
        },
        {
            id: 4,
            name: 'Phòng 1',
            cinemaId: 2,
            cinemaName: 'CinemaHub Quận 3',
            seats: 100,
            type: '2D',
            status: 'active',
            statusName: 'Hoạt động',
            description: 'Phòng chiếu 2D với 100 ghế.'
        },
        {
            id: 5,
            name: 'Phòng VIP',
            cinemaId: 2,
            cinemaName: 'CinemaHub Quận 3',
            seats: 50,
            type: 'VIP',
            status: 'active',
            statusName: 'Hoạt động',
            description: 'Phòng VIP sang trọng với ghế bành và 50 ghế.'
        },
        {
            id: 6,
            name: 'Phòng 1',
            cinemaId: 3,
            cinemaName: 'CinemaHub Quận 7',
            seats: 200,
            type: '3D',
            status: 'active',
            statusName: 'Hoạt động',
            description: 'Phòng chiếu 3D lớn với 200 ghế.'
        },
        {
            id: 7,
            name: 'Phòng 2',
            cinemaId: 3,
            cinemaName: 'CinemaHub Quận 7',
            seats: 180,
            type: 'IMAX',
            status: 'active',
            statusName: 'Hoạt động',
            description: 'Phòng IMAX với 180 ghế và màn hình lớn.'
        },
        {
            id: 8,
            name: 'Phòng 3',
            cinemaId: 3,
            cinemaName: 'CinemaHub Quận 7',
            seats: 150,
            type: '2D',
            status: 'active',
            statusName: 'Hoạt động',
            description: 'Phòng chiếu 2D tiêu chuẩn.'
        },
        {
            id: 9,
            name: 'Phòng 1',
            cinemaId: 4,
            cinemaName: 'CinemaHub Quận 10',
            seats: 120,
            type: '2D',
            status: 'active',
            statusName: 'Hoạt động',
            description: 'Phòng chiếu 2D với 120 ghế.'
        },
        {
            id: 10,
            name: 'Phòng 2',
            cinemaId: 4,
            cinemaName: 'CinemaHub Quận 10',
            seats: 100,
            type: '3D',
            status: 'inactive',
            statusName: 'Ngừng hoạt động',
            description: 'Phòng đang bảo trì.'
        }
    ];

    filteredRooms = [...allRooms];
    displayRooms();
    updatePagination();
}

// Initialize modal
function initializeModal() {
    const addBtn = document.getElementById('addRoomBtn');
    const modal = document.getElementById('roomModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('roomForm');

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
    const searchInput = document.getElementById('roomSearch');
    const cinemaFilter = document.getElementById('cinemaFilter');
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    if (cinemaFilter) {
        cinemaFilter.addEventListener('change', applyFilters);
    }

    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }
}

// Apply filters
function applyFilters() {
    const searchValue = document.getElementById('roomSearch').value.trim().toLowerCase();
    const cinemaValue = document.getElementById('cinemaFilter').value;
    const typeValue = document.getElementById('typeFilter').value;
    const statusValue = document.getElementById('statusFilter').value;

    filteredRooms = allRooms.filter(room => {
        // Search filter
        if (searchValue && !room.name.toLowerCase().includes(searchValue) && 
            !room.cinemaName.toLowerCase().includes(searchValue)) {
            return false;
        }

        // Cinema filter
        if (cinemaValue !== 'all' && room.cinemaId !== parseInt(cinemaValue)) {
            return false;
        }

        // Type filter
        if (typeValue !== 'all' && room.type !== typeValue) {
            return false;
        }

        // Status filter
        if (statusValue !== 'all' && room.status !== statusValue) {
            return false;
        }

        return true;
    });

    currentPage = 1;
    displayRooms();
    updatePagination();
}

// Display rooms
function displayRooms() {
    const tbody = document.getElementById('roomsTableBody');
    const emptyState = document.getElementById('emptyState');

    if (!tbody) return;

    if (filteredRooms.length === 0) {
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
    const roomsToShow = filteredRooms.slice(startIndex, endIndex);

    tbody.innerHTML = roomsToShow.map(room => `
        <tr>
            <td>
                <div class="room-name">${room.name}</div>
            </td>
            <td>
                <div class="room-cinema">${room.cinemaName}</div>
            </td>
            <td class="room-seats">${room.seats} ghế</td>
            <td>
                <span class="room-type ${room.type}">${room.type}</span>
            </td>
            <td>
                <span class="status-badge ${room.status}">${room.statusName}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-edit" onclick="editRoom(${room.id})" title="Sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-delete" onclick="confirmDeleteRoom(${room.id})" title="Xóa">
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

    const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

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
    const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    displayRooms();
    updatePagination();

    // Scroll to top of table
    const tableWrapper = document.querySelector('.rooms-table-wrapper');
    if (tableWrapper) {
        tableWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Open modal
function openModal(roomId = null) {
    const modal = document.getElementById('roomModal');
    const form = document.getElementById('roomForm');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');

    if (!modal || !form) return;

    editingRoomId = roomId;

    if (roomId) {
        // Edit mode
        const room = allRooms.find(r => r.id === roomId);
        if (!room) return;

        modalTitle.innerHTML = '<i class="fas fa-edit"></i> Sửa thông tin phòng';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Cập nhật phòng';

        // Fill form
        document.getElementById('roomName').value = room.name;
        document.getElementById('roomCinema').value = room.cinemaId;
        document.getElementById('roomSeats').value = room.seats;
        document.getElementById('roomType').value = room.type;
        document.getElementById('roomStatus').value = room.status;
        document.getElementById('roomDescription').value = room.description || '';
    } else {
        // Add mode
        modalTitle.innerHTML = '<i class="fas fa-plus"></i> Thêm phòng mới';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Lưu phòng';
        form.reset();
    }

    modal.style.display = 'flex';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('roomModal');
    if (modal) {
        modal.style.display = 'none';
        editingRoomId = null;
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
        name: document.getElementById('roomName').value.trim(),
        cinemaId: parseInt(document.getElementById('roomCinema').value),
        cinemaName: cinemas[parseInt(document.getElementById('roomCinema').value)],
        seats: parseInt(document.getElementById('roomSeats').value),
        type: document.getElementById('roomType').value,
        status: document.getElementById('roomStatus').value,
        description: document.getElementById('roomDescription').value.trim()
    };

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
    }

    // Simulate API call
    setTimeout(() => {
        if (editingRoomId) {
            // Update existing room
            const roomIndex = allRooms.findIndex(r => r.id === editingRoomId);
            if (roomIndex !== -1) {
                const statusNames = {
                    'active': 'Hoạt động',
                    'inactive': 'Ngừng hoạt động'
                };

                allRooms[roomIndex] = {
                    ...allRooms[roomIndex],
                    ...formData,
                    statusName: statusNames[formData.status]
                };
            }
            alert('Cập nhật phòng chiếu thành công!');
        } else {
            // Add new room
            const statusNames = {
                'active': 'Hoạt động',
                'inactive': 'Ngừng hoạt động'
            };

            const newRoom = {
                id: allRooms.length > 0 ? Math.max(...allRooms.map(r => r.id)) + 1 : 1,
                ...formData,
                statusName: statusNames[formData.status]
            };

            allRooms.push(newRoom);
            alert('Thêm phòng chiếu mới thành công!');
        }

        // Reapply filters and refresh display
        applyFilters();

        // Close modal
        closeModal();

        // Re-enable submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = editingRoomId ? '<i class="fas fa-save"></i> Cập nhật phòng' : '<i class="fas fa-save"></i> Lưu phòng';
        }

        editingRoomId = null;
    }, 1000);
}

// Validate form
function validateForm() {
    let isValid = true;

    // Validate name
    const name = document.getElementById('roomName').value.trim();
    if (!name || name.length < 1) {
        showFieldError('nameError', 'Tên phòng không được để trống');
        document.getElementById('roomName').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('nameError');
        document.getElementById('roomName').classList.remove('error');
    }

    // Validate cinema
    const cinema = document.getElementById('roomCinema').value;
    if (!cinema) {
        showFieldError('cinemaError', 'Vui lòng chọn rạp chiếu');
        document.getElementById('roomCinema').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('cinemaError');
        document.getElementById('roomCinema').classList.remove('error');
    }

    // Validate seats
    const seats = parseInt(document.getElementById('roomSeats').value);
    if (!seats || seats < 1) {
        showFieldError('seatsError', 'Số ghế phải lớn hơn 0');
        document.getElementById('roomSeats').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('seatsError');
        document.getElementById('roomSeats').classList.remove('error');
    }

    // Validate type
    const type = document.getElementById('roomType').value;
    if (!type) {
        showFieldError('typeError', 'Vui lòng chọn loại phòng');
        document.getElementById('roomType').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('typeError');
        document.getElementById('roomType').classList.remove('error');
    }

    // Validate status
    const status = document.getElementById('roomStatus').value;
    if (!status) {
        showFieldError('statusError', 'Vui lòng chọn trạng thái');
        document.getElementById('roomStatus').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('statusError');
        document.getElementById('roomStatus').classList.remove('error');
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

// Edit room
function editRoom(roomId) {
    openModal(roomId);
}

// Confirm delete room
let roomToDelete = null;

function confirmDeleteRoom(roomId) {
    const room = allRooms.find(r => r.id === roomId);
    if (!room) return;

    roomToDelete = roomId;
    const deleteModal = document.getElementById('deleteModal');
    const deleteRoomName = document.getElementById('deleteRoomName');

    if (deleteModal && deleteRoomName) {
        deleteRoomName.textContent = room.name;
        deleteModal.style.display = 'flex';
    }
}

// Confirm delete
function confirmDelete() {
    if (!roomToDelete) return;

    // Simulate API call
    setTimeout(() => {
        allRooms = allRooms.filter(r => r.id !== roomToDelete);
        
        // Reapply filters and refresh display
        applyFilters();

        // Close modal
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) {
            deleteModal.style.display = 'none';
        }

        roomToDelete = null;
        alert('Xóa phòng chiếu thành công!');
    }, 500);
}
