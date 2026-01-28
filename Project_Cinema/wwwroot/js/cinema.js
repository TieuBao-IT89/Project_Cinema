// Cinema Page Functionality

// Global variables
let allCinemas = [];
let filteredCinemas = [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadCinemas();
    initializeFilters();
});

// Load cinemas from mock data
function loadCinemas() {
    // Mock cinema data - In real app, this would come from API
    allCinemas = [
        {
            id: 1,
            name: 'CGV Vincom Center',
            address: '72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
            phone: '1900 6017',
            region: 'hcm',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop',
            features: ['IMAX', '4DX', 'Starium', 'WiFi', 'Parking'],
            hours: '8:00 - 24:00',
            rooms: 12,
            lat: 10.7769,
            lng: 106.7009
        },
        {
            id: 2,
            name: 'CGV Landmark 81',
            address: 'Tầng B1, Landmark 81, 208 Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh, TP. Hồ Chí Minh',
            phone: '1900 6017',
            region: 'hcm',
            rating: 4.7,
            image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&h=600&fit=crop',
            features: ['IMAX', '4DX', 'Starium', 'WiFi', 'Parking', 'Food Court'],
            hours: '8:00 - 24:00',
            rooms: 10,
            lat: 10.7975,
            lng: 106.7219
        },
        {
            id: 3,
            name: 'Lotte Cinema Đà Nẵng',
            address: 'Tầng 5, Lotte Mart Đà Nẵng, 226 Ngũ Hành Sơn, P. Mỹ An, Q. Ngũ Hành Sơn, Đà Nẵng',
            phone: '1900 1244',
            region: 'danang',
            rating: 4.3,
            image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&h=600&fit=crop',
            features: ['IMAX', 'Starium', 'WiFi', 'Parking'],
            hours: '9:00 - 23:00',
            rooms: 8,
            lat: 16.0479,
            lng: 108.2526
        },
        {
            id: 4,
            name: 'Galaxy Cinema Nguyễn Du',
            address: '116 Nguyễn Du, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
            phone: '1900 2224',
            region: 'hcm',
            rating: 4.4,
            image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&h=600&fit=crop',
            features: ['IMAX', 'Starium', 'WiFi', 'Parking'],
            hours: '8:30 - 23:30',
            rooms: 9,
            lat: 10.7744,
            lng: 106.7005
        },
        {
            id: 5,
            name: 'BHD Star Cineplex',
            address: 'Tầng 5, Vincom Mega Mall Thảo Điền, 159 Xa Lộ Hà Nội, Phường Thảo Điền, Quận 2, TP. Hồ Chí Minh',
            phone: '1900 2224',
            region: 'hcm',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
            features: ['IMAX', '4DX', 'Starium', 'WiFi', 'Parking', 'Food Court'],
            hours: '9:00 - 23:00',
            rooms: 7,
            lat: 10.8028,
            lng: 106.7420
        },
        {
            id: 6,
            name: 'CGV Hà Nội',
            address: 'Tầng 4, Lotte Center Hà Nội, 54 Liễu Giai, Phường Cống Vị, Ba Đình, Hà Nội',
            phone: '1900 6017',
            region: 'hanoi',
            rating: 4.5,
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop',
            features: ['IMAX', '4DX', 'Starium', 'WiFi', 'Parking'],
            hours: '8:00 - 24:00',
            rooms: 11,
            lat: 21.0285,
            lng: 105.8042
        },
        {
            id: 7,
            name: 'CGV Cần Thơ',
            address: 'Tầng 3, Vincom Plaza Cần Thơ, 209 Đường 30/4, Ninh Kiều, Cần Thơ',
            phone: '1900 6017',
            region: 'cantho',
            rating: 4.4,
            image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop',
            features: ['IMAX', 'Starium', 'WiFi', 'Parking'],
            hours: '9:00 - 23:00',
            rooms: 6,
            lat: 10.0452,
            lng: 105.7469
        },
        {
            id: 8,
            name: 'Galaxy Cinema Quận 7',
            address: 'Tầng 3, SC VivoCity, 1058 Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP. Hồ Chí Minh',
            phone: '1900 2224',
            region: 'hcm',
            rating: 4.6,
            image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=600&fit=crop',
            features: ['IMAX', '4DX', 'Starium', 'WiFi', 'Parking', 'Food Court'],
            hours: '9:00 - 23:30',
            rooms: 10,
            lat: 10.7296,
            lng: 106.7183
        }
    ];

    filteredCinemas = [...allCinemas];
    displayCinemas();
}

