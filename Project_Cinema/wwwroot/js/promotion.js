// Promotion Page Functionality

// Global variables
let allPromotions = [];
let filteredPromotions = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadPromotions();
    initializeFilters();
});

// Load promotions from mock data
function loadPromotions() {
    // Mock promotion data - In real app, this would come from API
    allPromotions = [
        {
            id: 1,
            title: 'Combo 2 vé tặng 1 bắp',
            description: 'Mua 2 vé xem phim bất kỳ, tặng ngay 1 bắp size M. Áp dụng từ thứ 2 đến thứ 5. Chương trình áp dụng cho tất cả các rạp trong hệ thống.',
            image: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&h=600&fit=crop',
            type: 'combo',
            status: 'active',
            discount: null,
            discountText: 'Tặng 1 bắp size M',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            applicableDays: 'Thứ 2 - Thứ 5'
        },
        {
            id: 2,
            title: 'Giảm 30% cho học sinh, sinh viên',
            description: 'Xuất trình thẻ học sinh/sinh viên để được giảm 30% giá vé. Áp dụng tất cả các ngày trong tuần. Chương trình dành cho học sinh, sinh viên có thẻ còn hiệu lực.',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
            type: 'discount',
            status: 'active',
            discount: '30%',
            discountText: 'Giảm 30%',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            applicableDays: 'Tất cả các ngày'
        },
        {
            id: 3,
            title: 'Thứ 3 giá chỉ 50k',
            description: 'Tất cả các suất chiếu thứ 3 hàng tuần chỉ với 50.000đ/vé. Số lượng có hạn! Áp dụng cho tất cả phim đang chiếu.',
            image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&h=600&fit=crop',
            type: 'discount',
            status: 'active',
            discount: '50k',
            discountText: 'Chỉ 50.000đ/vé',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            applicableDays: 'Thứ 3 hàng tuần'
        },
        {
            id: 4,
            title: 'Voucher 100k cho thành viên VIP',
            description: 'Thành viên VIP được tặng voucher 100.000đ khi mua vé trên 300.000đ. Voucher có thể sử dụng cho lần đặt vé tiếp theo.',
            image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=600&fit=crop',
            type: 'voucher',
            status: 'active',
            discount: '100k',
            discountText: 'Voucher 100.000đ',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            applicableDays: 'Tất cả các ngày'
        },
        {
            id: 5,
            title: 'Combo gia đình ưu đãi',
            description: 'Combo 4 vé + 2 bắp + 2 nước chỉ với 600.000đ. Áp dụng cuối tuần và ngày lễ. Tiết kiệm hơn 150.000đ so với mua lẻ.',
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop',
            type: 'combo',
            status: 'active',
            discount: null,
            discountText: 'Tiết kiệm 150.000đ',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            applicableDays: 'Cuối tuần & Ngày lễ'
        },
        {
            id: 6,
            title: 'Ngày sinh nhật miễn phí',
            description: 'Thành viên sinh nhật trong tháng được tặng 1 vé xem phim miễn phí. Áp dụng trong vòng 7 ngày từ ngày sinh nhật.',
            image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop',
            type: 'member',
            status: 'active',
            discount: '100%',
            discountText: 'Miễn phí 1 vé',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            applicableDays: 'Trong 7 ngày từ sinh nhật'
        },
        {
            id: 7,
            title: 'Early Bird - Giảm 20%',
            description: 'Đặt vé trước 10h sáng được giảm 20% cho tất cả suất chiếu trong ngày. Chương trình áp dụng hàng ngày.',
            image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&h=600&fit=crop',
            type: 'discount',
            status: 'active',
            discount: '20%',
            discountText: 'Giảm 20%',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            applicableDays: 'Hàng ngày (trước 10h)'
        },
        {
            id: 8,
            title: 'Khuyến mãi Black Friday',
            description: 'Giảm giá lên đến 50% cho tất cả vé và combo trong ngày Black Friday. Chương trình đặc biệt chỉ diễn ra một ngày.',
            image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop',
            type: 'discount',
            status: 'upcoming',
            discount: '50%',
            discountText: 'Giảm đến 50%',
            startDate: '2024-11-29',
            endDate: '2024-11-29',
            applicableDays: 'Ngày 29/11/2024'
        },
        {
            id: 9,
            title: 'Voucher đặc biệt Tết',
            description: 'Nhận voucher 200.000đ khi mua vé trong dịp Tết. Voucher có thể sử dụng trong vòng 30 ngày kể từ ngày phát hành.',
            image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&h=600&fit=crop',
            type: 'voucher',
            status: 'upcoming',
            discount: '200k',
            discountText: 'Voucher 200.000đ',
            startDate: '2024-12-25',
            endDate: '2025-02-05',
            applicableDays: 'Dịp Tết Nguyên Đán'
        },
        {
            id: 10,
            title: 'Combo ưu đãi cuối năm',
            description: 'Combo đặc biệt cuối năm với nhiều ưu đãi hấp dẫn. Áp dụng từ ngày 15/12 đến hết năm.',
            image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&h=600&fit=crop',
            type: 'combo',
            status: 'upcoming',
            discount: null,
            discountText: 'Nhiều ưu đãi',
            startDate: '2024-12-15',
            endDate: '2024-12-31',
            applicableDays: '15/12 - 31/12'
        },
        {
            id: 11,
            title: 'Giảm giá mùa hè',
            description: 'Chương trình giảm giá đặc biệt mùa hè đã kết thúc. Cảm ơn quý khách đã tham gia.',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
            type: 'discount',
            status: 'ended',
            discount: '25%',
            discountText: 'Đã kết thúc',
            startDate: '2023-06-01',
            endDate: '2023-08-31',
            applicableDays: 'Mùa hè 2023'
        },
        {
            id: 12,
            title: 'Voucher khai trương',
            description: 'Chương trình voucher khai trương đã kết thúc. Hẹn gặp lại trong các chương trình tiếp theo.',
            image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=600&fit=crop',
            type: 'voucher',
            status: 'ended',
            discount: '150k',
            discountText: 'Đã kết thúc',
            startDate: '2023-12-01',
            endDate: '2023-12-31',
            applicableDays: 'Tháng 12/2023'
        }
    ];

    filteredPromotions = [...allPromotions];
    displayPromotions();
}

