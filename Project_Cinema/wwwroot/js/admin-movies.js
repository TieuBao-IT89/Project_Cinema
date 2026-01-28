// Admin Movies Management Functionality

// Global variables
let allMovies = [];
let filteredMovies = [];
let currentPage = 1;
let itemsPerPage = 10;
let editingMovieId = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadMovies();
    initializeModal();
    initializeSearchAndFilters();
    initializePagination();
});

// Load movies from mock data
function loadMovies() {
    // Mock movies data
    allMovies = [
        {
            id: 1,
            name: 'Avengers: Endgame',
            category: 'action',
            categoryName: 'Hành động',
            duration: 181,
            releaseDate: '2024-01-15',
            country: 'Mỹ',
            status: 'now-showing',
            statusName: 'Đang chiếu',
            poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300',
            trailer: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
            description: 'Các siêu anh hùng Avengers tham gia trận chiến cuối cùng với Thanos.'
        },
        {
            id: 2,
            name: 'Spider-Man: No Way Home',
            category: 'action',
            categoryName: 'Hành động',
            duration: 148,
            releaseDate: '2024-01-10',
            country: 'Mỹ',
            status: 'now-showing',
            statusName: 'Đang chiếu',
            poster: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=300',
            trailer: 'https://www.youtube.com/watch?v=JfVOs4VSpmA',
            description: 'Peter Parker phải đối mặt với hậu quả khi danh tính của anh bị lộ.'
        },
        {
            id: 3,
            name: 'Black Panther: Wakanda Forever',
            category: 'action',
            categoryName: 'Hành động',
            duration: 161,
            releaseDate: '2024-02-01',
            country: 'Mỹ',
            status: 'coming-soon',
            statusName: 'Sắp chiếu',
            poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=300',
            trailer: 'https://www.youtube.com/watch?v=_Z3QKkl1WyM',
            description: 'Wakanda đối mặt với thế giới sau cái chết của Vua T\'Challa.'
        },
        {
            id: 4,
            name: 'Avatar: The Way of Water',
            category: 'sci-fi',
            categoryName: 'Khoa học viễn tưởng',
            duration: 192,
            releaseDate: '2024-01-20',
            country: 'Mỹ',
            status: 'now-showing',
            statusName: 'Đang chiếu',
            poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300',
            trailer: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
            description: 'Jake và Neytiri cùng gia đình khám phá đại dương Pandora.'
        },
        {
            id: 5,
            name: 'The Matrix Resurrections',
            category: 'sci-fi',
            categoryName: 'Khoa học viễn tưởng',
            duration: 148,
            releaseDate: '2024-01-05',
            country: 'Mỹ',
            status: 'now-showing',
            statusName: 'Đang chiếu',
            poster: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300',
            trailer: 'https://www.youtube.com/watch?v=9ix7TUGVYIo',
            description: 'Neo quay lại Matrix để tìm hiểu sự thật về thực tại.'
        },
        {
            id: 6,
            name: 'Dune',
            category: 'sci-fi',
            categoryName: 'Khoa học viễn tưởng',
            duration: 155,
            releaseDate: '2024-02-15',
            country: 'Mỹ',
            status: 'coming-soon',
            statusName: 'Sắp chiếu',
            poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300',
            trailer: 'https://www.youtube.com/watch?v=8g18jFHCLXk',
            description: 'Cuộc phiêu lưu của Paul Atreides trên hành tinh Arrakis.'
        },
        {
            id: 7,
            name: 'Top Gun: Maverick',
            category: 'action',
            categoryName: 'Hành động',
            duration: 130,
            releaseDate: '2024-01-25',
            country: 'Mỹ',
            status: 'now-showing',
            statusName: 'Đang chiếu',
            poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300',
            trailer: 'https://www.youtube.com/watch?v=giXco2jaZ_4',
            description: 'Maverick đào tạo thế hệ phi công mới cho nhiệm vụ nguy hiểm.'
        },
        {
            id: 8,
            name: 'Everything Everywhere All at Once',
            category: 'comedy',
            categoryName: 'Hài',
            duration: 139,
            releaseDate: '2024-01-12',
            country: 'Mỹ',
            status: 'now-showing',
            statusName: 'Đang chiếu',
            poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=300',
            trailer: 'https://www.youtube.com/watch?v=wxN1T1uxQ2g',
            description: 'Một người phụ nữ phải kết nối với các phiên bản của mình trong đa vũ trụ.'
        },
        {
            id: 9,
            name: 'The Batman',
            category: 'action',
            categoryName: 'Hành động',
            duration: 176,
            releaseDate: '2024-02-20',
            country: 'Mỹ',
            status: 'coming-soon',
            statusName: 'Sắp chiếu',
            poster: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=300',
            trailer: 'https://www.youtube.com/watch?v=mqqft2x_Aa4',
            description: 'Batman điều tra một loạt vụ giết người bí ẩn ở Gotham City.'
        },
        {
            id: 10,
            name: 'Guardians of the Galaxy Vol. 3',
            category: 'sci-fi',
            categoryName: 'Khoa học viễn tưởng',
            duration: 150,
            releaseDate: '2024-01-30',
            country: 'Mỹ',
            status: 'now-showing',
            statusName: 'Đang chiếu',
            poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300',
            trailer: 'https://www.youtube.com/watch?v=u3V5KDHRQvk',
            description: 'Guardians bảo vệ Rocket khỏi kẻ thù từ quá khứ.'
        },
        {
            id: 11,
            name: 'Doctor Strange in the Multiverse of Madness',
            category: 'sci-fi',
            categoryName: 'Khoa học viễn tưởng',
            duration: 126,
            releaseDate: '2024-02-10',
            country: 'Mỹ',
            status: 'coming-soon',
            statusName: 'Sắp chiếu',
            poster: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=300',
            trailer: 'https://www.youtube.com/watch?v=aWzlQ2N6qqg',
            description: 'Doctor Strange khám phá đa vũ trụ với Wanda Maximoff.'
        },
        {
            id: 12,
            name: 'Jurassic World Dominion',
            category: 'action',
            categoryName: 'Hành động',
            duration: 147,
            releaseDate: '2024-01-18',
            country: 'Mỹ',
            status: 'now-showing',
            statusName: 'Đang chiếu',
            poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300',
            trailer: 'https://www.youtube.com/watch?v=fb5ELWi-ekk',
            description: 'Khủng long sống cùng con người trên toàn thế giới.'
        }
    ];

    filteredMovies = [...allMovies];
    displayMovies();
    updatePagination();
}

