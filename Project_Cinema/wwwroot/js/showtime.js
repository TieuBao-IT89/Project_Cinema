// Showtime Page Functionality

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeDates();
    setMinDate();
    updateSummary();

    const filterForm = document.getElementById('showtimeFilterForm');
    const movieFilter = document.getElementById('movie-filter');
    const cinemaFilter = document.getElementById('cinema-filter');
    const dateFilter = document.getElementById('date-filter');

    if (filterForm) {
        if (movieFilter) {
            movieFilter.addEventListener('change', function () {
                filterForm.submit();
            });
        }
        if (cinemaFilter) {
            cinemaFilter.addEventListener('change', function () {
                filterForm.submit();
            });
        }
        if (dateFilter) {
            dateFilter.addEventListener('change', function () {
                filterForm.submit();
            });
        }
    }

    // Highlight correct date tab if server selected a date
    syncDateTabsWithInput();

    // Keep selection when user navigates back from Seat page
    restoreSelectionFromSession();

    // Auto-scroll to selected cinema (or selected showtime)
    autoScrollToSelectedCinema();
});

// Initialize date tabs
function initializeDates() {
    const today = new Date();
    const dates = [];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
    }
    
    // Set today
    const todayElement = document.getElementById('date-today');
    if (todayElement) {
        todayElement.textContent = formatDateShort(dates[0]);
    }
    
    // Set tomorrow
    const tomorrowElement = document.getElementById('date-tomorrow');
    if (tomorrowElement) {
        tomorrowElement.textContent = formatDateShort(dates[1]);
    }
    
    // Set other days
    for (let i = 2; i < 7; i++) {
        const dayElement = document.getElementById(`date-day${i + 1}`);
        if (dayElement) {
            dayElement.textContent = formatDateShort(dates[i]);
        }
    }
    
    // Set date filter to today if empty
    const dateFilter = document.getElementById('date-filter');
    if (dateFilter && !dateFilter.value) {
        dateFilter.value = formatDateInput(dates[0]);
    }
}

