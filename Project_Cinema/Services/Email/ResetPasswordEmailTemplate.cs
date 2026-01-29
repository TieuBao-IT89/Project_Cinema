using System;
using System.Net;

namespace Project_Cinema.Services.Email
{
    public static class ResetPasswordEmailTemplate
    {
        public static EmailMessage Build(string toEmail, string fullName, string resetUrl, int ttlMinutes, string? ip, string? userAgent)
        {
            var safeName = WebUtility.HtmlEncode(fullName ?? "");
            var safeUrl = WebUtility.HtmlEncode(resetUrl ?? "");
            var safeIp = WebUtility.HtmlEncode(ip ?? "unknown");
            var safeUa = WebUtility.HtmlEncode(string.IsNullOrWhiteSpace(userAgent) ? "unknown device" : userAgent);

            var html = $@"
<div style=""font-family:Inter,Arial,sans-serif;background:#f6f7fb;padding:24px"">
  <div style=""max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;overflow:hidden"">
    <div style=""padding:18px 20px;background:linear-gradient(135deg,#e50914 0%,#ff6b35 100%);color:#fff"">
      <div style=""font-size:18px;font-weight:800"">CinemaHub</div>
      <div style=""opacity:.95;margin-top:6px"">Khôi phục mật khẩu</div>
    </div>
    <div style=""padding:20px"">
      <div style=""font-size:16px;margin-bottom:10px"">Xin chào <strong>{safeName}</strong>,</div>
      <div style=""color:#475569;line-height:1.6"">
        Bạn vừa yêu cầu khôi phục mật khẩu. Nhấn nút bên dưới để đặt lại mật khẩu. Link có hiệu lực trong <strong>{ttlMinutes} phút</strong>.
      </div>
      <div style=""margin-top:16px"">
        <a href=""{safeUrl}"" style=""display:inline-block;padding:12px 16px;border-radius:12px;background:#e50914;color:#fff;text-decoration:none;font-weight:800"">
          Đặt lại mật khẩu
        </a>
      </div>
      <div style=""margin-top:16px;padding:12px 14px;border-radius:14px;border:1px solid rgba(15,23,42,.08);background:#f8fafc;color:#334155"">
        <div style=""font-weight:800;margin-bottom:6px"">Cảnh báo bảo mật</div>
        <div style=""font-size:13px;line-height:1.6"">
          Nếu bạn <strong>không</strong> yêu cầu khôi phục mật khẩu, vui lòng bỏ qua email này và cân nhắc đổi mật khẩu ngay.
          <br/>IP: <strong>{safeIp}</strong>
          <br/>Thiết bị/Trình duyệt: <strong>{safeUa}</strong>
        </div>
      </div>
    </div>
  </div>
</div>";

            var text = string.Join("\n", new[]
            {
                "CinemaHub - Reset password",
                "",
                $"Xin chào {fullName}",
                "",
                $"Link đặt lại mật khẩu ({ttlMinutes} phút): {resetUrl}",
                "",
                "Cảnh báo bảo mật:",
                "Nếu bạn không yêu cầu, hãy bỏ qua email này và cân nhắc đổi mật khẩu.",
                $"IP: {ip ?? "unknown"}",
                $"Device: {userAgent ?? "unknown"}"
            });

            return new EmailMessage
            {
                To = new() { toEmail },
                Subject = "[CinemaHub] Đặt lại mật khẩu",
                HtmlBody = html,
                TextBody = text
            };
        }
    }
}

