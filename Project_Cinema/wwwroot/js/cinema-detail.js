// Cinema Detail Page Functionality

// Global variables
let cinemaData = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadCinemaData();
    initializeActions();
});

// Load cinema data from URL parameter or default
function loadCinemaData() {
    // Get cinema ID from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const cinemaId = urlParams.get('id') || '1';

    // Mock cinema data - In real app, this would come from API
    const cinemas = {
        '1': {
            id: 1,
            name: 'CGV Vincom Center',
            address: '72 Lê Thánh Tôn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
            phone: '1900 6017',
            hours: '8:00 - 24:00 hàng ngày',
            rooms: 12,
            rating: 4.5,
            badge: 'Premium',
            lat: 10.7769,
            lng: 106.7009,
            totalSeats: 2400,
            formats: ['2D', '3D', 'IMAX'],
            features: [
                { name: 'IMAX', icon: 'fas fa-film' },
                { name: '4DX', icon: 'fas fa-magic' },
                { name: 'Starium', icon: 'fas fa-star' },
                { name: 'WiFi miễn phí', icon: 'fas fa-wifi' },
                { name: 'Bãi đỗ xe', icon: 'fas fa-parking' },
                { name: 'Food Court', icon: 'fas fa-utensils' },
                { name: 'ATM', icon: 'fas fa-credit-card' },
                { name: 'Thang máy', icon: 'fas fa-elevator' }
            ],
            roomList: [
                {
                    id: 1,
                    name: 'Phòng 1',
                    capacity: 200,
                    format: '2D',
                    screen: 'Standard',
                    sound: 'Dolby Digital'
                },
                {
                    id: 2,
                    name: 'Phòng 2',
                    capacity: 180,
                    format: '3D',
                    screen: 'Standard',
                    sound: 'Dolby Atmos'
                },
                {
                    id: 3,
                    name: 'Phòng IMAX',
                    capacity: 350,
                    format: 'IMAX',
                    screen: 'IMAX Giant Screen',
                    sound: 'IMAX Sound System'
                },
                {
                    id: 4,
                    name: 'Phòng 4DX',
                    capacity: 150,
                    format: '4DX',
                    screen: 'Standard',
                    sound: '4DX Sound'
                },
                {
                    id: 5,
                    name: 'Phòng 5',
                    capacity: 220,
                    format: '2D',
                    screen: 'Standard',
                    sound: 'Dolby Digital'
                },
                {
                    id: 6,
                    name: 'Phòng 6',
                    capacity: 200,
                    format: '3D',
                    screen: 'Standard',
                    sound: 'Dolby Atmos'
                },
                {
                    id: 7,
                    name: 'Phòng 7',
                    capacity: 180,
                    format: '2D',
                    screen: 'Standard',
                    sound: 'Dolby Digital'
                },
                {
                    id: 8,
                    name: 'Phòng 8',
                    capacity: 160,
                    format: '3D',
                    screen: 'Standard',
                    sound: 'Dolby Atmos'
                },
                {
                    id: 9,
                    name: 'Phòng 9',
                    capacity: 200,
                    format: '2D',
                    screen: 'Standard',
                    sound: 'Dolby Digital'
                },
                {
                    id: 10,
                    name: 'Phòng 10',
                    capacity: 240,
                    format: 'IMAX',
                    screen: 'IMAX Giant Screen',
                    sound: 'IMAX Sound System'
                },
                {
                    id: 11,
                    name: 'Phòng 11',
                    capacity: 180,
                    format: '2D',
                    screen: 'Standard',
                    sound: 'Dolby Digital'
                },
                {
                    id: 12,
                    name: 'Phòng 12',
                    capacity: 300,
                    format: '3D',
                    screen: 'Standard',
                    sound: 'Dolby Atmos'
                }
            ]
        }
    };

    cinemaData = cinemas[cinemaId] || cinemas['1'];
    displayCinemaData();
}

// Display cinema data
function displayCinemaData() {
    if (!cinemaData) return;

    // Update banner
    document.getElementById('cinemaName').textContent = cinemaData.name;
    document.getElementById('cinemaRating').textContent = cinemaData.rating;
    document.getElementById('cinemaBadge').textContent = cinemaData.badge;

    // Update info
    document.getElementById('cinemaAddress').textContent = cinemaData.address;
    document.getElementById('cinemaPhone').textContent = cinemaData.phone;
    document.getElementById('cinemaHours').textContent = cinemaData.hours;
    document.getElementById('cinemaRooms').textContent = `${cinemaData.rooms} phòng`;

    // Update stats
    document.getElementById('statRooms').textContent = cinemaData.rooms;
    document.getElementById('statSeats').textContent = cinemaData.totalSeats.toLocaleString('vi-VN');
    document.getElementById('statFormats').textContent = cinemaData.formats.length;

    // Display rooms
    displayRooms();

    // Display features
    displayFeatures();
}

// Display rooms
function displayRooms() {
    const roomsGrid = document.getElementById('roomsGrid');
    if (!roomsGrid || !cinemaData) return;

    roomsGrid.innerHTML = cinemaData.roomList.map(room => `
        <div class="room-card">
            <div class="room-header">
                <h3 class="room-name">${room.name}</h3>
                <span class="room-capacity">${room.capacity} ghế</span>
            </div>
            <div class="room-info">
                <div class="room-info-item">
                    <i class="fas fa-film"></i>
                    <span>Định dạng: <strong>${room.format}</strong></span>
                </div>
                <div class="room-info-item">
                    <i class="fas fa-tv"></i>
                    <span>Màn hình: ${room.screen}</span>
                </div>
                <div class="room-info-item">
                    <i class="fas fa-volume-up"></i>
                    <span>Âm thanh: ${room.sound}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Display features
function displayFeatures() {
    const featuresGrid = document.getElementById('featuresGrid');
    if (!featuresGrid || !cinemaData) return;

    featuresGrid.innerHTML = cinemaData.features.map(feature => `
        <div class="feature-card">
            <div class="feature-icon">
                <i class="${feature.icon}"></i>
            </div>
            <h4 class="feature-name">${feature.name}</h4>
        </div>
    `).join('');
}

// Initialize action buttons
function initializeActions() {
    // Actions are handled via onclick attributes in HTML
}

// View schedule
function viewSchedule() {
    if (!cinemaData) return;
    
    // Navigate to showtime page with cinema filter
    window.location.href = `showtime.html?cinema=${cinemaData.id}`;
}

// Call cinema
function callCinema() {
    if (!cinemaData) return;
    
    // Open phone dialer
    window.location.href = `tel:${cinemaData.phone.replace(/\s/g, '')}`;
}

// Get directions
function getDirections() {
    if (!cinemaData) return;
    
    // Open Google Maps with directions
    const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${cinemaData.lat},${cinemaData.lng}`;
    window.open(mapUrl, '_blank');
}

// Open Google Maps
function openGoogleMaps() {
    if (!cinemaData) return;
    
    // Open Google Maps
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${cinemaData.lat},${cinemaData.lng}`;
    window.open(mapUrl, '_blank');
}
