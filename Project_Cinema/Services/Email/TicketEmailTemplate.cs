using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace Project_Cinema.Services.Email
{
    public static class TicketEmailTemplate
    {
        public static EmailMessage BuildTicketEmail(
            string toEmail,
            string customerName,
            string bookingCode,
            string movieTitle,
            string cinemaName,
            string roomName,
            DateTime startsAt,
            IEnumerable<string> seatCodes,
            decimal totalAmount,
            string ticketUrl)
        {
            var seats = string.Join(", ", seatCodes ?? Array.Empty<string>());
            var safeName = WebUtility.HtmlEncode(customerName ?? "");
            var safeCode = WebUtility.HtmlEncode(bookingCode ?? "");
            var safeMovie = WebUtility.HtmlEncode(movieTitle ?? "");
            var safeCinema = WebUtility.HtmlEncode(cinemaName ?? "");
            var safeRoom = WebUtility.HtmlEncode(roomName ?? "");
            var safeSeats = WebUtility.HtmlEncode(seats);
            var safeUrl = WebUtility.HtmlEncode(ticketUrl ?? "");

            var html = $@"
<div style=""font-family:Inter,Arial,sans-serif;background:#f6f7fb;padding:24px"">
  <div style=""max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden"">
    <div style=""padding:18px 20px;background:linear-gradient(135deg,#e50914 0%,#ff6b35 100%);color:#fff"">
      <div style=""font-size:18px;font-weight:800"">CinemaHub</div>
      <div style=""opacity:.95;margin-top:6px"">Vé xem phim của bạn đã được phát hành</div>
    </div>

    <div style=""padding:20px"">
      <div style=""font-size:16px;margin-bottom:12px"">Xin chào <strong>{safeName}</strong>,</div>
      <div style=""color:#475569;line-height:1.6"">
        Cảm ơn bạn đã thanh toán. Dưới đây là thông tin vé của bạn:
      </div>

      <div style=""margin-top:16px;padding:14px 16px;border-radius:14px;border:1px solid rgba(229,9,20,.25);background:rgba(229,9,20,.06)"">
        <div style=""font-size:12px;letter-spacing:.14em;text-transform:uppercase;font-weight:800;color:#991b1b"">Mã đặt vé</div>
        <div style=""font-family:Consolas,monospace;font-size:20px;font-weight:900;color:#e50914;margin-top:6px"">{safeCode}</div>
      </div>

      <table style=""width:100%;margin-top:16px;border-collapse:separate;border-spacing:0 10px"">
        <tr>
          <td style=""width:160px;color:#64748b;font-weight:700"">Phim</td>
          <td style=""color:#0f172a;font-weight:800"">{safeMovie}</td>
        </tr>
        <tr>
          <td style=""color:#64748b;font-weight:700"">Rạp</td>
          <td style=""color:#0f172a;font-weight:800"">{safeCinema}</td>
        </tr>
        <tr>
          <td style=""color:#64748b;font-weight:700"">Phòng</td>
          <td style=""color:#0f172a;font-weight:800"">{safeRoom}</td>
        </tr>
        <tr>
          <td style=""color:#64748b;font-weight:700"">Suất chiếu</td>
          <td style=""color:#0f172a;font-weight:800"">{startsAt:dd/MM/yyyy} {startsAt:HH:mm}</td>
        </tr>
        <tr>
          <td style=""color:#64748b;font-weight:700"">Ghế</td>
          <td style=""color:#0f172a;font-weight:800"">{safeSeats}</td>
        </tr>
        <tr>
          <td style=""color:#64748b;font-weight:700"">Tổng tiền</td>
          <td style=""color:#e50914;font-weight:900"">{totalAmount:N0}đ</td>
        </tr>
      </table>

      <div style=""margin-top:18px;display:flex;gap:12px;flex-wrap:wrap"">
        <a href=""{safeUrl}"" style=""display:inline-block;padding:12px 16px;border-radius:12px;background:#e50914;color:#fff;text-decoration:none;font-weight:800"">
          Xem vé (QR)
        </a>
        <span style=""color:#64748b;align-self:center"">Nếu link yêu cầu đăng nhập, vui lòng đăng nhập đúng tài khoản đã đặt vé.</span>
      </div>
    </div>

    <div style=""padding:14px 20px;background:#f8fafc;border-top:1px solid #e5e7eb;color:#64748b;font-size:12px"">
      <div>Vui lòng đến rạp trước 15 phút so với giờ chiếu.</div>
    </div>
  </div>
</div>";

            var text = string.Join("\n", new[]
            {
                "CinemaHub - Vé xem phim",
                $"Mã đặt vé: {bookingCode}",
                $"Phim: {movieTitle}",
                $"Rạp: {cinemaName}",
                $"Phòng: {roomName}",
                $"Suất chiếu: {startsAt:dd/MM/yyyy HH:mm}",
                $"Ghế: {seats}",
                $"Tổng tiền: {totalAmount:N0}đ",
                $"Xem vé: {ticketUrl}"
            });

            return new EmailMessage
            {
                To = new List<string> { toEmail },
                Subject = $"[CinemaHub] Vé của bạn - {safeCode}",
                HtmlBody = html,
                TextBody = text
            };
        }
    }
}