// Initialize filters
function initializeFilters() {
    const typeFilter = document.getElementById('type-filter');
    const statusFilter = document.getElementById('status-filter');
    const searchInput = document.getElementById('search-input');
    const resetBtn = document.getElementById('resetFilterBtn');

    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
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
    const typeFilter = document.getElementById('type-filter').value;
    const statusFilter = document.getElementById('status-filter').value;
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    filteredPromotions = allPromotions.filter(promotion => {
        // Type filter
        if (typeFilter !== 'all' && promotion.type !== typeFilter) {
            return false;
        }

        // Status filter
        if (statusFilter !== 'all' && promotion.status !== statusFilter) {
            return false;
        }

        // Search filter
        if (searchInput) {
            const searchText = searchInput;
            if (!promotion.title.toLowerCase().includes(searchText) && 
                !promotion.description.toLowerCase().includes(searchText)) {
                return false;
            }
        }

        return true;
    });

    displayPromotions();
}

// Reset filters
function resetFilters() {
    document.getElementById('type-filter').value = 'all';
    document.getElementById('status-filter').value = 'all';
    document.getElementById('search-input').value = '';
    
    filteredPromotions = [...allPromotions];
    displayPromotions();
}

// Display promotions
function displayPromotions() {
    const promotionsGrid = document.getElementById('promotionsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!promotionsGrid) return;

    if (filteredPromotions.length === 0) {
        promotionsGrid.innerHTML = '';
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }

    if (emptyState) {
        emptyState.style.display = 'none';
    }

    promotionsGrid.innerHTML = filteredPromotions.map(promotion => `
        <div class="promotion-card">
            <div class="promotion-image-wrapper">
                <img src="${promotion.image}" alt="${promotion.title}" class="promotion-image">
                <span class="promotion-badge ${promotion.type}">
                    ${promotion.type === 'combo' ? 'Combo' : 
                      promotion.type === 'discount' ? 'Giảm giá' : 
                      promotion.type === 'voucher' ? 'Voucher' : 'Thành viên'}
                </span>
                <span class="promotion-status ${promotion.status}">
                    ${promotion.status === 'active' ? 'Đang diễn ra' : 
                      promotion.status === 'upcoming' ? 'Sắp diễn ra' : 'Đã kết thúc'}
                </span>
            </div>
            <div class="promotion-content">
                <div class="promotion-header">
                    <h3 class="promotion-title">${promotion.title}</h3>
                    <p class="promotion-desc">${promotion.description}</p>
                </div>
                ${promotion.discount ? `
                    <div class="promotion-discount">
                        <span class="discount-badge">${promotion.discount}</span>
                        <span class="discount-text">${promotion.discountText}</span>
                    </div>
                ` : `
                    <div class="promotion-discount">
                        <span class="discount-text">${promotion.discountText}</span>
                    </div>
                `}
                <div class="promotion-meta">
                    <div class="promotion-meta-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>Áp dụng: <strong>${promotion.applicableDays}</strong></span>
                    </div>
                    <div class="promotion-meta-item">
                        <i class="fas fa-clock"></i>
                        <span>Thời gian: <strong>${formatDateRange(promotion.startDate, promotion.endDate)}</strong></span>
                    </div>
                </div>
                <div class="promotion-actions">
                    <button class="btn-promotion btn-view-details" onclick="viewPromotionDetails(${promotion.id})">
                        <i class="fas fa-info-circle"></i> Chi tiết
                    </button>
                    ${promotion.status === 'active' ? `
                        <button class="btn-promotion btn-use-now" onclick="usePromotion(${promotion.id})">
                            <i class="fas fa-gift"></i> Sử dụng ngay
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Format date range
function formatDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    if (startDate === endDate) {
        return formatDate(start);
    }
    
    if (end > now && start <= now) {
        return `Đến ${formatDate(end)}`;
    }
    
    return `${formatDate(start)} - ${formatDate(end)}`;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// View promotion details
function viewPromotionDetails(promotionId) {
    const promotion = allPromotions.find(p => p.id === promotionId);
    if (!promotion) return;

    // In real app, this would open a modal or navigate to details page
    alert(`Chi tiết khuyến mãi:\n\n${promotion.title}\n\n${promotion.description}\n\nÁp dụng: ${promotion.applicableDays}\nThời gian: ${formatDateRange(promotion.startDate, promotion.endDate)}`);
}

// Use promotion
function usePromotion(promotionId) {
    const promotion = allPromotions.find(p => p.id === promotionId);
    if (!promotion) return;

    // In real app, this would navigate to booking page with promotion applied
    alert(`Áp dụng khuyến mãi: ${promotion.title}\n\nĐang chuyển đến trang đặt vé với mã khuyến mãi...`);
    // window.location.href = `booking.html?promo=${promotionId}`;
}