function syncDateTabsWithInput() {
    const dateFilter = document.getElementById('date-filter');
    if (!dateFilter || !dateFilter.value) return;

    const selected = new Date(dateFilter.value + "T00:00:00");
    if (Number.isNaN(selected.getTime())) return;

    const today = new Date();
    const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffDays = Math.round((selected.getTime() - base.getTime()) / 86400000);

    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.date-tab');
    tabs.forEach(tab => tab.classList.remove('active'));

    let key = 'today';
    if (diffDays === 1) key = 'tomorrow';
    else if (diffDays >= 2 && diffDays <= 6) key = `day${diffDays + 1}`;

    const selectedTab = document.querySelector(`[data-date="${key}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    updateSummaryDate(selected);
}

// Format date for display (short)
function formatDateShort(date) {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${dayName} ${day}/${month}`;
}

// Format date for input
function formatDateInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Format date for display (full)
function formatDateFull(date) {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${dayName}, ${day}/${month}/${year}`;
}

// Set minimum date for date picker
function setMinDate() {
    const dateInput = document.getElementById('date-filter');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }
}

// Select date from tabs
function selectDate(dateType) {
    // Remove active class from all tabs
    const tabs = document.querySelectorAll('.date-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Add active class to selected tab
    const selectedTab = document.querySelector(`[data-date="${dateType}"]`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Calculate selected date
    const today = new Date();
    let selectedDate = new Date(today);
    
    if (dateType === 'today') {
        selectedDate = today;
    } else if (dateType === 'tomorrow') {
        selectedDate.setDate(today.getDate() + 1);
    } else {
        const dayIndex = parseInt(dateType.replace('day', '')) - 1;
        selectedDate.setDate(today.getDate() + dayIndex);
    }
    
    // Update date filter
    const dateFilter = document.getElementById('date-filter');
    if (dateFilter) {
        dateFilter.value = formatDateInput(selectedDate);
    }
    
    // Update summary
    updateSummaryDate(selectedDate);
    
    // Filter showtimes or submit filter form
    const filterForm = document.getElementById('showtimeFilterForm');
    if (filterForm) {
        filterForm.submit();
        return;
    }
    filterShowtimes();
}

// Select showtime
function selectShowtime(element) {
    // Remove selected class from all slots
    const allSlots = document.querySelectorAll('.time-slot-card');
    allSlots.forEach(slot => slot.classList.remove('selected'));
    
    // Add selected class to clicked slot
    element.classList.add('selected');
    
    // Get showtime data
    const time = element.dataset.time;
    const price = element.dataset.price;
    const format = element.closest('.format-group-card').querySelector('.format-name').textContent;
    const theaterCard = element.closest('.theater-showtime-card');
    const theaterName = theaterCard.querySelector('.theater-name-card').textContent.trim();
    const theaterAddress = theaterCard.querySelector('.theater-address-card').textContent.trim();
    
    // Update summary
    updateSummaryShowtime(time, format, price, theaterName, theaterAddress);
    
    // Show cinema info
    showCinemaInfo(theaterName, theaterAddress);
    
    // Enable continue button
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        continueBtn.disabled = false;
    }
}

// Pick and go directly to seats
function pickShowtimeAndGo(element) {
    selectShowtime(element);

    const showtimeId = element.dataset.showtimeId;
    if (!showtimeId) return false;

    const bookingData = {
        movie: document.getElementById('summary-movie')?.textContent || '',
        cinema: document.getElementById('summary-cinema')?.textContent || '',
        date: document.getElementById('summary-date')?.textContent || '',
        time: document.getElementById('summary-time')?.textContent || '',
        format: document.getElementById('summary-format')?.textContent || '',
        price: document.getElementById('summary-price')?.textContent || '',
        showtimeId
    };
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

    window.location.href = `/Seat/Index?showtimeId=${showtimeId}`;
    return false;
}

function restoreSelectionFromSession() {
    try {
        const raw = sessionStorage.getItem('bookingData');
        if (!raw) return;
        const data = JSON.parse(raw);
        const showtimeId = data?.showtimeId;
        if (!showtimeId) return;

        const el = document.querySelector(`.time-slot-card[data-showtime-id="${showtimeId}"]`);
        if (!el) return;

        // Only restore if the slot exists on this page (same filters/date/movie)
        selectShowtime(el);

        // Enable continue
        const continueBtn = document.getElementById('continueBtn');
        if (continueBtn) continueBtn.disabled = false;
    } catch {
        // ignore
    }
}

function autoScrollToSelectedCinema() {
    const cinemaFilter = document.getElementById('cinema-filter');
    const selectedCinemaId = cinemaFilter?.value;

    // Prefer selected showtime in session (more precise)
    try {
        const raw = sessionStorage.getItem('bookingData');
        if (raw) {
            const data = JSON.parse(raw);
            if (data?.showtimeId) {
                const slot = document.querySelector(`.time-slot-card[data-showtime-id="${data.showtimeId}"]`);
                if (slot && slot.scrollIntoView) {
                    setTimeout(() => slot.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
                    return;
                }
            }
        }
    } catch { }

    if (!selectedCinemaId) return;
    const theater = document.querySelector(`.theater-showtime-card[data-cinema="${selectedCinemaId}"]`);
    if (!theater || !theater.scrollIntoView) return;
    setTimeout(() => theater.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
}

// Update summary
function updateSummary() {
    // Movie is already set by server
    const summaryMovie = document.getElementById('summary-movie');
    if (summaryMovie && !summaryMovie.textContent.trim()) {
        summaryMovie.textContent = 'Avengers: Endgame';
    }
    
    // Set default date
    const today = new Date();
    updateSummaryDate(today);
}

// Update summary date
function updateSummaryDate(date) {
    const summaryDate = document.getElementById('summary-date');
    if (summaryDate) {
        summaryDate.textContent = formatDateFull(date);
    }
}

// Update summary showtime
function updateSummaryShowtime(time, format, price, theaterName, theaterAddress) {
    const summaryCinema = document.getElementById('summary-cinema');
    const summaryTime = document.getElementById('summary-time');
    const summaryFormat = document.getElementById('summary-format');
    const summaryPrice = document.getElementById('summary-price');
    
    if (summaryCinema) {
        summaryCinema.textContent = theaterName;
    }
    if (summaryTime) {
        summaryTime.textContent = time;
    }
    if (summaryFormat) {
        summaryFormat.textContent = format;
    }
    if (summaryPrice) {
        summaryPrice.textContent = formatPrice(price);
    }
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

// Show cinema info
function showCinemaInfo(name, address) {
    const cinemaInfoCard = document.getElementById('cinemaInfoCard');
    const cinemaNameInfo = document.getElementById('cinemaNameInfo');
    const cinemaAddressInfo = document.getElementById('cinemaAddressInfo');
    
    if (cinemaInfoCard) {
        cinemaInfoCard.style.display = 'block';
    }
    if (cinemaNameInfo) {
        cinemaNameInfo.textContent = name;
    }
    if (cinemaAddressInfo) {
        cinemaAddressInfo.textContent = address;
    }
}

// Filter showtimes
function filterShowtimes() {
    const cinemaFilter = document.getElementById('cinema-filter').value;
    const dateFilter = document.getElementById('date-filter').value;
    
    const theaterCards = document.querySelectorAll('.theater-showtime-card');
    
    theaterCards.forEach(card => {
        let shouldShow = true;
        
        // Filter by cinema
        if (cinemaFilter && card.dataset.cinema !== cinemaFilter) {
            shouldShow = false;
        }
        
        if (shouldShow) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Continue to seats selection
function continueToSeats() {
    const selectedSlot = document.querySelector('.time-slot-card.selected');
    
    if (!selectedSlot) {
        alert('Vui lòng chọn suất chiếu!');
        return;
    }

    const showtimeId = selectedSlot.dataset.showtimeId;
    if (!showtimeId) {
        alert('Không tìm thấy suất chiếu hợp lệ!');
        return;
    }
    
    // Get all booking data
    const bookingData = {
        movie: document.getElementById('summary-movie').textContent,
        cinema: document.getElementById('summary-cinema').textContent,
        date: document.getElementById('summary-date').textContent,
        time: document.getElementById('summary-time').textContent,
        format: document.getElementById('summary-format').textContent,
        price: document.getElementById('summary-price').textContent,
        showtimeId
    };
    
    // Store in sessionStorage
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    // Redirect to seats page
    window.location.href = `/Seat/Index?showtimeId=${showtimeId}`;
}
