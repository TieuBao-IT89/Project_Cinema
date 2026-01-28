// Seat Selection Page Functionality

// Seat configuration
const seatConfig = {
    rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
    seatsPerRow: 12,
    vipRows: ['A', 'B'],
    occupiedSeats: [
        'A1', 'A2', 'A3', 'B5', 'B6', 'C10', 'C11', 'C12',
        'D3', 'D4', 'E7', 'E8', 'F1', 'F2', 'G9', 'G10',
        'H4', 'H5', 'I11', 'I12', 'J6', 'J7', 'K2', 'K3',
        'L8', 'L9'
    ],
    regularPrice: 150000,
    vipPrice: 250000
};

let selectedSeats = [];
let seatMap = {};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadBookingData();
    generateSeatMap();
    updateSummary();
    startTimer();
});

// Load booking data from sessionStorage
function loadBookingData() {
    const bookingData = sessionStorage.getItem('bookingData');
    if (bookingData) {
        const data = JSON.parse(bookingData);
        updateShowtimeInfo(data);
    }
}

// Update showtime information
function updateShowtimeInfo(data) {
    if (data.movie) {
        document.getElementById('info-movie').textContent = data.movie;
        document.getElementById('summary-movie-seat').textContent = data.movie;
    }
    if (data.cinema) {
        document.getElementById('info-cinema').textContent = data.cinema;
        document.getElementById('summary-cinema-seat').textContent = data.cinema;
    }
    if (data.date) {
        document.getElementById('info-date').textContent = data.date;
    }
    if (data.time) {
        document.getElementById('info-time').textContent = data.time;
        const showtimeText = `${data.time} - ${data.date}`;
        document.getElementById('summary-showtime-seat').textContent = showtimeText;
    }
    if (data.format) {
        // Format info can be used if needed
    }
}

// Generate seat map
function generateSeatMap() {
    const seatMapContainer = document.getElementById('seatMap');
    seatMapContainer.innerHTML = '';
    
    seatConfig.rows.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'seat-row';
        
        // Row label
        const rowLabel = document.createElement('div');
        rowLabel.className = 'row-label';
        rowLabel.textContent = row;
        rowDiv.appendChild(rowLabel);
        
        // Seats container
        const seatsContainer = document.createElement('div');
        seatsContainer.className = 'seats-in-row';
        
        for (let seatNum = 1; seatNum <= seatConfig.seatsPerRow; seatNum++) {
            const seatId = `${row}${seatNum}`;
            const isOccupied = seatConfig.occupiedSeats.includes(seatId);
            const isVip = seatConfig.vipRows.includes(row);
            
            // Add aisle spacing
            if (seatNum === 7) {
                const aisle = document.createElement('div');
                aisle.className = 'aisle';
                seatsContainer.appendChild(aisle);
            }
            
            const seat = document.createElement('button');
            seat.className = 'seat';
            seat.dataset.seatId = seatId;
            seat.dataset.row = row;
            seat.dataset.number = seatNum;
            seat.textContent = seatNum;
            
            if (isOccupied) {
                seat.classList.add('occupied');
                seat.disabled = true;
            } else if (isVip) {
                seat.classList.add('vip');
                seat.dataset.price = seatConfig.vipPrice;
                seat.dataset.originalType = 'vip';
            } else {
                seat.classList.add('available');
                seat.dataset.price = seatConfig.regularPrice;
                seat.dataset.originalType = 'available';
            }
            
            seat.addEventListener('click', function() {
                toggleSeat(seatId);
            });
            
            seatsContainer.appendChild(seat);
            seatMap[seatId] = seat;
        }
        
        rowDiv.appendChild(seatsContainer);
        seatMapContainer.appendChild(rowDiv);
    });
}

// Toggle seat selection
function toggleSeat(seatId) {
    const seat = seatMap[seatId];
    if (!seat || seat.classList.contains('occupied') || seat.disabled) {
        return;
    }
    
    const index = selectedSeats.indexOf(seatId);
    
    if (index > -1) {
        // Deselect seat - restore to original state
        selectedSeats.splice(index, 1);
        seat.classList.remove('selected');
        
        // Restore original type (available or vip)
        const originalType = seat.dataset.originalType;
        if (originalType === 'vip') {
            seat.classList.add('vip');
        } else {
            seat.classList.add('available');
        }
    } else {
        // Select seat
        selectedSeats.push(seatId);
        seat.classList.add('selected');
        seat.classList.remove('available', 'vip');
    }
    
    updateSummary();
    updateContinueButton();
}

// Update summary
function updateSummary() {
    const selectedSeatsList = document.getElementById('selectedSeatsList');
    const ticketCount = document.getElementById('ticket-count');
    const totalPrice = document.getElementById('total-price');
    
    // Clear current list
    selectedSeatsList.innerHTML = '';
    
    if (selectedSeats.length === 0) {
        selectedSeatsList.innerHTML = '<p class="no-seats">Chưa chọn ghế</p>';
        ticketCount.textContent = '0';
        totalPrice.textContent = '0đ';
        return;
    }
    
    // Display selected seats
    let total = 0;
    selectedSeats.forEach(seatId => {
        const seat = seatMap[seatId];
        const price = parseInt(seat.dataset.price);
        total += price;
        
        const badge = document.createElement('div');
        badge.className = 'seat-badge';
        badge.innerHTML = `
            ${seatId}
            <span class="remove-seat" onclick="removeSeat('${seatId}')" title="Bỏ chọn">
                <i class="fas fa-times"></i>
            </span>
        `;
        selectedSeatsList.appendChild(badge);
    });
    
    ticketCount.textContent = selectedSeats.length;
    totalPrice.textContent = formatPrice(total);
}

// Remove seat
function removeSeat(seatId) {
    toggleSeat(seatId);
}

// Update continue button
function updateContinueButton() {
    const continueBtn = document.getElementById('continuePaymentBtn');
    if (continueBtn) {
        continueBtn.disabled = selectedSeats.length === 0;
    }
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

// Continue to payment
function continueToPayment() {
    if (selectedSeats.length === 0) {
        alert('Vui lòng chọn ít nhất một ghế!');
        return;
    }
    
    // Prepare booking data
    const bookingData = {
        movie: document.getElementById('summary-movie-seat').textContent,
        showtime: document.getElementById('summary-showtime-seat').textContent,
        cinema: document.getElementById('summary-cinema-seat').textContent,
        room: document.getElementById('summary-room-seat').textContent,
        seats: selectedSeats,
        ticketCount: selectedSeats.length,
        totalPrice: document.getElementById('total-price').textContent
    };
    
    // Store in sessionStorage
    sessionStorage.setItem('seatSelection', JSON.stringify(bookingData));
    
    // Redirect to payment page (if exists)
    // window.location.href = 'payment.html';
    alert('Chuyển đến trang thanh toán...\n\n' + JSON.stringify(bookingData, null, 2));
}

// Start timer for seat holding
function startTimer() {
    let timeLeft = 300; // 5 minutes in seconds
    
    const timerInterval = setInterval(function() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        // Update timer display if element exists
        const timerElement = document.getElementById('seatTimer');
        if (timerElement) {
            timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('Hết thời gian giữ ghế. Vui lòng chọn lại!');
            // Optionally redirect back
            // window.location.href = 'showtime.html';
        }
        
        timeLeft--;
    }, 1000);
}
