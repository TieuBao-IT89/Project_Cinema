// Blog Page Functionality

// Global variables
let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
const itemsPerPage = 6;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadBlogPosts();
    initializeFilters();
    initializePagination();
});

// Load blog posts from mock data
function loadBlogPosts() {
    // Mock blog posts data - In real app, this would come from API
    allPosts = [
        {
            id: 1,
            title: 'Top 10 phim hay nhất năm 2024',
            excerpt: 'Tổng hợp danh sách những bộ phim đáng xem nhất trong năm 2024, từ phim hành động đến phim tình cảm, đảm bảo sẽ mang đến cho bạn những trải nghiệm điện ảnh tuyệt vời.',
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop',
            category: 'news',
            author: 'Admin',
            date: '2024-01-15',
            views: 1250,
            tags: ['phim hay', 'top 10', 'năm 2024'],
            popular: true
        },
        {
            id: 2,
            title: 'Review: Avengers: Endgame - Bộ phim siêu anh hùng đỉnh cao',
            excerpt: 'Đánh giá chi tiết về Avengers: Endgame, bộ phim kết thúc Infinity Saga một cách hoàn hảo. Từ cốt truyện đến diễn xuất, từ kỹ xảo đến nhạc phim, tất cả đều xuất sắc.',
            image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=600&fit=crop',
            category: 'review',
            author: 'Phê Bình Phim',
            date: '2024-01-12',
            views: 2100,
            tags: ['review', 'avengers', 'superhero'],
            popular: true
        },
        {
            id: 3,
            title: 'Trailer mới: Black Panther: Wakanda Forever',
            excerpt: 'Xem ngay trailer chính thức của Black Panther: Wakanda Forever, bộ phim tiếp theo trong vũ trụ Marvel. Phim hứa hẹn sẽ mang đến nhiều bất ngờ cho người xem.',
            image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&h=600&fit=crop',
            category: 'trailer',
            author: 'News Team',
            date: '2024-01-10',
            views: 1800,
            tags: ['trailer', 'black panther', 'marvel'],
            popular: false
        },
        {
            id: 4,
            title: 'Hậu trường sản xuất Dune: Những điều bạn chưa biết',
            excerpt: 'Khám phá quá trình sản xuất bộ phim Dune, từ việc xây dựng bối cảnh sa mạc đến việc tạo ra những sinh vật kỳ lạ. Một cái nhìn độc đáo về hậu trường điện ảnh.',
            image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&h=600&fit=crop',
            category: 'behind-scenes',
            author: 'Cinema Insider',
            date: '2024-01-08',
            views: 950,
            tags: ['hậu trường', 'dune', 'making of'],
            popular: false
        },
        {
            id: 5,
            title: 'Lịch sử phát hành phim 2024 - Cập nhật mới nhất',
            excerpt: 'Cập nhật lịch phát hành các bộ phim đáng chờ đợi trong năm 2024. Từ những bom tấn Hollywood đến các tác phẩm độc lập, tất cả đều có trong danh sách này.',
            image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&h=600&fit=crop',
            category: 'news',
            author: 'Editor',
            date: '2024-01-05',
            views: 1650,
            tags: ['lịch phát hành', 'năm 2024', 'phim mới'],
            popular: true
        },
        {
            id: 6,
            title: 'Review: Spider-Man: No Way Home - Một hành trình cảm xúc',
            excerpt: 'Đánh giá chi tiết về Spider-Man: No Way Home, bộ phim kết hợp ba thế hệ Spider-Man trong một câu chuyện đầy cảm xúc và kịch tính. Điểm số: 9/10.',
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop',
            category: 'review',
            author: 'Phê Bình Phim',
            date: '2024-01-03',
            views: 2200,
            tags: ['review', 'spider-man', 'superhero'],
            popular: true
        },
        {
            id: 7,
            title: 'Trailer: Avatar: The Way of Water - Chuyến phiêu lưu dưới biển',
            excerpt: 'Xem trailer mới nhất của Avatar: The Way of Water, phần tiếp theo của bộ phim Avatar nổi tiếng. Phim hứa hẹn mang đến những hình ảnh tuyệt đẹp dưới đại dương.',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
            category: 'trailer',
            author: 'News Team',
            date: '2024-01-01',
            views: 1950,
            tags: ['trailer', 'avatar', 'sci-fi'],
            popular: false
        },
        {
            id: 8,
            title: 'Bí mật đằng sau các cảnh quay nguy hiểm trong phim hành động',
            excerpt: 'Tìm hiểu về những kỹ thuật đặc biệt được sử dụng để tạo ra các cảnh quay nguy hiểm trong phim hành động, từ stunts đến CGI, đảm bảo an toàn cho diễn viên.',
            image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=600&fit=crop',
            category: 'behind-scenes',
            author: 'Cinema Insider',
            date: '2023-12-28',
            views: 1100,
            tags: ['hậu trường', 'stunt', 'hành động'],
            popular: false
        },
        {
            id: 9,
            title: 'Phim Việt Nam năm 2024: Điểm sáng của điện ảnh trong nước',
            excerpt: 'Tổng quan về các bộ phim Việt Nam sắp ra mắt trong năm 2024, từ phim tình cảm đến phim hành động, cho thấy sự phát triển của ngành công nghiệp điện ảnh Việt.',
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop',
            category: 'news',
            author: 'Editor',
            date: '2023-12-25',
            views: 1400,
            tags: ['phim việt nam', 'năm 2024', 'điện ảnh'],
            popular: false
        },
        {
            id: 10,
            title: 'Review: The Matrix Resurrections - Sự trở lại đáng thất vọng',
            excerpt: 'Đánh giá về The Matrix Resurrections, phần tiếp theo của loạt phim Matrix. Mặc dù có những khoảnh khắc hay nhưng phim không thể vượt qua phần gốc.',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop',
            category: 'review',
            author: 'Phê Bình Phim',
            date: '2023-12-22',
            views: 1350,
            tags: ['review', 'matrix', 'sci-fi'],
            popular: false
        },
        {
            id: 11,
            title: 'Top 5 phim kinh dị hay nhất mọi thời đại',
            excerpt: 'Danh sách 5 bộ phim kinh dị hay nhất mọi thời đại, từ những tác phẩm kinh điển đến những bộ phim hiện đại, đảm bảo sẽ làm bạn sợ hết hồn.',
            image: 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800&h=600&fit=crop',
            category: 'news',
            author: 'Editor',
            date: '2023-12-20',
            views: 1750,
            tags: ['phim kinh dị', 'top 5', 'kinh điển'],
            popular: true
        },
        {
            id: 12,
            title: 'Trailer: Guardians of the Galaxy Vol. 3 - Cuộc phiêu lưu cuối cùng',
            excerpt: 'Xem trailer mới nhất của Guardians of the Galaxy Vol. 3, phần cuối cùng trong series phim về nhóm siêu anh hùng vũ trụ này.',
            image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&h=600&fit=crop',
            category: 'trailer',
            author: 'News Team',
            date: '2023-12-18',
            views: 1600,
            tags: ['trailer', 'guardians', 'marvel'],
            popular: false
        }
    ];

    filteredPosts = [...allPosts];
    displayBlogPosts();
    displayCategories();
    displayPopularPosts();
    displayTags();
    updatePagination();
}

