// Admin Seats Management Functionality

// Global variables
let currentCinemaId = null;
let currentRoomId = null;
let seatMapData = null;
let isEditMode = false;
let selectedSeats = new Set();

// Cinema and Room data
const cinemas = {
    1: { name: 'CinemaHub Quận 1', rooms: [
        { id: 1, name: 'Phòng 1', seats: 120 },
        { id: 2, name: 'Phòng 2', seats: 150 },
        { id: 3, name: 'Phòng IMAX', seats: 300 }
    ]},
    2: { name: 'CinemaHub Quận 3', rooms: [
        { id: 4, name: 'Phòng 1', seats: 100 },
        { id: 5, name: 'Phòng VIP', seats: 50 }
    ]},
    3: { name: 'CinemaHub Quận 7', rooms: [
        { id: 6, name: 'Phòng 1', seats: 200 },
        { id: 7, name: 'Phòng 2', seats: 180 },
        { id: 8, name: 'Phòng 3', seats: 150 }
    ]},
    4: { name: 'CinemaHub Quận 10', rooms: [
        { id: 9, name: 'Phòng 1', seats: 120 },
        { id: 10, name: 'Phòng 2', seats: 100 }
    ]}
};

// Mock seat map data
const mockSeatMaps = {
    1: generateSeatMap(8, 15, 'normal'), // Phòng 1: 8 hàng x 15 ghế
    2: generateSeatMap(10, 15, 'normal'), // Phòng 2: 10 hàng x 15 ghế
    3: generateSeatMap(15, 20, 'normal'), // Phòng IMAX: 15 hàng x 20 ghế
    4: generateSeatMap(8, 12, 'normal'),
    5: generateSeatMap(5, 10, 'vip'),
    6: generateSeatMap(10, 20, 'normal'),
    7: generateSeatMap(9, 20, 'normal'),
    8: generateSeatMap(8, 18, 'normal'),
    9: generateSeatMap(8, 15, 'normal'),
    10: generateSeatMap(8, 12, 'normal')
};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeSelectors();
    initializeModals();
    initializeEditMode();
});

// Generate mock seat map
function generateSeatMap(rows, seatsPerRow, defaultType = 'normal') {
    const rowsData = [];
    const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];
    
    for (let i = 0; i < rows; i++) {
        const seats = [];
        for (let j = 0; j < seatsPerRow; j++) {
            // Randomly assign some seats as VIP, occupied, or disabled
            let type = defaultType;
            let status = 'available';
            
            if (defaultType === 'vip') {
                type = 'vip';
            } else if (Math.random() < 0.1) {
                type = 'vip';
            }
            
            if (Math.random() < 0.15) {
                status = 'occupied';
            } else if (Math.random() < 0.05) {
                status = 'disabled';
            }
            
            seats.push({
                id: `${rowLabels[i]}${j + 1}`,
                number: j + 1,
                type: type,
                status: status
            });
        }
        
        rowsData.push({
            label: rowLabels[i],
            seats: seats
        });
    }
    
    return rowsData;
}

// Initialize selectors
function initializeSelectors() {
    const cinemaSelect = document.getElementById('selectCinema');
    const roomSelect = document.getElementById('selectRoom');
    const loadBtn = document.getElementById('loadSeatsBtn');
    
    if (cinemaSelect) {
        cinemaSelect.addEventListener('change', function() {
            const cinemaId = parseInt(this.value);
            currentCinemaId = cinemaId;
            
            // Clear room select
            if (roomSelect) {
                roomSelect.innerHTML = '<option value="">Chọn phòng chiếu</option>';
                roomSelect.disabled = !cinemaId;
                
                if (cinemaId && cinemas[cinemaId]) {
                    cinemas[cinemaId].rooms.forEach(room => {
                        const option = document.createElement('option');
                        option.value = room.id;
                        option.textContent = `${room.name} (${room.seats} ghế)`;
                        roomSelect.appendChild(option);
                    });
                }
            }
            
            if (loadBtn) {
                loadBtn.disabled = !cinemaId;
            }
            
            // Hide seat map
            hideSeatMap();
        });
    }
    
    if (roomSelect) {
        roomSelect.addEventListener('change', function() {
            const roomId = parseInt(this.value);
            currentRoomId = roomId;
            
            if (loadBtn) {
                loadBtn.disabled = !roomId;
            }
        });
    }
    
    if (loadBtn) {
        loadBtn.addEventListener('click', loadSeatMap);
    }
}

