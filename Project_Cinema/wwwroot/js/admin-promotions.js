// Admin Promotions Management Functionality

// Global variables
let allPromotions = [];
let filteredPromotions = [];
let currentPage = 1;
let itemsPerPage = 10;
let editingPromotionId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadPromotions();
    initializeModal();
    initializeSearchAndFilters();
    initializePagination();
});

// Load promotions from mock data
function loadPromotions() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    // Mock promotions data
    allPromotions = [
        {
            id: 1,
            name: 'Combo 2 vé tặng 1 bắp',
            image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400',
            description: 'Mua 2 vé xem phim bất kỳ, tặng ngay 1 bắp size M. Áp dụng từ thứ 2 đến thứ 5.',
            startDate: formatDateForInput(today),
            endDate: formatDateForInput(nextWeek),
            discount: null,
            conditions: 'Áp dụng từ thứ 2 đến thứ 5',
            status: getPromotionStatus(today, nextWeek),
            statusName: getStatusName(today, nextWeek)
        },
        {
            id: 2,
            name: 'Giảm 30% cho học sinh, sinh viên',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
            description: 'Xuất trình thẻ học sinh/sinh viên để được giảm 30% giá vé. Áp dụng tất cả các ngày trong tuần.',
            startDate: formatDateForInput(lastWeek),
            endDate: formatDateForInput(nextWeek),
            discount: 30,
            conditions: 'Xuất trình thẻ học sinh/sinh viên hợp lệ',
            status: getPromotionStatus(lastWeek, nextWeek),
            statusName: getStatusName(lastWeek, nextWeek)
        },
        {
            id: 3,
            name: 'Thứ 3 giá chỉ 50k',
            image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400',
            description: 'Tất cả các suất chiếu thứ 3 hàng tuần chỉ với 50.000đ/vé. Số lượng có hạn!',
            startDate: formatDateForInput(today),
            endDate: formatDateForInput(nextWeek),
            discount: null,
            conditions: 'Chỉ áp dụng thứ 3 hàng tuần',
            status: getPromotionStatus(today, nextWeek),
            statusName: getStatusName(today, nextWeek)
        },
        {
            id: 4,
            name: 'Khuyến mãi sinh nhật',
            image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400',
            description: 'Giảm 20% cho khách hàng sinh nhật trong tháng. Áp dụng cho tất cả suất chiếu.',
            startDate: formatDateForInput(tomorrow),
            endDate: formatDateForInput(nextWeek),
            discount: 20,
            conditions: 'Xuất trình CMND/CCCD để xác nhận sinh nhật',
            status: getPromotionStatus(tomorrow, nextWeek),
            statusName: getStatusName(tomorrow, nextWeek)
        },
        {
            id: 5,
            name: 'Combo gia đình',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
            description: 'Combo 4 vé + 2 bắp + 2 nước với giá ưu đãi. Dành cho gia đình xem phim cuối tuần.',
            startDate: formatDateForInput(lastWeek),
            endDate: formatDateForInput(lastMonth),
            discount: null,
            conditions: 'Áp dụng thứ 7 và chủ nhật',
            status: 'expired',
            statusName: 'Đã hết hạn'
        }
    ];

    filteredPromotions = [...allPromotions];
    displayPromotions();
    updatePagination();
}

// Get promotion status based on dates
function getPromotionStatus(startDate, endDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    if (today < start) {
        return 'upcoming';
    } else if (today >= start && today <= end) {
        return 'active';
    } else {
        return 'expired';
    }
}