// Initialize filters
function initializeFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');
    const resetBtn = document.getElementById('resetFilterBtn');
    const sidebarSearchInput = document.getElementById('sidebarSearch');
    const sidebarSearchBtn = document.querySelector('.widget-search-btn');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
        // Also trigger on Enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyFilters();
            }
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', resetFilters);
    }

    // Sidebar search
    if (sidebarSearchInput) {
        sidebarSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchFromSidebar();
            }
        });
    }

    if (sidebarSearchBtn) {
        sidebarSearchBtn.addEventListener('click', searchFromSidebar);
    }
}

// Apply filters
function applyFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const searchInputElement = document.getElementById('search-input');
    
    if (!categoryFilter || !searchInputElement) return;
    
    const categoryValue = categoryFilter.value;
    const searchValue = searchInputElement.value.trim().toLowerCase();

    filteredPosts = allPosts.filter(post => {
        // Category filter
        if (categoryValue !== 'all' && post.category !== categoryValue) {
            return false;
        }

        // Search filter
        if (searchValue) {
            if (!post.title.toLowerCase().includes(searchValue) && 
                !post.excerpt.toLowerCase().includes(searchValue) &&
                !post.tags.some(tag => tag.toLowerCase().includes(searchValue))) {
                return false;
            }
        }

        return true;
    });

    currentPage = 1;
    displayBlogPosts();
    updatePagination();
}

