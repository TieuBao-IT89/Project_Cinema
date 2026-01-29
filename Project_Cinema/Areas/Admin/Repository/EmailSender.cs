using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading;
using System.Threading.Tasks;

namespace Project_Cinema.Services.Email
{
    public class EmailSender : IEmailSender
    {
        private readonly EmailSenderOptions _options;
        private readonly ILogger<EmailSender> _logger;

        public EmailSender(IOptions<EmailSenderOptions> options, ILogger<EmailSender> logger)
        {
            _options = options.Value;
            _logger = logger;
        }

        public async Task SendAsync(EmailMessage message, CancellationToken cancellationToken = default)
        {
            if (message == null) throw new ArgumentNullException(nameof(message));
            if (message.To == null || message.To.Count == 0) throw new ArgumentException("Email 'To' is required.", nameof(message));
            if (string.IsNullOrWhiteSpace(message.Subject)) throw new ArgumentException("Email 'Subject' is required.", nameof(message));
            if (string.IsNullOrWhiteSpace(message.HtmlBody) && string.IsNullOrWhiteSpace(message.TextBody))
                throw new ArgumentException("Email body is required (HtmlBody or TextBody).", nameof(message));

            if (string.IsNullOrWhiteSpace(_options.Host))
                throw new InvalidOperationException("Email:Host is not configured.");

            var fromEmail = string.IsNullOrWhiteSpace(_options.FromEmail) ? _options.UserName : _options.FromEmail;
            if (string.IsNullOrWhiteSpace(fromEmail))
                throw new InvalidOperationException("Email:FromEmail (or Email:UserName) is not configured.");

            using var mail = new MailMessage
            {
                From = new MailAddress(fromEmail, _options.FromName),
                Subject = message.Subject,
                Body = message.TextBody ?? StripHtml(message.HtmlBody ?? string.Empty),
                IsBodyHtml = false
            };

            foreach (var to in message.To.Where(x => !string.IsNullOrWhiteSpace(x)))
            {
                mail.To.Add(to.Trim());
            }

            if (!string.IsNullOrWhiteSpace(message.HtmlBody))
            {
                var htmlView = AlternateView.CreateAlternateViewFromString(message.HtmlBody, null, "text/html");
                mail.AlternateViews.Add(htmlView);
            }

            if (!string.IsNullOrWhiteSpace(message.TextBody))
            {
                var textView = AlternateView.CreateAlternateViewFromString(message.TextBody, null, "text/plain");
                mail.AlternateViews.Add(textView);
            }

            using var client = new SmtpClient(_options.Host, _options.Port)
            {
                EnableSsl = _options.UseSsl,
                UseDefaultCredentials = false,
                Credentials = string.IsNullOrWhiteSpace(_options.UserName)
                    ? CredentialCache.DefaultNetworkCredentials
                    : new NetworkCredential(_options.UserName, _options.Password),
                DeliveryMethod = SmtpDeliveryMethod.Network
            };

            try
            {
                // SmtpClient doesn't support cancellation token natively
                cancellationToken.ThrowIfCancellationRequested();
                await client.SendMailAsync(mail);
                _logger.LogInformation("Email sent to {To} subject {Subject}", string.Join(",", mail.To.Select(x => x.Address)), message.Subject);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send email to {To} subject {Subject}", string.Join(",", mail.To.Select(x => x.Address)), message.Subject);
                throw;
            }
        }

        private static string StripHtml(string html)
        {
            // very small fallback; templates should include TextBody ideally
            return html.Replace("<br>", "\n").Replace("<br/>", "\n").Replace("<br />", "\n");
        }
    }
}