// Get status name
function getStatusName(startDate, endDate) {
    const status = getPromotionStatus(startDate, endDate);
    const statusNames = {
        'active': 'Đang áp dụng',
        'upcoming': 'Sắp diễn ra',
        'expired': 'Đã hết hạn'
    };
    return statusNames[status] || 'Đang áp dụng';
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

// Initialize modal
function initializeModal() {
    const addBtn = document.getElementById('addPromotionBtn');
    const modal = document.getElementById('promotionModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('promotionForm');

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
    const searchInput = document.getElementById('promotionSearch');
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
    const searchValue = document.getElementById('promotionSearch').value.trim().toLowerCase();
    const statusValue = document.getElementById('statusFilter').value;

    filteredPromotions = allPromotions.filter(promotion => {
        // Search filter
        if (searchValue && !promotion.name.toLowerCase().includes(searchValue) && 
            !promotion.description.toLowerCase().includes(searchValue)) {
            return false;
        }

        // Status filter
        if (statusValue !== 'all' && promotion.status !== statusValue) {
            return false;
        }

        return true;
    });

    currentPage = 1;
    displayPromotions();
    updatePagination();
}

// Display promotions
function displayPromotions() {
    const tbody = document.getElementById('promotionsTableBody');
    const emptyState = document.getElementById('emptyState');

    if (!tbody) return;

    if (filteredPromotions.length === 0) {
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
    const promotionsToShow = filteredPromotions.slice(startIndex, endIndex);

    tbody.innerHTML = promotionsToShow.map(promotion => `
        <tr>
            <td>
                <img src="${promotion.image}" alt="${promotion.name}" class="promotion-image" onerror="this.src='https://via.placeholder.com/100x70?text=No+Image'">
            </td>
            <td>
                <div class="promotion-name">${promotion.name}</div>
            </td>
            <td>
                <div class="promotion-description">${promotion.description}</div>
            </td>
            <td class="promotion-date">${formatDate(promotion.startDate)}</td>
            <td class="promotion-date">${formatDate(promotion.endDate)}</td>
            <td>
                <span class="status-badge ${promotion.status}">${promotion.statusName}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-edit" onclick="editPromotion(${promotion.id})" title="Sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-delete" onclick="confirmDeletePromotion(${promotion.id})" title="Xóa">
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

    const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);

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
    const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    displayPromotions();
    updatePagination();

    // Scroll to top of table
    const tableWrapper = document.querySelector('.promotions-table-wrapper');
    if (tableWrapper) {
        tableWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Open modal
function openModal(promotionId = null) {
    const modal = document.getElementById('promotionModal');
    const form = document.getElementById('promotionForm');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');

    if (!modal || !form) return;

    editingPromotionId = promotionId;

    if (promotionId) {
        // Edit mode
        const promotion = allPromotions.find(p => p.id === promotionId);
        if (!promotion) return;

        modalTitle.innerHTML = '<i class="fas fa-edit"></i> Sửa thông tin khuyến mãi';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Cập nhật khuyến mãi';

        // Fill form
        document.getElementById('promotionName').value = promotion.name;
        document.getElementById('promotionImage').value = promotion.image;
        document.getElementById('promotionDescription').value = promotion.description;
        document.getElementById('promotionStart').value = promotion.startDate;
        document.getElementById('promotionEnd').value = promotion.endDate;
        document.getElementById('promotionDiscount').value = promotion.discount || '';
        document.getElementById('promotionConditions').value = promotion.conditions || '';
    } else {
        // Add mode
        modalTitle.innerHTML = '<i class="fas fa-plus"></i> Thêm khuyến mãi mới';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Lưu khuyến mãi';
        form.reset();
        
        // Set default dates
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekStr = nextWeek.toISOString().split('T')[0];
        
        document.getElementById('promotionStart').value = today;
        document.getElementById('promotionEnd').value = nextWeekStr;
    }

    modal.style.display = 'flex';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('promotionModal');
    if (modal) {
        modal.style.display = 'none';
        editingPromotionId = null;
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
        name: document.getElementById('promotionName').value.trim(),
        image: document.getElementById('promotionImage').value.trim(),
        description: document.getElementById('promotionDescription').value.trim(),
        startDate: document.getElementById('promotionStart').value,
        endDate: document.getElementById('promotionEnd').value,
        discount: document.getElementById('promotionDiscount').value ? parseInt(document.getElementById('promotionDiscount').value) : null,
        conditions: document.getElementById('promotionConditions').value.trim()
    };

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
    }

    // Simulate API call
    setTimeout(() => {
        if (editingPromotionId) {
            // Update existing promotion
            const promotionIndex = allPromotions.findIndex(p => p.id === editingPromotionId);
            if (promotionIndex !== -1) {
                allPromotions[promotionIndex] = {
                    ...allPromotions[promotionIndex],
                    ...formData,
                    status: getPromotionStatus(formData.startDate, formData.endDate),
                    statusName: getStatusName(formData.startDate, formData.endDate)
                };
            }
            alert('Cập nhật khuyến mãi thành công!');
        } else {
            // Add new promotion
            const newPromotion = {
                id: allPromotions.length > 0 ? Math.max(...allPromotions.map(p => p.id)) + 1 : 1,
                ...formData,
                status: getPromotionStatus(formData.startDate, formData.endDate),
                statusName: getStatusName(formData.startDate, formData.endDate)
            };

            allPromotions.push(newPromotion);
            alert('Thêm khuyến mãi mới thành công!');
        }

        // Reapply filters and refresh display
        applyFilters();

        // Close modal
        closeModal();

        // Re-enable submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = editingPromotionId ? '<i class="fas fa-save"></i> Cập nhật khuyến mãi' : '<i class="fas fa-save"></i> Lưu khuyến mãi';
        }

        editingPromotionId = null;
    }, 1000);
}

// Validate form
function validateForm() {
    let isValid = true;

    // Validate name
    const name = document.getElementById('promotionName').value.trim();
    if (!name || name.length < 2) {
        showFieldError('nameError', 'Tên khuyến mãi phải có ít nhất 2 ký tự');
        document.getElementById('promotionName').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('nameError');
        document.getElementById('promotionName').classList.remove('error');
    }

    // Validate image URL
    const image = document.getElementById('promotionImage').value.trim();
    if (!image) {
        showFieldError('imageError', 'Vui lòng nhập URL hình ảnh');
        document.getElementById('promotionImage').classList.add('error');
        isValid = false;
    } else if (!isValidUrl(image)) {
        showFieldError('imageError', 'URL không hợp lệ');
        document.getElementById('promotionImage').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('imageError');
        document.getElementById('promotionImage').classList.remove('error');
    }

    // Validate description
    const description = document.getElementById('promotionDescription').value.trim();
    if (!description || description.length < 5) {
        showFieldError('descriptionError', 'Mô tả phải có ít nhất 5 ký tự');
        document.getElementById('promotionDescription').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('descriptionError');
        document.getElementById('promotionDescription').classList.remove('error');
    }

    // Validate start date
    const startDate = document.getElementById('promotionStart').value;
    if (!startDate) {
        showFieldError('startError', 'Vui lòng chọn ngày bắt đầu');
        document.getElementById('promotionStart').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('startError');
        document.getElementById('promotionStart').classList.remove('error');
    }

    // Validate end date
    const endDate = document.getElementById('promotionEnd').value;
    if (!endDate) {
        showFieldError('endError', 'Vui lòng chọn ngày kết thúc');
        document.getElementById('promotionEnd').classList.add('error');
        isValid = false;
    } else if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        showFieldError('endError', 'Ngày kết thúc phải sau ngày bắt đầu');
        document.getElementById('promotionEnd').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('endError');
        document.getElementById('promotionEnd').classList.remove('error');
    }

    return isValid;
}

// Validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
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

// Edit promotion
function editPromotion(promotionId) {
    openModal(promotionId);
}

// Confirm delete promotion
let promotionToDelete = null;

function confirmDeletePromotion(promotionId) {
    const promotion = allPromotions.find(p => p.id === promotionId);
    if (!promotion) return;

    promotionToDelete = promotionId;
    const deleteModal = document.getElementById('deleteModal');
    const deletePromotionName = document.getElementById('deletePromotionName');

    if (deleteModal && deletePromotionName) {
        deletePromotionName.textContent = promotion.name;
        deleteModal.style.display = 'flex';
    }
}

// Confirm delete
function confirmDelete() {
    if (!promotionToDelete) return;

    // Simulate API call
    setTimeout(() => {
        allPromotions = allPromotions.filter(p => p.id !== promotionToDelete);
        
        // Reapply filters and refresh display
        applyFilters();

        // Close modal
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) {
            deleteModal.style.display = 'none';
        }

        promotionToDelete = null;
        alert('Xóa khuyến mãi thành công!');
    }, 500);
}