// Reset filters
function resetFilters() {
    document.getElementById('category-filter').value = 'all';
    document.getElementById('search-input').value = '';
    
    filteredPosts = [...allPosts];
    currentPage = 1;
    displayBlogPosts();
    updatePagination();
}

// Display blog posts
function displayBlogPosts() {
    const blogPosts = document.getElementById('blogPosts');
    const emptyState = document.getElementById('emptyState');
    
    if (!blogPosts) return;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const postsToShow = filteredPosts.slice(startIndex, endIndex);

    if (filteredPosts.length === 0) {
        blogPosts.innerHTML = '';
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }

    if (emptyState) {
        emptyState.style.display = 'none';
    }

    blogPosts.innerHTML = postsToShow.map(post => `
        <article class="blog-post-card">
            <div class="post-image-wrapper">
                <img src="${post.image}" alt="${post.title}" class="post-image">
                <span class="post-category">
                    ${post.category === 'news' ? 'Tin tức' : 
                      post.category === 'review' ? 'Review' : 
                      post.category === 'trailer' ? 'Trailer' : 'Hậu trường'}
                </span>
            </div>
            <div class="post-content">
                <div class="post-header">
                    <h2 class="post-title">
                        <a href="blog-detail.html?id=${post.id}">${post.title}</a>
                    </h2>
                    <p class="post-excerpt">${post.excerpt}</p>
                </div>
                <div class="post-meta">
                    <div class="post-meta-item">
                        <i class="fas fa-user"></i>
                        <span>${post.author}</span>
                    </div>
                    <div class="post-meta-item">
                        <i class="fas fa-calendar"></i>
                        <span>${formatDate(post.date)}</span>
                    </div>
                    <div class="post-meta-item">
                        <i class="fas fa-eye"></i>
                        <span>${post.views.toLocaleString('vi-VN')} lượt xem</span>
                    </div>
                </div>
                ${post.tags && post.tags.length > 0 ? `
                    <div class="post-tags">
                        ${post.tags.map(tag => `
                            <a href="#" class="post-tag" onclick="searchByTag('${tag}'); return false;">#${tag}</a>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="post-actions">
                    <a href="blog-detail.html?id=${post.id}" class="btn-read-more">
                        Đọc thêm <i class="fas fa-arrow-right"></i>
                    </a>
                    <div class="post-share">
                        <a href="#" class="share-btn" onclick="sharePost(${post.id}); return false;" title="Facebook">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="#" class="share-btn" onclick="sharePost(${post.id}, 'twitter'); return false;" title="Twitter">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="#" class="share-btn" onclick="copyLink(${post.id}); return false;" title="Copy link">
                            <i class="fas fa-link"></i>
                        </a>
                    </div>
                </div>
            </div>
        </article>
    `).join('');
}

// Display categories
function displayCategories() {
    const categoriesList = document.getElementById('categoriesList');
    if (!categoriesList) return;

    const categories = {
        'news': { name: 'Tin tức', count: 0 },
        'review': { name: 'Review phim', count: 0 },
        'trailer': { name: 'Trailer', count: 0 },
        'behind-scenes': { name: 'Hậu trường', count: 0 }
    };

    // Count posts in each category
    allPosts.forEach(post => {
        if (categories[post.category]) {
            categories[post.category].count++;
        }
    });

    categoriesList.innerHTML = Object.entries(categories).map(([key, value]) => `
        <li class="widget-list-item">
            <a href="#" onclick="filterByCategory('${key}'); return false;">${value.name}</a>
            <span class="count">${value.count}</span>
        </li>
    `).join('');
}

// Display popular posts
function displayPopularPosts() {
    const popularPosts = document.getElementById('popularPosts');
    if (!popularPosts) return;

    const popular = allPosts.filter(post => post.popular).sort((a, b) => b.views - a.views).slice(0, 5);

    if (popular.length === 0) {
        popularPosts.innerHTML = '<p style="color: var(--text-secondary); font-size: var(--font-size-sm);">Chưa có bài viết phổ biến</p>';
        return;
    }

    popularPosts.innerHTML = popular.map(post => `
        <div class="popular-post-item" onclick="window.location.href='blog-detail.html?id=${post.id}'">
            <img src="${post.image}" alt="${post.title}" class="popular-post-image">
            <div class="popular-post-content">
                <h4 class="popular-post-title">
                    <a href="blog-detail.html?id=${post.id}">${post.title}</a>
                </h4>
                <span class="popular-post-date">
                    <i class="fas fa-calendar"></i> ${formatDate(post.date)}
                </span>
            </div>
        </div>
    `).join('');
}

// Display tags
function displayTags() {
    const tagsCloud = document.getElementById('tagsCloud');
    if (!tagsCloud) return;

    // Collect all unique tags
    const tagMap = {};
    allPosts.forEach(post => {
        post.tags.forEach(tag => {
            if (!tagMap[tag]) {
                tagMap[tag] = 0;
            }
            tagMap[tag]++;
        });
    });

    const tags = Object.entries(tagMap).sort((a, b) => b[1] - a[1]).slice(0, 20);

    tagsCloud.innerHTML = tags.map(([tag, count]) => {
        let size = 'medium';
        if (count >= 5) size = 'large';
        else if (count <= 2) size = 'small';

        return `<a href="#" class="tag-item ${size}" onclick="searchByTag('${tag}'); return false;">#${tag}</a>`;
    }).join('');
}

// Initialize pagination
function initializePagination() {
    updatePagination();
}

// Update pagination
function updatePagination() {
    const paginationWrapper = document.getElementById('paginationWrapper');
    const pagination = document.getElementById('pagination');
    
    if (!pagination || filteredPosts.length === 0) {
        if (paginationWrapper) {
            paginationWrapper.style.display = 'none';
        }
        return;
    }

    if (paginationWrapper) {
        paginationWrapper.style.display = 'flex';
    }

    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">
            <i class="fas fa-chevron-left"></i> Trước
        </button>
    `;

    // Page numbers
    paginationHTML += '<div class="page-numbers">';
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHTML += `<span class="page-number ${1 === currentPage ? 'active' : ''}" onclick="changePage(1)">1</span>`;
        if (startPage > 2) {
            paginationHTML += '<span class="page-number" style="cursor: default; opacity: 0.5;">...</span>';
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<span class="page-number ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</span>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += '<span class="page-number" style="cursor: default; opacity: 0.5;">...</span>';
        }
        paginationHTML += `<span class="page-number ${totalPages === currentPage ? 'active' : ''}" onclick="changePage(${totalPages})">${totalPages}</span>`;
    }

    paginationHTML += '</div>';

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
    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayBlogPosts();
    updatePagination();
    
    // Scroll to top of blog posts
    const blogSection = document.querySelector('.blog-section');
    if (blogSection) {
        blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Filter by category
function filterByCategory(category) {
    document.getElementById('category-filter').value = category;
    applyFilters();
}

// Search by tag
function searchByTag(tag) {
    document.getElementById('search-input').value = tag;
    applyFilters();
}

// Search from sidebar
function searchFromSidebar() {
    const sidebarSearchInput = document.getElementById('sidebarSearch');
    const mainSearchInput = document.getElementById('search-input');
    
    if (sidebarSearchInput && mainSearchInput) {
        const searchValue = sidebarSearchInput.value.trim();
        mainSearchInput.value = searchValue;
        applyFilters();
        
        // Focus on main search input
        mainSearchInput.focus();
    }
}

// Share post
function sharePost(postId, platform = 'facebook') {
    const post = allPosts.find(p => p.id === postId);
    if (!post) return;

    const url = encodeURIComponent(window.location.origin + `/blog-detail.html?id=${postId}`);
    const title = encodeURIComponent(post.title);

    let shareUrl = '';
    if (platform === 'facebook') {
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    } else if (platform === 'twitter') {
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
    }

    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Copy link
function copyLink(postId) {
    const url = window.location.origin + `/blog-detail.html?id=${postId}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            alert('Đã sao chép link!');
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Đã sao chép link!');
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
