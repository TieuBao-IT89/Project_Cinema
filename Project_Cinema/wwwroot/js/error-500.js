// Error 500 Page Functionality

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    displayErrorTime();
});

// Display current error time
function displayErrorTime() {
    const errorTimeElement = document.getElementById('errorTime');
    
    if (errorTimeElement) {
        const now = new Date();
        const dateString = now.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const timeString = now.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        
        errorTimeElement.textContent = `${dateString} ${timeString}`;
    }
}