// Load seat map
function loadSeatMap() {
    if (!currentRoomId) {
        alert('Vui lòng chọn phòng chiếu');
        return;
    }
    
    // Get seat map data
    seatMapData = mockSeatMaps[currentRoomId] || generateSeatMap(8, 15, 'normal');
    
    // Get room info
    let roomInfo = null;
    for (const cinema of Object.values(cinemas)) {
        const room = cinema.rooms.find(r => r.id === currentRoomId);
        if (room) {
            roomInfo = room;
            break;
        }
    }
    
    const cinema = Object.values(cinemas).find(c => c.rooms.some(r => r.id === currentRoomId));
    
    // Update map title
    const mapTitle = document.getElementById('mapTitle');
    const mapSubtitle = document.getElementById('mapSubtitle');
    
    if (mapTitle && roomInfo) {
        mapTitle.textContent = `Sơ đồ ghế - ${roomInfo.name}`;
    }
    
    if (mapSubtitle && cinema) {
        mapSubtitle.textContent = cinema.name;
    }
    
    // Display seat map
    displaySeatMap();
    
    // Show seat map section
    const seatMapSection = document.getElementById('seatMapSection');
    const emptyState = document.getElementById('emptyState');
    
    if (seatMapSection) {
        seatMapSection.style.display = 'block';
    }
    
    if (emptyState) {
        emptyState.style.display = 'none';
    }
}

// Display seat map
function displaySeatMap() {
    const seatMap = document.getElementById('seatMap');
    if (!seatMap || !seatMapData) return;
    
    seatMap.innerHTML = '';
    
    seatMapData.forEach(row => {
        const rowElement = document.createElement('div');
        rowElement.className = 'seat-row';
        
        // Row label
        const labelElement = document.createElement('div');
        labelElement.className = 'row-label';
        labelElement.textContent = row.label;
        rowElement.appendChild(labelElement);
        
        // Seats container
        const seatsContainer = document.createElement('div');
        seatsContainer.className = 'seat-row-seats';
        
        row.seats.forEach((seat, index) => {
            const seatElement = document.createElement('div');
            seatElement.className = `seat ${seat.type} ${seat.status}`;
            seatElement.dataset.seatId = seat.id;
            seatElement.dataset.row = row.label;
            seatElement.dataset.number = seat.number;
            seatElement.dataset.type = seat.type;
            seatElement.dataset.status = seat.status;
            seatElement.textContent = seat.number;
            
            if (isEditMode) {
                seatElement.classList.add('edit-mode');
                seatElement.addEventListener('click', handleSeatClick);
            }
            
            seatsContainer.appendChild(seatElement);
            
            // Add aisle after every 5 seats
            if ((index + 1) % 5 === 0 && index < row.seats.length - 1) {
                const aisle = document.createElement('div');
                aisle.style.width = '20px';
                seatsContainer.appendChild(aisle);
            }
        });
        
        rowElement.appendChild(seatsContainer);
        seatMap.appendChild(rowElement);
    });
}

// Hide seat map
function hideSeatMap() {
    const seatMapSection = document.getElementById('seatMapSection');
    const emptyState = document.getElementById('emptyState');
    
    if (seatMapSection) {
        seatMapSection.style.display = 'none';
    }
    
    if (emptyState) {
        emptyState.style.display = 'block';
    }
    
    isEditMode = false;
    selectedSeats.clear();
    updateEditModeUI();
}

// Initialize edit mode
function initializeEditMode() {
    const editModeBtn = document.getElementById('editModeBtn');
    const saveBtn = document.getElementById('saveSeatsBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    
    if (editModeBtn) {
        editModeBtn.addEventListener('click', toggleEditMode);
    }
    
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSeatMap);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', cancelEdit);
    }
}

