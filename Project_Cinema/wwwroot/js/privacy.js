// Privacy Policy Page Functionality

// Privacy data
const privacyData = [
    {
        id: '1',
        title: 'Thông tin chúng tôi thu thập',
        content: `
            <p>Chúng tôi thu thập các loại thông tin sau đây để cung cấp và cải thiện dịch vụ của mình:</p>
            
            <p><strong>Thông tin cá nhân:</strong></p>
            <ul>
                <li>Họ và tên</li>
                <li>Địa chỉ email</li>
                <li>Số điện thoại</li>
                <li>Ngày sinh (nếu cần thiết cho xác minh độ tuổi)</li>
                <li>Địa chỉ (nếu bạn cung cấp)</li>
            </ul>
            
            <p><strong>Thông tin thanh toán:</strong></p>
            <ul>
                <li>Thông tin thẻ tín dụng/ghi nợ (được xử lý bởi cổng thanh toán bảo mật, không lưu trữ trên server của chúng tôi)</li>
                <li>Lịch sử giao dịch</li>
            </ul>
            
            <p><strong>Thông tin sử dụng:</strong></p>
            <ul>
                <li>Lịch sử đặt vé</li>
                <li>Phim đã xem</li>
                <li>Tùy chọn và sở thích</li>
                <li>Dữ liệu truy cập website (IP address, browser type, pages visited)</li>
            </ul>
            
            <div class="article-highlight">
                <p><strong>Lưu ý:</strong> Chúng tôi không thu thập thông tin nhạy cảm như số CMND/CCCD trừ khi cần thiết cho xác minh đặc biệt.</p>
            </div>
        `
    },
    {
        id: '2',
        title: 'Cách chúng tôi thu thập thông tin',
        content: `
            <p>Chúng tôi thu thập thông tin của bạn thông qua các cách sau:</p>
            
            <p><strong>Thông tin bạn cung cấp trực tiếp:</strong></p>
            <ul>
                <li>Khi đăng ký tài khoản</li>
                <li>Khi đặt vé xem phim</li>
                <li>Khi liên hệ với bộ phận hỗ trợ khách hàng</li>
                <li>Khi tham gia khảo sát hoặc chương trình khuyến mãi</li>
                <li>Khi gửi phản hồi hoặc đánh giá</li>
            </ul>
            
            <p><strong>Thông tin tự động:</strong></p>
            <ul>
                <li>Cookies và công nghệ theo dõi tương tự</li>
                <li>Nhật ký server tự động</li>
                <li>Thông tin thiết bị và trình duyệt</li>
            </ul>
            
            <p><strong>Thông tin từ bên thứ ba:</strong></p>
            <ul>
                <li>Dịch vụ đăng nhập xã hội (nếu bạn chọn đăng nhập qua Facebook, Google, v.v.)</li>
                <li>Các đối tác thanh toán</li>
            </ul>
        `
    },
    {
        id: '3',
        title: 'Mục đích sử dụng thông tin',
        content: `
            <p>Chúng tôi sử dụng thông tin của bạn cho các mục đích sau:</p>
            
            <table class="article-table">
                <thead>
                    <tr>
                        <th>Mục đích</th>
                        <th>Mô tả</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Cung cấp dịch vụ</strong></td>
                        <td>Xử lý đặt vé, thanh toán và cung cấp các dịch vụ bạn yêu cầu</td>
                    </tr>
                    <tr>
                        <td><strong>Cải thiện dịch vụ</strong></td>
                        <td>Phân tích cách bạn sử dụng website để cải thiện trải nghiệm người dùng</td>
                    </tr>
                    <tr>
                        <td><strong>Giao tiếp</strong></td>
                        <td>Gửi xác nhận đặt vé, thông báo quan trọng và phản hồi yêu cầu hỗ trợ</td>
                    </tr>
                    <tr>
                        <td><strong>Marketing</strong></strong></td>
                        <td>Gửi thông tin về phim mới, khuyến mãi (nếu bạn đã đồng ý)</td>
                    </tr>
                    <tr>
                        <td><strong>Bảo mật</strong></td>
                        <td>Phát hiện và ngăn chặn gian lận, lạm dụng và hoạt động bất hợp pháp</td>
                    </tr>
                    <tr>
                        <td><strong>Tuân thủ pháp luật</strong></td>
                        <td>Tuân thủ các yêu cầu pháp lý và quy định hiện hành</td>
                    </tr>
                </tbody>
            </table>
        `
    },
    {
        id: '4',
        title: 'Chia sẻ thông tin',
        content: `
            <p>Chúng tôi cam kết không bán hoặc cho thuê thông tin cá nhân của bạn. Chúng tôi chỉ chia sẻ thông tin trong các trường hợp sau:</p>
            
            <p><strong>Với sự đồng ý của bạn:</strong></p>
            <ul>
                <li>Khi bạn đồng ý chia sẻ thông tin với bên thứ ba</li>
                <li>Khi bạn sử dụng các tính năng đăng nhập xã hội</li>
            </ul>
            
            <p><strong>Với nhà cung cấp dịch vụ:</strong></p>
            <ul>
                <li>Các công ty xử lý thanh toán</li>
                <li>Nhà cung cấp dịch vụ email và SMS</li>
                <li>Dịch vụ lưu trữ dữ liệu (cloud)</li>
                <li>Các công ty phân tích dữ liệu</li>
            </ul>
            <p>Tất cả các đối tác này đều có nghĩa vụ bảo mật thông tin và chỉ được sử dụng cho mục đích cung cấp dịch vụ.</p>
            
            <p><strong>Yêu cầu pháp lý:</strong></p>
            <ul>
                <li>Khi được yêu cầu bởi cơ quan pháp luật có thẩm quyền</li>
                <li>Để bảo vệ quyền lợi, tài sản hoặc an toàn của CinemaHub và người dùng</li>
                <li>Để tuân thủ quy định pháp luật hiện hành</li>
            </ul>
            
            <p><strong>Trong trường hợp sáp nhập hoặc mua lại:</strong></p>
            <p>Nếu CinemaHub được sáp nhập hoặc mua lại, thông tin của bạn có thể được chuyển giao cho công ty mới, nhưng sẽ tiếp tục được bảo vệ theo chính sách này.</p>
        `
    },
    {
        id: '5',
        title: 'Bảo mật thông tin',
        content: `
            <p>Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin của bạn:</p>
            
            <p><strong>Mã hóa dữ liệu:</strong></p>
            <ul>
                <li>Tất cả dữ liệu được truyền tải qua kết nối HTTPS (SSL/TLS)</li>
                <li>Mật khẩu được mã hóa bằng thuật toán bcrypt</li>
                <li>Thông tin thanh toán được xử lý bởi các cổng thanh toán đạt chuẩn PCI DSS</li>
            </ul>
            
            <p><strong>Kiểm soát truy cập:</strong></p>
            <ul>
                <li>Chỉ nhân viên được ủy quyền mới có thể truy cập thông tin cá nhân</li>
                <li>Truy cập được ghi nhật ký và giám sát</li>
                <li>Đào tạo nhân viên về bảo mật thông tin định kỳ</li>
            </ul>
            
            <p><strong>Bảo vệ cơ sở hạ tầng:</strong></p>
            <ul>
                <li>Firewall và hệ thống phát hiện xâm nhập</li>
                <li>Backup dữ liệu định kỳ</li>
                <li>Giám sát an ninh 24/7</li>
            </ul>
            
            <div class="article-highlight">
                <p><strong>Lưu ý:</strong> Mặc dù chúng tôi nỗ lực bảo vệ thông tin của bạn, không có phương pháp truyền tải qua internet hoặc lưu trữ điện tử nào là 100% an toàn. Chúng tôi không thể đảm bảo tuyệt đối về bảo mật thông tin.</p>
            </div>
        `
    },
    {
        id: '6',
        title: 'Cookies và công nghệ theo dõi',
        content: `
            <p>Chúng tôi sử dụng cookies và các công nghệ tương tự để cải thiện trải nghiệm của bạn:</p>
            
            <p><strong>Loại cookies chúng tôi sử dụng:</strong></p>
            <ul>
                <li><strong>Cookies cần thiết:</strong> Để website hoạt động bình thường (đăng nhập, giỏ hàng)</li>
                <li><strong>Cookies chức năng:</strong> Ghi nhớ tùy chọn của bạn (ngôn ngữ, vùng)</li>
                <li><strong>Cookies phân tích:</strong> Giúp chúng tôi hiểu cách bạn sử dụng website</li>
                <li><strong>Cookies marketing:</strong> Để hiển thị quảng cáo phù hợp (nếu bạn đồng ý)</li>
            </ul>
            
            <p><strong>Quản lý cookies:</strong></p>
            <p>Bạn có thể kiểm soát cookies thông qua cài đặt trình duyệt của mình. Tuy nhiên, việc tắt cookies có thể ảnh hưởng đến chức năng của website.</p>
            
            <p><strong>Công nghệ theo dõi khác:</strong></p>
            <ul>
                <li>Web beacons (để theo dõi email)</li>
                <li>Local storage (để lưu trữ tùy chọn)</li>
                <li>Analytics tools (Google Analytics, v.v.)</li>
            </ul>
        `
    },
    {
        id: '7',
        title: 'Quyền của bạn',
        content: `
            <p>Bạn có các quyền sau đây đối với thông tin cá nhân của mình:</p>
            
            <p><strong>Quyền truy cập:</strong></p>
            <ul>
                <li>Xem thông tin cá nhân mà chúng tôi lưu trữ</li>
                <li>Yêu cầu bản sao dữ liệu của bạn</li>
            </ul>
            
            <p><strong>Quyền chỉnh sửa:</strong></p>
            <ul>
                <li>Cập nhật thông tin cá nhân thông qua tài khoản của bạn</li>
                <li>Yêu cầu chúng tôi sửa thông tin không chính xác</li>
            </ul>
            
            <p><strong>Quyền xóa:</strong></p>
            <ul>
                <li>Yêu cầu xóa tài khoản và thông tin cá nhân (tuân thủ yêu cầu lưu trữ pháp lý)</li>
            </ul>
            
            <p><strong>Quyền từ chối:</strong></p>
            <ul>
                <li>Từ chối nhận email marketing (bằng cách nhấp "Hủy đăng ký")</li>
                <li>Từ chối cookies không cần thiết</li>
            </ul>
            
            <p><strong>Quyền khiếu nại:</strong></p>
            <p>Nếu bạn có quan ngại về cách chúng tôi xử lý thông tin của bạn, bạn có quyền khiếu nại đến cơ quan bảo vệ dữ liệu có thẩm quyền.</p>
            
            <p>Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:privacy@cinemahub.vn">privacy@cinemahub.vn</a></p>
        `
    },
    {
        id: '8',
        title: 'Lưu trữ thông tin',
        content: `
            <p><strong>Thời gian lưu trữ:</strong></p>
            <ul>
                <li>Chúng tôi lưu trữ thông tin cá nhân của bạn trong thời gian cần thiết để cung cấp dịch vụ và tuân thủ các nghĩa vụ pháp lý.</li>
                <li>Thông tin tài khoản được lưu trữ cho đến khi bạn yêu cầu xóa.</li>
                <li>Thông tin giao dịch được lưu trữ theo yêu cầu pháp luật về kế toán và thuế (thường là 5-10 năm).</li>
                <li>Dữ liệu phân tích có thể được lưu trữ dưới dạng tổng hợp, ẩn danh.</li>
            </ul>
            
            <p><strong>Xóa thông tin:</strong></p>
            <ul>
                <li>Khi bạn yêu cầu xóa tài khoản, chúng tôi sẽ xóa hoặc ẩn danh hóa thông tin cá nhân trong vòng 30 ngày.</li>
                <li>Một số thông tin có thể được giữ lại để tuân thủ nghĩa vụ pháp lý hoặc giải quyết tranh chấp.</li>
            </ul>
            
            <p><strong>Vị trí lưu trữ:</strong></p>
            <p>Thông tin của bạn có thể được lưu trữ trên các server đặt tại Việt Nam hoặc các quốc gia khác. Chúng tôi đảm bảo rằng bất kỳ quốc gia nào chúng tôi lưu trữ dữ liệu đều có các biện pháp bảo vệ tương đương.</p>
        `
    },
    {
        id: '9',
        title: 'Trẻ em',
        content: `
            <p>Dịch vụ của CinemaHub không dành cho trẻ em dưới 13 tuổi. Chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em dưới 13 tuổi.</p>
            
            <p>Nếu bạn là cha mẹ hoặc người giám hộ và phát hiện con bạn (dưới 13 tuổi) đã cung cấp thông tin cá nhân cho chúng tôi, vui lòng liên hệ với chúng tôi ngay. Chúng tôi sẽ xóa thông tin đó khỏi hệ thống trong thời gian sớm nhất.</p>
            
            <p>Đối với trẻ em từ 13 đến dưới 18 tuổi, chúng tôi khuyến khích cha mẹ hoặc người giám hộ giám sát việc sử dụng dịch vụ và hướng dẫn con em về cách cung cấp thông tin cá nhân an toàn trên internet.</p>
            
            <div class="article-highlight">
                <p><strong>Lưu ý:</strong> Một số phim có thể có độ tuổi giới hạn. Chúng tôi sẽ yêu cầu xác minh độ tuổi khi cần thiết.</p>
            </div>
        `
    },
    {
        id: '10',
        title: 'Thay đổi chính sách bảo mật',
        content: `
            <p>Chúng tôi có thể cập nhật chính sách bảo mật này theo thời gian để phản ánh các thay đổi về cách chúng tôi thu thập, sử dụng hoặc bảo vệ thông tin của bạn, hoặc để tuân thủ các yêu cầu pháp lý mới.</p>
            
            <p><strong>Thông báo thay đổi:</strong></p>
            <ul>
                <li>Chúng tôi sẽ thông báo về các thay đổi quan trọng bằng cách đăng thông báo trên website</li>
                <li>Gửi email đến địa chỉ email đã đăng ký (nếu thay đổi đáng kể)</li>
                <li>Cập nhật ngày "Cập nhật lần cuối" ở đầu chính sách này</li>
            </ul>
            
            <p><strong>Tiếp tục sử dụng:</strong></p>
            <p>Việc bạn tiếp tục sử dụng dịch vụ sau khi các thay đổi được đăng tải sẽ được coi là chấp nhận chính sách bảo mật mới. Nếu bạn không đồng ý với các thay đổi, bạn có thể chấm dứt việc sử dụng dịch vụ và yêu cầu xóa tài khoản.</p>
            
            <p><strong>Lịch sử phiên bản:</strong></p>
            <ul>
                <li>Phiên bản hiện tại: 2.0 (01/01/2024)</li>
                <li>Phiên bản trước: 1.0 (01/01/2023)</li>
            </ul>
        `
    },
    {
        id: '11',
        title: 'Liên hệ chúng tôi',
        content: `
            <p>Nếu bạn có bất kỳ câu hỏi, quan ngại hoặc yêu cầu nào liên quan đến chính sách bảo mật này hoặc cách chúng tôi xử lý thông tin cá nhân của bạn, vui lòng liên hệ với chúng tôi:</p>
            
            <p><strong>Bộ phận Bảo mật Thông tin:</strong></p>
            <ul>
                <li><strong>Email:</strong> <a href="mailto:privacy@cinemahub.vn">privacy@cinemahub.vn</a></li>
                <li><strong>Địa chỉ:</strong> 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh, Việt Nam</li>
                <li><strong>Hotline:</strong> 1900 1234 (phím 9 cho bộ phận bảo mật)</li>
            </ul>
            
            <p><strong>Thời gian phản hồi:</strong></p>
            <p>Chúng tôi sẽ phản hồi yêu cầu của bạn trong vòng 30 ngày làm việc. Đối với các yêu cầu phức tạp, chúng tôi có thể cần thêm thời gian và sẽ thông báo cho bạn.</p>
            
            <p><strong>Khiếu nại:</strong></p>
            <p>Nếu bạn không hài lòng với cách chúng tôi xử lý khiếu nại của bạn, bạn có quyền nộp đơn khiếu nại đến Cục An toàn Thông tin hoặc cơ quan bảo vệ dữ liệu có thẩm quyền khác.</p>
        `
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    generateNavigation();
    generateArticles();
    initializeScrollSpy();
});

// Generate navigation
function generateNavigation() {
    const nav = document.getElementById('privacyNav');
    if (!nav) return;

    nav.innerHTML = privacyData.map(item => `
        <a href="#article-${item.id}" class="nav-item" data-id="${item.id}">
            <i class="fas fa-circle"></i>
            <span>${item.id}. ${item.title}</span>
        </a>
    `).join('');
}

// Generate articles
function generateArticles() {
    const articles = document.getElementById('privacyArticles');
    if (!articles) return;

    articles.innerHTML = privacyData.map(item => `
        <article class="privacy-article" id="article-${item.id}">
            <div class="article-header">
                <div class="article-number">${item.id}</div>
                <h2 class="article-title">${item.title}</h2>
            </div>
            <div class="article-content">
                ${item.content}
            </div>
        </article>
    `).join('');
}

// Initialize scroll spy
function initializeScrollSpy() {
    const articles = document.querySelectorAll('.privacy-article');
    const navItems = document.querySelectorAll('.nav-item');

    if (articles.length === 0 || navItems.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id.replace('article-', '');
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.dataset.id === id) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    articles.forEach(article => {
        observer.observe(article);
    });

    // Smooth scroll for nav items
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}
