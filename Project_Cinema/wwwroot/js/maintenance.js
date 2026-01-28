// Maintenance Page Functionality

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    displayMaintenanceTime();
    animateProgress();
});

// Display maintenance time
function displayMaintenanceTime() {
    const maintenanceTimeElement = document.getElementById('maintenanceTime');
    
    if (maintenanceTimeElement) {
        const now = new Date();
        const endTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
        
        const startTimeStr = now.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const endTimeStr = endTime.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        maintenanceTimeElement.textContent = `${startTimeStr} - ${endTimeStr}`;
    }
}

// Animate progress bar
function animateProgress() {
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    
    if (!progressFill || !progressPercent) return;
    
    let progress = 0;
    const targetProgress = 65; // Simulate 65% progress
    const duration = 3000; // 3 seconds
    const startTime = Date.now();
    
    function updateProgress() {
        const elapsed = Date.now() - startTime;
        const progressValue = Math.min((elapsed / duration) * targetProgress, targetProgress);
        
        progressFill.style.width = progressValue + '%';
        progressPercent.textContent = Math.round(progressValue) + '%';
        
        if (progressValue < targetProgress) {
            requestAnimationFrame(updateProgress);
        } else {
            // Continue slowly after reaching target
            const slowProgress = setInterval(() => {
                if (progress < 90) {
                    progress += 0.1;
                    progressFill.style.width = progress + '%';
                    progressPercent.textContent = Math.round(progress) + '%';
                } else {
                    clearInterval(slowProgress);
                }
            }, 500);
        }
    }
    
    updateProgress();
}