// Toggle edit mode
function toggleEditMode() {
    if (!seatMapData) {
        alert('Vui lòng tải sơ đồ ghế trước');
        return;
    }
    
    isEditMode = !isEditMode;
    selectedSeats.clear();
    updateEditModeUI();
    displaySeatMap();
}

// Update edit mode UI
function updateEditModeUI() {
    const editModeBtn = document.getElementById('editModeBtn');
    const saveBtn = document.getElementById('saveSeatsBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');
    const editTools = document.getElementById('editTools');
    
    if (isEditMode) {
        if (editModeBtn) {
            editModeBtn.style.display = 'none';
        }
        if (saveBtn) {
            saveBtn.style.display = 'inline-flex';
        }
        if (cancelBtn) {
            cancelBtn.style.display = 'inline-flex';
        }
        if (editTools) {
            editTools.style.display = 'block';
        }
    } else {
        if (editModeBtn) {
            editModeBtn.style.display = 'inline-flex';
        }
        if (saveBtn) {
            saveBtn.style.display = 'none';
        }
        if (cancelBtn) {
            cancelBtn.style.display = 'none';
        }
        if (editTools) {
            editTools.style.display = 'none';
        }
    }
}

// Handle seat click in edit mode
function handleSeatClick(e) {
    if (!isEditMode) return;
    
    const seat = e.currentTarget;
    const seatId = seat.dataset.seatId;
    
    if (e.ctrlKey || e.metaKey) {
        // Multi-select
        if (selectedSeats.has(seatId)) {
            selectedSeats.delete(seatId);
            seat.classList.remove('selected');
        } else {
            selectedSeats.add(seatId);
            seat.classList.add('selected');
        }
    } else {
        // Single select
        selectedSeats.clear();
        document.querySelectorAll('.seat.selected').forEach(s => s.classList.remove('selected'));
        selectedSeats.add(seatId);
        seat.classList.add('selected');
    }
}

// Cancel edit
function cancelEdit() {
    isEditMode = false;
    selectedSeats.clear();
    updateEditModeUI();
    displaySeatMap();
}

// Save seat map
function saveSeatMap() {
    if (!seatMapData) return;
    
    // Update seat map data from DOM
    const seatElements = document.querySelectorAll('.seat');
    seatElements.forEach(seatEl => {
        const seatId = seatEl.dataset.seatId;
        const rowLabel = seatEl.dataset.row;
        const seatNumber = parseInt(seatEl.dataset.number);
        
        // Find seat in data
        const row = seatMapData.find(r => r.label === rowLabel);
        if (row) {
            const seat = row.seats.find(s => s.number === seatNumber);
            if (seat) {
                seat.type = seatEl.dataset.type;
                seat.status = seatEl.dataset.status;
            }
        }
    });
    
    // Simulate API call
    setTimeout(() => {
        alert('Lưu sơ đồ ghế thành công!');
        isEditMode = false;
        selectedSeats.clear();
        updateEditModeUI();
        displaySeatMap();
    }, 500);
}

// Initialize modals
function initializeModals() {
    const addRowBtn = document.getElementById('addRowBtn');
    const addRowModal = document.getElementById('addRowModal');
    const closeAddRowModal = document.getElementById('closeAddRowModal');
    const cancelAddRowBtn = document.getElementById('cancelAddRowBtn');
    const confirmAddRowBtn = document.getElementById('confirmAddRowBtn');
    
    if (addRowBtn) {
        addRowBtn.addEventListener('click', () => {
            if (!isEditMode) {
                alert('Vui lòng bật chế độ chỉnh sửa trước');
                return;
            }
            if (addRowModal) {
                addRowModal.style.display = 'flex';
            }
        });
    }
    
    if (closeAddRowModal) {
        closeAddRowModal.addEventListener('click', () => {
            if (addRowModal) {
                addRowModal.style.display = 'none';
            }
        });
    }
    
    if (cancelAddRowBtn) {
        cancelAddRowBtn.addEventListener('click', () => {
            if (addRowModal) {
                addRowModal.style.display = 'none';
            }
        });
    }
    
    if (confirmAddRowBtn) {
        confirmAddRowBtn.addEventListener('click', addRow);
    }
    
    // Close when clicking outside
    if (addRowModal) {
        addRowModal.addEventListener('click', (e) => {
            if (e.target === addRowModal) {
                addRowModal.style.display = 'none';
            }
        });
    }
}

