// FAQ Page Functionality

// Global variables
let allFAQs = [];
let filteredFAQs = [];
let currentCategory = 'all';
let currentSearch = '';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    loadFAQs();
    initializeSearch();
    initializeCategoryTabs();
});

// Load FAQ data
function loadFAQs() {
    // Mock FAQ data
    allFAQs = [
        // Booking FAQs
        {
            id: 1,
            category: 'booking',
            question: 'Làm thế nào để đặt vé xem phim?',
            answer: 'Bạn có thể đặt vé trực tuyến trên website CinemaHub theo các bước sau:\n\n1. Chọn phim muốn xem\n2. Chọn rạp chiếu và suất chiếu phù hợp\n3. Chọn ghế ngồi mong muốn\n4. Nhập thông tin cá nhân và thanh toán\n\nHoặc bạn có thể gọi hotline 1900 1234 để được hỗ trợ đặt vé trực tiếp.'
        },
        {
            id: 2,
            category: 'booking',
            question: 'Tôi có thể đổi hoặc hủy vé đã đặt không?',
            answer: 'Có, bạn có thể đổi hoặc hủy vé đã đặt với các điều kiện sau:\n\n- Hủy/Đổi vé trước giờ chiếu ít nhất 2 giờ\n- Vé sẽ được hoàn tiền vào tài khoản hoặc thẻ thanh toán trong vòng 3-5 ngày làm việc\n- Phí hủy/đổi (nếu có) sẽ được thông báo khi thực hiện\n\nVui lòng liên hệ hotline 1900 1234 hoặc email support@cinemahub.vn để được hỗ trợ.'
        },
        {
            id: 3,
            category: 'booking',
            question: 'Làm sao để nhận vé sau khi đặt?',
            answer: 'Sau khi đặt vé thành công, bạn sẽ nhận được:\n\n- Email xác nhận kèm mã đặt vé (booking code)\n- SMS thông báo (nếu bạn đã đăng ký)\n\nBạn có thể:\n- Sử dụng mã booking để lấy vé tại quầy rạp\n- Quét mã QR tại cổng vào\n- Xem vé trong mục "Lịch sử đặt vé" trên website\n\nVui lòng giữ mã booking để nhận vé tại rạp.'
        },
        {
            id: 4,
            category: 'booking',
            question: 'Tôi có thể đặt vé cho nhiều người cùng lúc không?',
            answer: 'Có, bạn có thể đặt vé cho nhiều người trong một lần đặt. Khi chọn ghế, bạn có thể:\n\n- Chọn nhiều ghế liền kề hoặc rời nhau\n- Tối đa 10 vé trong một lần đặt\n- Nhập thông tin từng người nếu cần\n\nHệ thống sẽ tự động tính tổng giá vé và hiển thị trước khi thanh toán.'
        },
        {
            id: 5,
            category: 'booking',
            question: 'Vé có thời hạn sử dụng bao lâu?',
            answer: 'Vé có hiệu lực cho suất chiếu cụ thể mà bạn đã chọn. Bạn cần:\n\n- Đến rạp trước giờ chiếu ít nhất 15 phút\n- Mang theo mã booking hoặc mã QR để nhận vé\n- Vé chỉ có giá trị cho suất chiếu đã đặt\n\nNếu bạn đến muộn, vé vẫn có thể sử dụng nhưng không được đổi suất chiếu khác.'
        },
        // Payment FAQs
        {
            id: 6,
            category: 'payment',
            question: 'Các phương thức thanh toán nào được chấp nhận?',
            answer: 'CinemaHub chấp nhận các phương thức thanh toán sau:\n\n- Thẻ tín dụng/ghi nợ (Visa, Mastercard, JCB)\n- Ví điện tử (MoMo, ZaloPay, VNPay, ShopeePay)\n- Thẻ ATM nội địa\n- Thanh toán tại quầy\n\nTất cả giao dịch được bảo mật và mã hóa theo tiêu chuẩn quốc tế.'
        },
        {
            id: 7,
            category: 'payment',
            question: 'Tôi đã thanh toán nhưng không nhận được vé, phải làm sao?',
            answer: 'Nếu bạn đã thanh toán nhưng chưa nhận được vé, vui lòng:\n\n1. Kiểm tra email (kể cả thư mục spam)\n2. Kiểm tra lịch sử đặt vé trên website\n3. Kiểm tra số dư tài khoản/thẻ đã trừ tiền chưa\n\nNếu vẫn chưa có vé, vui lòng liên hệ ngay:\n- Hotline: 1900 1234\n- Email: support@cinemahub.vn\n- Cung cấp mã giao dịch hoặc số điện thoại/email đã đặt vé'
        },
        {
            id: 8,
            category: 'payment',
            question: 'Tôi có được hoàn tiền nếu hủy vé không?',
            answer: 'Có, bạn sẽ được hoàn tiền khi hủy vé với các điều kiện:\n\n- Hủy trước giờ chiếu ít nhất 2 giờ\n- Tiền hoàn về tài khoản/thẻ trong 3-5 ngày làm việc\n- Phí hủy (nếu có) sẽ được khấu trừ\n\nThời gian hoàn tiền có thể khác nhau tùy theo phương thức thanh toán ban đầu.'
        },
        // Account FAQs
        {
            id: 9,
            category: 'account',
            question: 'Tôi quên mật khẩu tài khoản, làm sao để lấy lại?',
            answer: 'Bạn có thể khôi phục mật khẩu bằng cách:\n\n1. Vào trang "Quên mật khẩu"\n2. Nhập email hoặc số điện thoại đã đăng ký\n3. Kiểm tra email để nhận link đặt lại mật khẩu\n4. Nhấp vào link và nhập mật khẩu mới\n\nLink đặt lại mật khẩu có hiệu lực trong 30 phút. Nếu gặp vấn đề, vui lòng liên hệ hotline 1900 1234.'
        },
        {
            id: 10,
            category: 'account',
            question: 'Làm thế nào để đăng ký tài khoản?',
            answer: 'Bạn có thể đăng ký tài khoản CinemaHub bằng cách:\n\n1. Nhấp vào nút "Đăng ký" ở góc phải màn hình\n2. Điền đầy đủ thông tin: Họ tên, Email, Số điện thoại, Mật khẩu\n3. Xác nhận mật khẩu\n4. Đồng ý với điều khoản sử dụng\n5. Nhấp "Đăng ký"\n\nSau đó, bạn sẽ nhận email xác nhận để kích hoạt tài khoản.'
        },
        {
            id: 11,
            category: 'account',
            question: 'Tôi có thể thay đổi thông tin tài khoản không?',
            answer: 'Có, bạn có thể thay đổi thông tin tài khoản bất cứ lúc nào:\n\n1. Đăng nhập vào tài khoản\n2. Vào mục "Thông tin cá nhân"\n3. Cập nhật thông tin cần thay đổi\n4. Nhấp "Lưu thay đổi"\n\nMột số thông tin như email và số điện thoại có thể yêu cầu xác thực lại.'
        },
        // Cinema FAQs
        {
            id: 12,
            category: 'cinema',
            question: 'Rạp chiếu có chỗ đậu xe không?',
            answer: 'Hầu hết các rạp chiếu của CinemaHub đều có bãi đậu xe:\n\n- Miễn phí hoặc có phí tùy theo từng rạp\n- Có nhân viên hỗ trợ hướng dẫn\n- An ninh 24/7\n\nVui lòng kiểm tra thông tin chi tiết của từng rạp trên trang "Rạp chiếu" hoặc liên hệ hotline để biết thêm thông tin.'
        },
        {
            id: 13,
            category: 'cinema',
            question: 'Rạp có dịch vụ ăn uống không?',
            answer: 'Có, các rạp CinemaHub đều có quầy bán đồ ăn thức uống với:\n\n- Bắp rang bơ, nước ngọt\n- Các món ăn nhẹ\n- Combo giá ưu đãi\n\nBạn có thể đặt trước khi mua vé hoặc mua tại quầy. Một số rạp còn có quầy bar và nhà hàng.'
        },
        {
            id: 14,
            category: 'cinema',
            question: 'Rạp có hỗ trợ người khuyết tật không?',
            answer: 'Có, các rạp CinemaHub đều được thiết kế để hỗ trợ người khuyết tật:\n\n- Lối đi cho xe lăn\n- Ghế ngồi dành riêng\n- Nhà vệ sinh dễ tiếp cận\n- Hỗ trợ từ nhân viên\n\nVui lòng thông báo khi đặt vé hoặc liên hệ rạp trước để được hỗ trợ tốt nhất.'
        },
        // Other FAQs
        {
            id: 15,
            category: 'other',
            question: 'Có chương trình khuyến mãi nào không?',
            answer: 'CinemaHub thường xuyên có các chương trình khuyến mãi:\n\n- Giảm giá cho thành viên\n- Combo vé + bắp nước giá ưu đãi\n- Ngày đặc biệt (Thứ 3, Thứ 4)\n- Ưu đãi theo sự kiện\n- Mã giảm giá cho khách hàng mới\n\nVui lòng theo dõi trang "Khuyến mãi" hoặc đăng ký nhận thông báo để không bỏ lỡ các ưu đãi.'
        },
        {
            id: 16,
            category: 'other',
            question: 'Tôi có thể đem thức ăn từ bên ngoài vào rạp không?',
            answer: 'Chính sách về thức ăn từ bên ngoài:\n\n- Một số rạp cho phép đem thức ăn nhẹ từ bên ngoài\n- Thức ăn có mùi nồng có thể bị hạn chế\n- Đồ uống có cồn không được phép\n\nVui lòng kiểm tra chính sách của từng rạp cụ thể. Chúng tôi khuyến khích ủng hộ quầy bán đồ ăn tại rạp để có trải nghiệm tốt nhất.'
        },
        {
            id: 17,
            category: 'other',
            question: 'Rạp có quay phim/chụp ảnh trong lúc xem phim không?',
            answer: 'Không, để đảm bảo trải nghiệm xem phim tốt nhất:\n\n- Không được phép quay phim, chụp ảnh trong phòng chiếu\n- Tắt điện thoại hoặc để chế độ im lặng\n- Không sử dụng đèn flash\n\nHành vi vi phạm có thể dẫn đến việc yêu cầu rời khỏi rạp. Chúng tôi cảm ơn sự hợp tác của bạn.'
        }
    ];

    filteredFAQs = [...allFAQs];
    displayFAQs();
}

