// Admin Users Management Functionality

// Global variables
let allUsers = [];
let filteredUsers = [];
let currentPage = 1;
let itemsPerPage = 10;
let userToToggle = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    initializeSearch();
    initializeModal();
    initializePagination();
});

// Load users from mock data
function loadUsers() {
    allUsers = [
        {
            id: 1,
            name: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            phone: '0901234567',
            registerDate: '2023-01-15',
            status: 'active',
            statusName: 'Hoạt động',
            totalBookings: 12,
            totalSpent: 2450000
        },
        {
            id: 2,
            name: 'Trần Thị B',
            email: 'tranthib@example.com',
            phone: '0912345678',
            registerDate: '2023-02-20',
            status: 'active',
            statusName: 'Hoạt động',
            totalBookings: 8,
            totalSpent: 1850000
        },
        {
            id: 3,
            name: 'Lê Văn C',
            email: 'levanc@example.com',
            phone: '0923456789',
            registerDate: '2023-03-10',
            status: 'blocked',
            statusName: 'Khóa',
            totalBookings: 3,
            totalSpent: 450000
        },
        {
            id: 4,
            name: 'Phạm Thị D',
            email: 'phamthid@example.com',
            phone: '0934567890',
            registerDate: '2023-04-05',
            status: 'active',
            statusName: 'Hoạt động',
            totalBookings: 15,
            totalSpent: 3200000
        },
        {
            id: 5,
            name: 'Hoàng Văn E',
            email: 'hoangvane@example.com',
            phone: '0945678901',
            registerDate: '2023-05-12',
            status: 'active',
            statusName: 'Hoạt động',
            totalBookings: 6,
            totalSpent: 1200000
        },
        {
            id: 6,
            name: 'Vũ Thị F',
            email: 'vuthif@example.com',
            phone: '0956789012',
            registerDate: '2023-06-18',
            status: 'active',
            statusName: 'Hoạt động',
            totalBookings: 20,
            totalSpent: 4500000
        },
        {
            id: 7,
            name: 'Đỗ Văn G',
            email: 'dovang@example.com',
            phone: '0967890123',
            registerDate: '2023-07-22',
            status: 'blocked',
            statusName: 'Khóa',
            totalBookings: 2,
            totalSpent: 300000
        },
        {
            id: 8,
            name: 'Bùi Thị H',
            email: 'buithih@example.com',
            phone: '0978901234',
            registerDate: '2023-08-30',
            status: 'active',
            statusName: 'Hoạt động',
            totalBookings: 9,
            totalSpent: 2100000
        },
        {
            id: 9,
            name: 'Ngô Văn I',
            email: 'ngovani@example.com',
            phone: '0989012345',
            registerDate: '2023-09-14',
            status: 'active',
            statusName: 'Hoạt động',
            totalBookings: 11,
            totalSpent: 2650000
        },
        {
            id: 10,
            name: 'Đinh Thị K',
            email: 'dinhthik@example.com',
            phone: '0990123456',
            registerDate: '2023-10-08',
            status: 'active',
            statusName: 'Hoạt động',
            totalBookings: 7,
            totalSpent: 1650000
        },
        {
            id: 11,
            name: 'Lý Văn L',
            email: 'lyvanl@example.com',
            phone: '0901234568',
            registerDate: '2023-11-25',
            status: 'active',
            statusName: 'Hoạt động',
            totalBookings: 14,
            totalSpent: 3100000
        },
        {
            id: 12,
            name: 'Trương Thị M',
            email: 'truongthim@example.com',
            phone: '0912345679',
            registerDate: '2024-01-02',
            status: 'blocked',
            statusName: 'Khóa',
            totalBookings: 1,
            totalSpent: 150000
        },
        {
            id: 13,
            name: 'Võ Văn N',
            email: 'vovann@example.com',
            phone: '0923456790',
            registerDate: '2024-02-15',
            status: 'active',
            statusName: 'Hoạt động',
            totalBookings: 5,
            totalSpent: 950000
        },
        {
            id: 14,
            name: 'Dương Thị O',
            email: 'duongthio@example.com',
            phone: '0934567901',
            registerDate: '2024-03-10',
            status: 'active',
            statusName: 'Hoạt động',
            totalBookings: 18,
            totalSpent: 4200000
        }
    ];

    filteredUsers = [...allUsers];
    displayUsers();
    updatePagination();
}