// Initialize modal
function initializeModal() {
    const addBtn = document.getElementById('addMovieBtn');
    const modal = document.getElementById('movieModal');
    const closeBtn = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const form = document.getElementById('movieForm');

    if (addBtn && modal) {
        addBtn.addEventListener('click', () => openModal());
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => closeModal());
    }

    if (cancelBtn && modal) {
        cancelBtn.addEventListener('click', () => closeModal());
    }

    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Handle form submission
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Initialize delete modal
    initializeDeleteModal();
}

// Initialize delete modal
function initializeDeleteModal() {
    const deleteModal = document.getElementById('deleteModal');
    const closeDeleteBtn = document.getElementById('closeDeleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    if (closeDeleteBtn && deleteModal) {
        closeDeleteBtn.addEventListener('click', () => {
            deleteModal.style.display = 'none';
        });
    }

    if (cancelDeleteBtn && deleteModal) {
        cancelDeleteBtn.addEventListener('click', () => {
            deleteModal.style.display = 'none';
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
    const searchInput = document.getElementById('movieSearch');
    const statusFilter = document.getElementById('statusFilter');
    const categoryFilter = document.getElementById('categoryFilter');

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', applyFilters);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
}

// Apply filters
function applyFilters() {
    const searchValue = document.getElementById('movieSearch').value.trim().toLowerCase();
    const statusValue = document.getElementById('statusFilter').value;
    const categoryValue = document.getElementById('categoryFilter').value;

    filteredMovies = allMovies.filter(movie => {
        // Search filter
        if (searchValue && !movie.name.toLowerCase().includes(searchValue)) {
            return false;
        }

        // Status filter
        if (statusValue !== 'all' && movie.status !== statusValue) {
            return false;
        }

        // Category filter
        if (categoryValue !== 'all' && movie.category !== categoryValue) {
            return false;
        }

        return true;
    });

    currentPage = 1;
    displayMovies();
    updatePagination();
}

// Display movies
function displayMovies() {
    const tbody = document.getElementById('moviesTableBody');
    const emptyState = document.getElementById('emptyState');

    if (!tbody) return;

    if (filteredMovies.length === 0) {
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
    const moviesToShow = filteredMovies.slice(startIndex, endIndex);

    tbody.innerHTML = moviesToShow.map(movie => `
        <tr>
            <td>
                <img src="${movie.poster}" alt="${movie.name}" class="movie-poster" onerror="this.src='https://via.placeholder.com/70x100?text=No+Image'">
            </td>
            <td>
                <div class="movie-name">${movie.name}</div>
            </td>
            <td>
                <span class="movie-category">${movie.categoryName}</span>
            </td>
            <td class="movie-duration">${movie.duration} phút</td>
            <td class="movie-release">${formatDate(movie.releaseDate)}</td>
            <td>
                <span class="status-badge ${movie.status}">${movie.statusName}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn btn-edit" onclick="editMovie(${movie.id})" title="Sửa">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-delete" onclick="confirmDeleteMovie(${movie.id})" title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                    <a href="movie-details.html?id=${movie.id}" class="action-btn btn-view" title="Xem chi tiết">
                        <i class="fas fa-eye"></i>
                    </a>
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

    const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);

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
    const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    displayMovies();
    updatePagination();

    // Scroll to top of table
    const tableWrapper = document.querySelector('.movies-table-wrapper');
    if (tableWrapper) {
        tableWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Open modal
function openModal(movieId = null) {
    const modal = document.getElementById('movieModal');
    const form = document.getElementById('movieForm');
    const modalTitle = document.getElementById('modalTitle');
    const submitBtn = document.getElementById('submitBtn');

    if (!modal || !form) return;

    editingMovieId = movieId;

    if (movieId) {
        // Edit mode
        const movie = allMovies.find(m => m.id === movieId);
        if (!movie) return;

        modalTitle.innerHTML = '<i class="fas fa-edit"></i> Sửa thông tin phim';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Cập nhật phim';

        // Fill form
        document.getElementById('movieName').value = movie.name;
        document.getElementById('movieCategory').value = movie.category;
        document.getElementById('movieDuration').value = movie.duration;
        document.getElementById('movieRelease').value = movie.releaseDate;
        document.getElementById('movieCountry').value = movie.country || '';
        document.getElementById('movieStatus').value = movie.status;
        document.getElementById('movieTrailer').value = movie.trailer || '';
        document.getElementById('moviePoster').value = movie.poster;
        document.getElementById('movieDescription').value = movie.description || '';
    } else {
        // Add mode
        modalTitle.innerHTML = '<i class="fas fa-plus"></i> Thêm phim mới';
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Lưu phim';
        form.reset();
        
        // Set default release date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('movieRelease').value = today;
    }

    modal.style.display = 'flex';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('movieModal');
    if (modal) {
        modal.style.display = 'none';
        editingMovieId = null;
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
        name: document.getElementById('movieName').value.trim(),
        category: document.getElementById('movieCategory').value,
        duration: parseInt(document.getElementById('movieDuration').value),
        releaseDate: document.getElementById('movieRelease').value,
        country: document.getElementById('movieCountry').value.trim(),
        status: document.getElementById('movieStatus').value,
        trailer: document.getElementById('movieTrailer').value.trim(),
        poster: document.getElementById('moviePoster').value.trim(),
        description: document.getElementById('movieDescription').value.trim()
    };

    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang lưu...';
    }

    // Simulate API call
    setTimeout(() => {
        if (editingMovieId) {
            // Update existing movie
            const movieIndex = allMovies.findIndex(m => m.id === editingMovieId);
            if (movieIndex !== -1) {
                const categoryNames = {
                    'action': 'Hành động',
                    'comedy': 'Hài',
                    'drama': 'Drama',
                    'horror': 'Kinh dị',
                    'romance': 'Tình cảm',
                    'sci-fi': 'Khoa học viễn tưởng',
                    'thriller': 'Giật gân',
                    'animation': 'Hoạt hình'
                };

                const statusNames = {
                    'now-showing': 'Đang chiếu',
                    'coming-soon': 'Sắp chiếu'
                };

                allMovies[movieIndex] = {
                    ...allMovies[movieIndex],
                    ...formData,
                    categoryName: categoryNames[formData.category],
                    statusName: statusNames[formData.status]
                };
            }
            alert('Cập nhật phim thành công!');
        } else {
            // Add new movie
            const categoryNames = {
                'action': 'Hành động',
                'comedy': 'Hài',
                'drama': 'Drama',
                'horror': 'Kinh dị',
                'romance': 'Tình cảm',
                'sci-fi': 'Khoa học viễn tưởng',
                'thriller': 'Giật gân',
                'animation': 'Hoạt hình'
            };

            const statusNames = {
                'now-showing': 'Đang chiếu',
                'coming-soon': 'Sắp chiếu'
            };

            const newMovie = {
                id: allMovies.length > 0 ? Math.max(...allMovies.map(m => m.id)) + 1 : 1,
                ...formData,
                categoryName: categoryNames[formData.category],
                statusName: statusNames[formData.status]
            };

            allMovies.push(newMovie);
            alert('Thêm phim mới thành công!');
        }

        // Reapply filters and refresh display
        applyFilters();

        // Close modal
        closeModal();

        // Re-enable submit button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = editingMovieId ? '<i class="fas fa-save"></i> Cập nhật phim' : '<i class="fas fa-save"></i> Lưu phim';
        }

        editingMovieId = null;
    }, 1000);
}

// Validate form
function validateForm() {
    let isValid = true;

    // Validate name
    const name = document.getElementById('movieName').value.trim();
    if (!name || name.length < 2) {
        showFieldError('nameError', 'Tên phim phải có ít nhất 2 ký tự');
        document.getElementById('movieName').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('nameError');
        document.getElementById('movieName').classList.remove('error');
    }

    // Validate category
    const category = document.getElementById('movieCategory').value;
    if (!category) {
        showFieldError('categoryError', 'Vui lòng chọn thể loại');
        document.getElementById('movieCategory').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('categoryError');
        document.getElementById('movieCategory').classList.remove('error');
    }

    // Validate duration
    const duration = parseInt(document.getElementById('movieDuration').value);
    if (!duration || duration < 1) {
        showFieldError('durationError', 'Thời lượng phải lớn hơn 0');
        document.getElementById('movieDuration').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('durationError');
        document.getElementById('movieDuration').classList.remove('error');
    }

    // Validate release date
    const releaseDate = document.getElementById('movieRelease').value;
    if (!releaseDate) {
        showFieldError('releaseError', 'Vui lòng chọn ngày khởi chiếu');
        document.getElementById('movieRelease').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('releaseError');
        document.getElementById('movieRelease').classList.remove('error');
    }

    // Validate status
    const status = document.getElementById('movieStatus').value;
    if (!status) {
        showFieldError('statusError', 'Vui lòng chọn trạng thái');
        document.getElementById('movieStatus').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('statusError');
        document.getElementById('movieStatus').classList.remove('error');
    }

    // Validate poster URL
    const poster = document.getElementById('moviePoster').value.trim();
    if (!poster) {
        showFieldError('posterError', 'Vui lòng nhập URL poster');
        document.getElementById('moviePoster').classList.add('error');
        isValid = false;
    } else if (!isValidUrl(poster)) {
        showFieldError('posterError', 'URL không hợp lệ');
        document.getElementById('moviePoster').classList.add('error');
        isValid = false;
    } else {
        clearFieldError('posterError');
        document.getElementById('moviePoster').classList.remove('error');
    }

    return isValid;
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

// Validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Edit movie
function editMovie(movieId) {
    openModal(movieId);
}

// Confirm delete movie
let movieToDelete = null;

function confirmDeleteMovie(movieId) {
    const movie = allMovies.find(m => m.id === movieId);
    if (!movie) return;

    movieToDelete = movieId;
    const deleteModal = document.getElementById('deleteModal');
    const deleteMovieName = document.getElementById('deleteMovieName');

    if (deleteModal && deleteMovieName) {
        deleteMovieName.textContent = movie.name;
        deleteModal.style.display = 'flex';
    }
}

// Confirm delete
function confirmDelete() {
    if (!movieToDelete) return;

    // Simulate API call
    setTimeout(() => {
        allMovies = allMovies.filter(m => m.id !== movieToDelete);
        
        // Reapply filters and refresh display
        applyFilters();

        // Close modal
        const deleteModal = document.getElementById('deleteModal');
        if (deleteModal) {
            deleteModal.style.display = 'none';
        }

        movieToDelete = null;
        alert('Xóa phim thành công!');
    }, 500);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
