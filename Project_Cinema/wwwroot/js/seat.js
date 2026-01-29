// Seat Selection Page Functionality

// Data injected from server (Seat/Index)
const seatData = window.__seatData || { rows: [] };

// Selected seat codes
let selectedSeats = [];
// Map: seatCode -> DOM element
let seatMap = {};

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    generateSeatMap();
    updateSummary();
    startTimer();

    // Resume after login (avoid GET /Seat/Hold -> 405)
    const params = new URLSearchParams(window.location.search);
    const shouldResume = params.get('resume') === '1';
    const isAuth = !!window.__isAuthenticated;
    if (shouldResume && isAuth) {
        try {
            const raw = sessionStorage.getItem('pendingSeatSelection');
            if (raw) {
                const pending = JSON.parse(raw);
                const showtimeId = (seatData && seatData.showtimeId) ? seatData.showtimeId : null;
                if (pending && pending.showtimeId && pending.showtimeId === showtimeId && Array.isArray(pending.codes)) {
                    pending.codes.forEach(code => {
                        if (seatMap[code] && !seatMap[code].disabled) {
                            toggleSeat(code);
                        }
                    });
                    // Auto submit if we have seats
                    if (selectedSeats.length > 0) {
                        continueToPayment();
                    }
                }
            }
        } catch {
            // ignore
        }
    }
});

// Generate seat map
function generateSeatMap() {
    const seatMapContainer = document.getElementById('seatMap');
    seatMapContainer.innerHTML = '';
    
    const rows = (seatData.rows || []);
    rows.forEach((rowObj) => {
        const row = rowObj.row;
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

        const seats = rowObj.seats || [];
        seats.forEach((seatObj) => {
            const seatCode = seatObj.code;
            const seatDbId = seatObj.seatId;
            const seatNum = seatObj.number;
            const isOccupied = !!seatObj.isUnavailable;
            const seatType = (seatObj.seatType || 'regular');
            const price = Number(seatObj.price || 0);

            // Add aisle spacing like template (after 6 seats)
            if (seatNum === 7) {
                const aisle = document.createElement('div');
                aisle.className = 'aisle';
                seatsContainer.appendChild(aisle);
            }

            const seat = document.createElement('button');
            seat.className = 'seat';
            seat.dataset.seatId = seatCode; // keep template naming
            seat.dataset.seatDbId = String(seatDbId);
            seat.dataset.row = row;
            seat.dataset.number = seatNum;
            seat.textContent = seatNum;
            
            if (isOccupied) {
                seat.classList.add('occupied');
                seat.disabled = true;
            } else {
                if (seatType === 'vip' || seatType === 'couple') {
                    seat.classList.add('vip');
                    seat.dataset.originalType = 'vip';
                } else {
                    seat.classList.add('available');
                    seat.dataset.originalType = 'available';
                }
                seat.dataset.price = String(price);
            }
            
            seat.addEventListener('click', function() {
                toggleSeat(seatCode);
            });
            
            seatsContainer.appendChild(seat);
            seatMap[seatCode] = seat;
        });
        
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

    // If not logged in: store selection then go to login with returnUrl back to Seat/Index
    const isAuth = !!window.__isAuthenticated;
    if (!isAuth) {
        try {
            sessionStorage.setItem('pendingSeatSelection', JSON.stringify({
                showtimeId: seatData.showtimeId,
                codes: selectedSeats
            }));
        } catch {
            // ignore
        }
        if (window.__loginUrl) {
            window.location.href = window.__loginUrl;
            return;
        }
    }

    const form = document.getElementById('holdForm');
    const container = document.getElementById('selectedSeatInputs');
    if (!form || !container) return;

    container.innerHTML = '';
    selectedSeats.forEach(code => {
        const btn = seatMap[code];
        const dbId = btn?.dataset?.seatDbId;
        if (!dbId) return;

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'SelectedSeatIds';
        input.value = dbId;
        container.appendChild(input);
    });

    // clear pending selection on success path
    try { sessionStorage.removeItem('pendingSeatSelection'); } catch { }
    form.submit();
}

// Start timer for seat holding
function startTimer() {
    let timeLeft = 600; // 10 minutes in seconds
    
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