// Add row
function addRow() {
    const rowLabel = document.getElementById('rowLabel').value.trim().toUpperCase();
    const rowSeats = parseInt(document.getElementById('rowSeats').value);
    const rowType = document.getElementById('rowType').value;
    
    if (!rowLabel || rowLabel.length !== 1) {
        alert('Tên hàng phải là 1 ký tự (A-Z)');
        return;
    }
    
    if (!rowSeats || rowSeats < 1) {
        alert('Số ghế phải lớn hơn 0');
        return;
    }
    
    // Check if row label already exists
    if (seatMapData.some(r => r.label === rowLabel)) {
        alert('Hàng này đã tồn tại');
        return;
    }
    
    // Create new row
    const seats = [];
    for (let i = 0; i < rowSeats; i++) {
        seats.push({
            id: `${rowLabel}${i + 1}`,
            number: i + 1,
            type: rowType,
            status: 'available'
        });
    }
    
    seatMapData.push({
        label: rowLabel,
        seats: seats
    });
    
    // Sort rows by label
    seatMapData.sort((a, b) => a.label.localeCompare(b.label));
    
    // Close modal
    document.getElementById('addRowModal').style.display = 'none';
    
    // Clear form
    document.getElementById('rowLabel').value = '';
    document.getElementById('rowSeats').value = '10';
    document.getElementById('rowType').value = 'normal';
    
    // Refresh display
    displaySeatMap();
}

// Initialize tool buttons
document.addEventListener('DOMContentLoaded', function() {
    const removeRowBtn = document.getElementById('removeRowBtn');
    const toggleSeatTypeBtn = document.getElementById('toggleSeatTypeBtn');
    const clearSeatBtn = document.getElementById('clearSeatBtn');
    
    if (removeRowBtn) {
        removeRowBtn.addEventListener('click', removeSelectedRow);
    }
    
    if (toggleSeatTypeBtn) {
        toggleSeatTypeBtn.addEventListener('click', toggleSeatType);
    }
    
    if (clearSeatBtn) {
        clearSeatBtn.addEventListener('click', clearSelectedSeats);
    }
});

// Remove selected row
function removeSelectedRow() {
    if (selectedSeats.size === 0) {
        alert('Vui lòng chọn ít nhất một ghế trong hàng cần xóa');
        return;
    }
    
    if (!confirm('Bạn có chắc chắn muốn xóa hàng ghế này?')) {
        return;
    }
    
    // Get row labels from selected seats
    const rowLabels = new Set();
    selectedSeats.forEach(seatId => {
        const seat = document.querySelector(`[data-seat-id="${seatId}"]`);
        if (seat) {
            rowLabels.add(seat.dataset.row);
        }
    });
    
    // Remove rows
    rowLabels.forEach(label => {
        const index = seatMapData.findIndex(r => r.label === label);
        if (index !== -1) {
            seatMapData.splice(index, 1);
        }
    });
    
    selectedSeats.clear();
    displaySeatMap();
}

// Toggle seat type
function toggleSeatType() {
    if (selectedSeats.size === 0) {
        alert('Vui lòng chọn ghế để đổi loại');
        return;
    }
    
    selectedSeats.forEach(seatId => {
        const seat = document.querySelector(`[data-seat-id="${seatId}"]`);
        if (seat && seat.dataset.status !== 'disabled') {
            const currentType = seat.dataset.type;
            const newType = currentType === 'normal' ? 'vip' : 'normal';
            
            seat.dataset.type = newType;
            seat.className = `seat ${newType} ${seat.dataset.status} edit-mode selected`;
        }
    });
}

// Clear selected seats
function clearSelectedSeats() {
    if (selectedSeats.size === 0) {
        alert('Vui lòng chọn ghế để vô hiệu hóa');
        return;
    }
    
    selectedSeats.forEach(seatId => {
        const seat = document.querySelector(`[data-seat-id="${seatId}"]`);
        if (seat) {
            seat.dataset.status = 'disabled';
            seat.className = `seat ${seat.dataset.type} disabled edit-mode selected`;
        }
    });
}