// Initialize filters
function initializeFilters() {
    const regionFilter = document.getElementById('region-filter');
    const searchInput = document.getElementById('search-input');
    const resetBtn = document.getElementById('resetFilterBtn');

    if (regionFilter) {
        regionFilter.addEventListener('change', applyFilters);
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
    const regionFilter = document.getElementById('region-filter').value;
    const searchInput = document.getElementById('search-input').value.toLowerCase();

    filteredCinemas = allCinemas.filter(cinema => {
        // Region filter
        if (regionFilter !== 'all' && cinema.region !== regionFilter) {
            return false;
        }

        // Search filter
        if (searchInput) {
            const searchText = searchInput;
            if (!cinema.name.toLowerCase().includes(searchText) && 
                !cinema.address.toLowerCase().includes(searchText)) {
                return false;
            }
        }

        return true;
    });

    displayCinemas();
}

// Reset filters
function resetFilters() {
    document.getElementById('region-filter').value = 'all';
    document.getElementById('search-input').value = '';
    
    filteredCinemas = [...allCinemas];
    displayCinemas();
}

// Display cinemas
function displayCinemas() {
    const cinemaGrid = document.getElementById('cinemaGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!cinemaGrid) return;

    if (filteredCinemas.length === 0) {
        cinemaGrid.innerHTML = '';
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }

    if (emptyState) {
        emptyState.style.display = 'none';
    }

    cinemaGrid.innerHTML = filteredCinemas.map(cinema => `
        <div class="cinema-card">
            <div class="cinema-image-wrapper">
                <img src="${cinema.image}" alt="${cinema.name}" class="cinema-image">
                <div class="cinema-badge">Premium</div>
            </div>
            <div class="cinema-content">
                <div class="cinema-header">
                    <h3 class="cinema-name">${cinema.name}</h3>
                    <div class="cinema-rating">
                        <i class="fas fa-star"></i>
                        <span>${cinema.rating}</span>
                    </div>
                </div>
                <div class="cinema-info">
                    <div class="cinema-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span class="cinema-address">${cinema.address}</span>
                    </div>
                    <div class="cinema-info-item">
                        <i class="fas fa-phone"></i>
                        <span>${cinema.phone}</span>
                    </div>
                    <div class="cinema-info-item">
                        <i class="fas fa-clock"></i>
                        <span>Giờ mở cửa: ${cinema.hours}</span>
                    </div>
                    <div class="cinema-info-item">
                        <i class="fas fa-door-open"></i>
                        <span>${cinema.rooms} phòng chiếu</span>
                    </div>
                </div>
                <div class="cinema-features">
                    ${cinema.features.map(feature => `
                        <span class="feature-tag">
                            <i class="fas fa-check-circle"></i>
                            ${feature}
                        </span>
                    `).join('')}
                </div>
                <div class="cinema-actions">
                    <button class="btn-cinema btn-view-map" onclick="viewMap(${cinema.id})">
                        <i class="fas fa-map"></i> Bản đồ
                    </button>
                    <button class="btn-cinema btn-view-schedule" onclick="viewSchedule(${cinema.id})">
                        <i class="fas fa-calendar-alt"></i> Lịch chiếu
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// View map
function viewMap(cinemaId) {
    const cinema = allCinemas.find(c => c.id === cinemaId);
    if (!cinema) return;

    // In real app, this would open a map modal or navigate to map page
    alert(`Xem bản đồ cho rạp: ${cinema.name}\n\nĐịa chỉ: ${cinema.address}\n\nTọa độ: ${cinema.lat}, ${cinema.lng}\n\n(Tính năng bản đồ sẽ được tích hợp với Google Maps hoặc OpenStreetMap)`);
    
    // Example: Open Google Maps in new tab (uncomment to use)
    // const mapUrl = `https://www.google.com/maps/search/?api=1&query=${cinema.lat},${cinema.lng}`;
    // window.open(mapUrl, '_blank');
}

// View schedule
function viewSchedule(cinemaId) {
    const cinema = allCinemas.find(c => c.id === cinemaId);
    if (!cinema) return;

    // In real app, this would navigate to showtime page with cinema filter
    // For now, redirect to showtime page
    window.location.href = `showtime.html?cinema=${cinemaId}`;
    
    // Or show alert
    // alert(`Xem lịch chiếu cho rạp: ${cinema.name}\n\nSẽ chuyển đến trang lịch chiếu...`);
}