// Initialize search
function initializeSearch() {
    const searchInput = document.getElementById('faqSearch');
    const clearButton = document.getElementById('clearSearch');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            currentSearch = this.value.trim().toLowerCase();
            
            if (currentSearch) {
                clearButton.style.display = 'flex';
            } else {
                clearButton.style.display = 'none';
            }
            
            filterFAQs();
        });
    }

    if (clearButton) {
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            currentSearch = '';
            clearButton.style.display = 'none';
            filterFAQs();
        });
    }
}

// Initialize category tabs
function initializeCategoryTabs() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            // Update current category
            currentCategory = this.dataset.category;
            // Filter FAQs
            filterFAQs();
        });
    });
}

// Filter FAQs
function filterFAQs() {
    filteredFAQs = allFAQs.filter(faq => {
        // Category filter
        if (currentCategory !== 'all' && faq.category !== currentCategory) {
            return false;
        }

        // Search filter
        if (currentSearch) {
            const searchLower = currentSearch.toLowerCase();
            if (!faq.question.toLowerCase().includes(searchLower) && 
                !faq.answer.toLowerCase().includes(searchLower)) {
                return false;
            }
        }

        return true;
    });

    displayFAQs();
}

// Display FAQs
function displayFAQs() {
    const faqList = document.getElementById('faqList');
    const emptyState = document.getElementById('faqEmptyState');

    if (!faqList) return;

    if (filteredFAQs.length === 0) {
        faqList.innerHTML = '';
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }

    if (emptyState) {
        emptyState.style.display = 'none';
    }

    // Get category names
    const categoryNames = {
        'booking': 'Đặt vé',
        'payment': 'Thanh toán',
        'account': 'Tài khoản',
        'cinema': 'Rạp chiếu',
        'other': 'Khác'
    };

    faqList.innerHTML = filteredFAQs.map((faq, index) => {
        const answerLines = faq.answer.split('\n').filter(line => line.trim());
        const answerHTML = answerLines.map(line => {
            if (line.match(/^\d+\./)) {
                // Numbered list item
                return `<p style="margin-left: 20px; margin-bottom: 8px;">${line}</p>`;
            } else if (line.startsWith('-')) {
                // Bullet point
                return `<p style="margin-left: 20px; margin-bottom: 8px;">${line}</p>`;
            } else {
                return `<p>${line}</p>`;
            }
        }).join('');

        return `
            <div class="faq-item" data-id="${faq.id}">
                <div class="faq-question" onclick="toggleFAQ(${index})">
                    <div class="faq-question-content">
                        <span class="faq-category-badge">${categoryNames[faq.category] || faq.category}</span>
                        <span class="faq-question-text">${faq.question}</span>
                    </div>
                    <div class="faq-toggle">
                        <i class="fas fa-chevron-down"></i>
                    </div>
                </div>
                <div class="faq-answer">
                    <div class="faq-answer-content">
                        ${answerHTML}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Store filtered FAQs in a way that toggleFAQ can access
    window.currentFilteredFAQs = filteredFAQs;
}

// Toggle FAQ item
function toggleFAQ(index) {
    const faqItems = document.querySelectorAll('.faq-item');
    const clickedItem = faqItems[index];
    
    if (!clickedItem) return;

    const isActive = clickedItem.classList.contains('active');

    // Close all FAQ items
    faqItems.forEach(item => {
        item.classList.remove('active');
    });

    // Open clicked item if it wasn't active
    if (!isActive) {
        clickedItem.classList.add('active');
        
        // Scroll to FAQ item smoothly
        setTimeout(() => {
            clickedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
}

// Reset search
function resetSearch() {
    const searchInput = document.getElementById('faqSearch');
    const clearButton = document.getElementById('clearSearch');
    
    if (searchInput) {
        searchInput.value = '';
    }
    
    if (clearButton) {
        clearButton.style.display = 'none';
    }
    
    currentSearch = '';
    filterFAQs();
}