// Initialize search
function initializeSearch() {
    const searchInput = document.getElementById('userSearch');
    if (searchInput) {
        searchInput.addEventListener('input', applySearch);
    }
}

// Apply search
function applySearch() {
    const searchValue = document.getElementById('userSearch').value.trim().toLowerCase();

    if (!searchValue) {
        filteredUsers = [...allUsers];
    } else {
        filteredUsers = allUsers.filter(user => {
            const nameMatch = user.name.toLowerCase().includes(searchValue);
            const emailMatch = user.email.toLowerCase().includes(searchValue);
            return nameMatch || emailMatch;
        });
    }

    currentPage = 1;
    displayUsers();
    updatePagination();
}

// Display users
function displayUsers() {
    const tbody = document.getElementById('usersTableBody');
    const emptyState = document.getElementById('emptyState');

    if (!tbody) return;

    if (filteredUsers.length === 0) {
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
    const usersToShow = filteredUsers.slice(startIndex, endIndex);

    tbody.innerHTML = usersToShow.map(user => `
        <tr>
            <td>
                <span class="user-id">#${user.id}</span>
            </td>
            <td>
                <div class="user-name">${user.name}</div>
            </td>
            <td>
                <div class="user-email">${user.email}</div>
            </td>
            <td class="user-phone">${user.phone}</td>
            <td class="user-register-date">${formatDate(user.registerDate)}</td>
            <td>
                <span class="status-badge ${user.status}">${user.statusName}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-view" onclick="viewUserDetail(${user.id})" title="Xem chi tiết">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn ${user.status === 'active' ? 'btn-block' : 'btn-toggle-status'}" 
                            onclick="toggleUserStatus(${user.id})" 
                            title="${user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}">
                        <i class="fas ${user.status === 'active' ? 'fa-lock' : 'fa-unlock'}"></i>
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

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

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
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    displayUsers();
    updatePagination();

    // Scroll to top of table
    const tableWrapper = document.querySelector('.users-table-wrapper');
    if (tableWrapper) {
        tableWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Initialize modal
function initializeModal() {
    // User detail modal
    const detailModal = document.getElementById('userDetailModal');
    const closeDetailBtn = document.getElementById('closeDetailModal');

    if (closeDetailBtn && detailModal) {
        closeDetailBtn.addEventListener('click', () => {
            detailModal.style.display = 'none';
        });
    }

    // Close when clicking outside
    if (detailModal) {
        detailModal.addEventListener('click', (e) => {
            if (e.target === detailModal) {
                detailModal.style.display = 'none';
            }
        });
    }

    // Toggle status modal
    const toggleModal = document.getElementById('toggleStatusModal');
    const closeToggleBtn = document.getElementById('closeToggleModal');
    const cancelToggleBtn = document.getElementById('cancelToggleBtn');
    const confirmToggleBtn = document.getElementById('confirmToggleBtn');

    if (closeToggleBtn && toggleModal) {
        closeToggleBtn.addEventListener('click', () => {
            toggleModal.style.display = 'none';
            userToToggle = null;
        });
    }

    if (cancelToggleBtn && toggleModal) {
        cancelToggleBtn.addEventListener('click', () => {
            toggleModal.style.display = 'none';
            userToToggle = null;
        });
    }

    if (confirmToggleBtn) {
        confirmToggleBtn.addEventListener('click', confirmToggleStatus);
    }

    // Close when clicking outside
    if (toggleModal) {
        toggleModal.addEventListener('click', (e) => {
            if (e.target === toggleModal) {
                toggleModal.style.display = 'none';
                userToToggle = null;
            }
        });
    }
}

// View user detail
function viewUserDetail(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;

    const modal = document.getElementById('userDetailModal');
    const content = document.getElementById('userDetailContent');

    if (!modal || !content) return;

    const statusBadgeClass = user.status === 'active' ? 'active' : 'blocked';
    const statusBadgeText = user.status === 'active' ? 'Hoạt động' : 'Khóa';

    content.innerHTML = `
        <div class="user-detail-grid">
            <div class="user-detail-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="user-detail-info">
                <h3 class="user-detail-name">${user.name}</h3>
                <span class="status-badge ${statusBadgeClass} user-detail-badge">${statusBadgeText}</span>
            </div>
        </div>

        <div class="user-detail-section">
            <h4 class="user-detail-section-title">
                <i class="fas fa-info-circle"></i> Thông tin cá nhân
            </h4>
            <div class="user-detail-item">
                <div class="user-detail-label">ID người dùng:</div>
                <div class="user-detail-value">#${user.id}</div>
            </div>
            <div class="user-detail-item">
                <div class="user-detail-label">Họ và tên:</div>
                <div class="user-detail-value">${user.name}</div>
            </div>
            <div class="user-detail-item">
                <div class="user-detail-label">Email:</div>
                <div class="user-detail-value">${user.email}</div>
            </div>
            <div class="user-detail-item">
                <div class="user-detail-label">Số điện thoại:</div>
                <div class="user-detail-value">${user.phone}</div>
            </div>
            <div class="user-detail-item">
                <div class="user-detail-label">Ngày đăng ký:</div>
                <div class="user-detail-value">${formatDate(user.registerDate)}</div>
            </div>
        </div>

        <div class="user-detail-section">
            <h4 class="user-detail-section-title">
                <i class="fas fa-chart-line"></i> Thống kê hoạt động
            </h4>
            <div class="user-detail-item">
                <div class="user-detail-label">Tổng số đặt vé:</div>
                <div class="user-detail-value">${user.totalBookings} đơn</div>
            </div>
            <div class="user-detail-item">
                <div class="user-detail-label">Tổng chi tiêu:</div>
                <div class="user-detail-value">${formatCurrency(user.totalSpent)}</div>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

// Toggle user status
function toggleUserStatus(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;

    userToToggle = userId;
    const modal = document.getElementById('toggleStatusModal');
    const message = document.getElementById('toggleStatusMessage');

    if (!modal || !message) return;

    if (user.status === 'active') {
        message.innerHTML = `Bạn có chắc chắn muốn <strong>khóa</strong> tài khoản của <strong>${user.name}</strong>?<br><span class="warning-text">Người dùng sẽ không thể đăng nhập sau khi tài khoản bị khóa.</span>`;
    } else {
        message.innerHTML = `Bạn có chắc chắn muốn <strong>mở khóa</strong> tài khoản của <strong>${user.name}</strong>?<br><span class="warning-text">Người dùng sẽ có thể đăng nhập lại sau khi tài khoản được mở khóa.</span>`;
    }

    modal.style.display = 'flex';
}

// Confirm toggle status
function confirmToggleStatus() {
    if (!userToToggle) return;

    const userIndex = allUsers.findIndex(u => u.id === userToToggle);
    if (userIndex === -1) return;

    // Simulate API call
    setTimeout(() => {
        const user = allUsers[userIndex];
        
        if (user.status === 'active') {
            user.status = 'blocked';
            user.statusName = 'Khóa';
        } else {
            user.status = 'active';
            user.statusName = 'Hoạt động';
        }

        // Update filtered list
        const filteredIndex = filteredUsers.findIndex(u => u.id === userToToggle);
        if (filteredIndex !== -1) {
            filteredUsers[filteredIndex] = { ...user };
        }

        // Refresh display
        displayUsers();

        // Close modal
        const modal = document.getElementById('toggleStatusModal');
        if (modal) {
            modal.style.display = 'none';
        }

        userToToggle = null;
        alert(`Thay đổi trạng thái tài khoản thành công!`);
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
