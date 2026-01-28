// Terms of Service Page Functionality

// Terms data
const termsData = [
    {
        id: '1',
        title: 'Chấp nhận điều khoản',
        content: `
            <p>Bằng việc truy cập và sử dụng website CinemaHub, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý tuân thủ các điều khoản và điều kiện này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.</p>
            
            <p>Chúng tôi có quyền cập nhật, thay đổi hoặc thay thế bất kỳ phần nào của các điều khoản này vào bất cứ lúc nào. Việc bạn tiếp tục sử dụng dịch vụ sau khi các thay đổi được đăng tải sẽ được coi là chấp nhận các điều khoản mới.</p>
        `
    },
    {
        id: '2',
        title: 'Định nghĩa',
        content: `
            <p>Trong các điều khoản này, các thuật ngữ sau đây có ý nghĩa như sau:</p>
            
            <ul>
                <li><strong>"CinemaHub"</strong>, <strong>"Chúng tôi"</strong>, <strong>"Của chúng tôi"</strong> đề cập đến dịch vụ và website của CinemaHub.</li>
                <li><strong>"Người dùng"</strong>, <strong>"Bạn"</strong>, <strong>"Của bạn"</strong> đề cập đến cá nhân hoặc tổ chức truy cập hoặc sử dụng dịch vụ.</li>
                <li><strong>"Dịch vụ"</strong> đề cập đến tất cả các chức năng, tính năng và dịch vụ được cung cấp trên website CinemaHub.</li>
                <li><strong>"Vé"</strong> đề cập đến vé xem phim được đặt mua thông qua website.</li>
            </ul>
        `
    },
    {
        id: '3',
        title: 'Đăng ký tài khoản',
        content: `
            <p>Để sử dụng một số tính năng của dịch vụ, bạn có thể cần đăng ký tài khoản. Khi đăng ký, bạn đồng ý:</p>
            
            <ul>
                <li>Cung cấp thông tin chính xác, đầy đủ và cập nhật về bản thân.</li>
                <li>Duy trì và cập nhật ngay lập tức thông tin tài khoản để giữ cho nó chính xác, đầy đủ và cập nhật.</li>
                <li>Giữ bảo mật mật khẩu và không tiết lộ cho bất kỳ bên thứ ba nào.</li>
                <li>Chịu trách nhiệm cho tất cả các hoạt động xảy ra dưới tài khoản của bạn.</li>
                <li>Thông báo cho chúng tôi ngay lập tức về bất kỳ vi phạm bảo mật nào hoặc việc sử dụng trái phép tài khoản của bạn.</li>
            </ul>
            
            <div class="article-highlight">
                <p><strong>Lưu ý:</strong> Bạn có trách nhiệm bảo vệ mật khẩu của mình. CinemaHub không chịu trách nhiệm cho bất kỳ tổn thất nào phát sinh từ việc bạn không tuân thủ các yêu cầu bảo mật này.</p>
            </div>
        `
    },
    {
        id: '4',
        title: 'Đặt vé và thanh toán',
        content: `
            <p>Khi đặt vé thông qua website CinemaHub, bạn đồng ý:</p>
            
            <ul>
                <li>Cung cấp thông tin thanh toán chính xác và hợp lệ.</li>
                <li>Chịu trách nhiệm cho tất cả các khoản phí phát sinh từ việc sử dụng tài khoản và thẻ thanh toán của bạn.</li>
                <li>Thanh toán đầy đủ các khoản phí đã thỏa thuận cho dịch vụ.</li>
            </ul>
            
            <p><strong>Giá vé:</strong> Tất cả giá vé được hiển thị trên website đều bằng VNĐ và có thể thay đổi mà không cần thông báo trước. Giá cuối cùng sẽ được hiển thị rõ ràng trước khi bạn xác nhận đặt vé.</p>
            
            <p><strong>Thanh toán:</strong> Chúng tôi chấp nhận các phương thức thanh toán: thẻ tín dụng/ghi nợ, ví điện tử, thẻ ATM nội địa. Tất cả giao dịch được xử lý an toàn thông qua các cổng thanh toán được bảo mật.</p>
            
            <p><strong>Xác nhận:</strong> Sau khi thanh toán thành công, bạn sẽ nhận được email xác nhận kèm mã đặt vé. Vui lòng kiểm tra email và giữ mã đặt vé để nhận vé tại rạp.</p>
        `
    },
    {
        id: '5',
        title: 'Chính sách hủy và hoàn tiền',
        content: `
            <p><strong>Hủy vé:</strong> Bạn có thể hủy vé trước giờ chiếu ít nhất 2 giờ. Yêu cầu hủy vé có thể được thực hiện thông qua website hoặc liên hệ bộ phận hỗ trợ khách hàng.</p>
            
            <p><strong>Hoàn tiền:</strong> Trong trường hợp hủy vé hợp lệ, tiền hoàn sẽ được trả về tài khoản/thẻ thanh toán ban đầu trong vòng 3-5 ngày làm việc. Phí hủy (nếu có) sẽ được khấu trừ từ số tiền hoàn.</p>
            
            <p><strong>Đổi vé:</strong> Bạn có thể đổi vé sang suất chiếu khác trước giờ chiếu ít nhất 2 giờ. Phí đổi vé (nếu có) sẽ được thông báo khi thực hiện.</p>
            
            <p><strong>Trường hợp không hoàn tiền:</strong> Chúng tôi không hoàn tiền cho các trường hợp:</p>
            <ul>
                <li>Hủy vé sau giờ chiếu đã bắt đầu</li>
                <li>Khách hàng không đến xem phim</li>
                <li>Vé đã được sử dụng hoặc đã nhận tại rạp</li>
            </ul>
        `
    },
    {
        id: '6',
        title: 'Quyền sở hữu trí tuệ',
        content: `
            <p>Tất cả nội dung trên website CinemaHub, bao gồm nhưng không giới hạn ở văn bản, đồ họa, logo, hình ảnh, phần mềm và mã nguồn, đều là tài sản của CinemaHub hoặc các bên cấp phép của chúng tôi và được bảo vệ bởi luật bản quyền Việt Nam và quốc tế.</p>
            
            <p>Bạn không được phép:</p>
            <ul>
                <li>Sao chép, tái sản xuất, phân phối hoặc truyền bá bất kỳ nội dung nào từ website mà không có sự cho phép bằng văn bản của chúng tôi.</li>
                <li>Sử dụng bất kỳ nội dung nào từ website cho mục đích thương mại mà không có sự cho phép.</li>
                <li>Xóa hoặc thay đổi bất kỳ thông báo bản quyền, nhãn hiệu hoặc thông tin sở hữu khác từ bất kỳ nội dung nào.</li>
            </ul>
            
            <p>Việc sử dụng trái phép nội dung có thể dẫn đến các hành động pháp lý và yêu cầu bồi thường thiệt hại.</p>
        `
    },
    {
        id: '7',
        title: 'Hành vi người dùng',
        content: `
            <p>Khi sử dụng dịch vụ CinemaHub, bạn đồng ý không:</p>
            
            <ul>
                <li>Sử dụng dịch vụ cho bất kỳ mục đích bất hợp pháp hoặc trái phép nào.</li>
                <li>Vi phạm bất kỳ luật, quy định địa phương, quốc gia hoặc quốc tế nào.</li>
                <li>Xâm phạm quyền của người khác hoặc vi phạm quyền riêng tư của họ.</li>
                <li>Truyền tải bất kỳ nội dung nào có tính chất đe dọa, lăng mạ, phân biệt đối xử, khiêu dâm hoặc xúc phạm.</li>
                <li>Giả mạo danh tính hoặc cung cấp thông tin sai lệch.</li>
                <li>Can thiệp vào hoạt động bình thường của website hoặc các hệ thống liên quan.</li>
                <li>Sử dụng bất kỳ robot, spider hoặc các phương tiện tự động nào khác để truy cập website.</li>
            </ul>
            
            <div class="article-highlight">
                <p><strong>Cảnh báo:</strong> Vi phạm các quy định này có thể dẫn đến việc chấm dứt quyền truy cập của bạn và có thể dẫn đến các hành động pháp lý.</p>
            </div>
        `
    },
    {
        id: '8',
        title: 'Bảo mật thông tin',
        content: `
            <p>Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Việc thu thập, sử dụng và bảo mật thông tin được điều chỉnh bởi Chính sách Bảo mật của chúng tôi.</p>
            
            <p><strong>Thông tin thu thập:</strong> Chúng tôi có thể thu thập thông tin cá nhân của bạn khi bạn đăng ký tài khoản, đặt vé hoặc sử dụng các dịch vụ khác trên website.</p>
            
            <p><strong>Bảo mật:</strong> Chúng tôi sử dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin của bạn khỏi truy cập, sử dụng hoặc tiết lộ trái phép. Tuy nhiên, không có phương pháp truyền tải qua internet hoặc lưu trữ điện tử nào là 100% an toàn.</p>
            
            <p><strong>Chia sẻ thông tin:</strong> Chúng tôi không bán, cho thuê hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba, trừ khi được yêu cầu bởi pháp luật hoặc với sự đồng ý của bạn.</p>
        `
    },
    {
        id: '9',
        title: 'Giới hạn trách nhiệm',
        content: `
            <p>CinemaHub sẽ không chịu trách nhiệm cho bất kỳ tổn thất trực tiếp, gián tiếp, ngẫu nhiên, đặc biệt hoặc hậu quả nào phát sinh từ:</p>
            
            <ul>
                <li>Việc sử dụng hoặc không thể sử dụng dịch vụ.</li>
                <li>Bất kỳ lỗi, thiếu sót, gián đoạn hoặc chậm trễ trong việc truyền tải.</li>
                <li>Bất kỳ thiệt hại do virus hoặc các thành phần độc hại khác.</li>
                <li>Hành vi của bất kỳ bên thứ ba nào.</li>
                <li>Bất kỳ thay đổi về lịch chiếu, hủy suất chiếu hoặc thay đổi nội dung phim từ phía nhà cung cấp.</li>
            </ul>
            
            <p>Trong mọi trường hợp, trách nhiệm tối đa của CinemaHub sẽ không vượt quá số tiền bạn đã thanh toán cho dịch vụ trong 12 tháng trước đó.</p>
        `
    },
    {
        id: '10',
        title: 'Chấm dứt dịch vụ',
        content: `
            <p>Chúng tôi có quyền chấm dứt hoặc đình chỉ quyền truy cập của bạn vào dịch vụ ngay lập tức, mà không cần thông báo trước, vì bất kỳ lý do nào, bao gồm nhưng không giới hạn ở việc vi phạm các điều khoản này.</p>
            
            <p>Khi chấm dứt dịch vụ:</p>
            <ul>
                <li>Quyền sử dụng dịch vụ của bạn sẽ chấm dứt ngay lập tức.</li>
                <li>Chúng tôi có thể xóa hoặc đình chỉ tài khoản của bạn và tất cả thông tin liên quan.</li>
                <li>Bạn vẫn chịu trách nhiệm cho tất cả các nghĩa vụ và khoản nợ phát sinh trước ngày chấm dứt.</li>
            </ul>
            
            <p>Tất cả các điều khoản mà theo bản chất của chúng sẽ tiếp tục có hiệu lực sau khi chấm dứt sẽ vẫn có hiệu lực.</p>
        `
    },
    {
        id: '11',
        title: 'Luật áp dụng và giải quyết tranh chấp',
        content: `
            <p>Các điều khoản này được điều chỉnh và giải thích theo pháp luật Việt Nam. Bất kỳ tranh chấp nào phát sinh từ hoặc liên quan đến các điều khoản này sẽ được giải quyết thông qua thương lượng thiện chí giữa các bên.</p>
            
            <p>Nếu các bên không thể giải quyết tranh chấp thông qua thương lượng trong vòng 30 ngày, tranh chấp sẽ được đệ trình lên Tòa án có thẩm quyền tại Việt Nam để giải quyết.</p>
            
            <p>Bạn đồng ý rằng bất kỳ hành động pháp lý nào phát sinh từ hoặc liên quan đến các điều khoản này phải được bắt đầu trong vòng một (1) năm sau khi nguyên nhân gây ra hành động phát sinh, nếu không thì hành động đó sẽ bị cấm vĩnh viễn.</p>
        `
    },
    {
        id: '12',
        title: 'Thay đổi điều khoản',
        content: `
            <p>Chúng tôi có quyền cập nhật, thay đổi hoặc thay thế bất kỳ phần nào của các điều khoản này bằng cách đăng các điều khoản mới trên website. Bạn có trách nhiệm xem xét các điều khoản này định kỳ.</p>
            
            <p>Việc bạn tiếp tục sử dụng dịch vụ sau khi các thay đổi được đăng tải sẽ được coi là chấp nhận các điều khoản mới. Nếu bạn không đồng ý với các thay đổi, bạn có thể chấm dứt việc sử dụng dịch vụ.</p>
            
            <p>Chúng tôi sẽ cố gắng thông báo cho bạn về các thay đổi quan trọng bằng cách đăng thông báo trên website hoặc gửi email đến địa chỉ email đã đăng ký.</p>
            
            <p><strong>Ngày có hiệu lực:</strong> Các điều khoản này có hiệu lực từ ngày 01/01/2024 và sẽ tiếp tục có hiệu lực cho đến khi được thay thế hoặc sửa đổi.</p>
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
    const nav = document.getElementById('termsNav');
    if (!nav) return;

    nav.innerHTML = termsData.map(term => `
        <a href="#article-${term.id}" class="nav-item" data-id="${term.id}">
            <i class="fas fa-circle"></i>
            <span>${term.id}. ${term.title}</span>
        </a>
    `).join('');
}

// Generate articles
function generateArticles() {
    const articles = document.getElementById('termsArticles');
    if (!articles) return;

    articles.innerHTML = termsData.map(term => `
        <article class="terms-article" id="article-${term.id}">
            <div class="article-header">
                <div class="article-number">${term.id}</div>
                <h2 class="article-title">${term.title}</h2>
            </div>
            <div class="article-content">
                ${term.content}
            </div>
        </article>
    `).join('');
}

// Initialize scroll spy
function initializeScrollSpy() {
    const articles = document.querySelectorAll('.terms-article');
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
