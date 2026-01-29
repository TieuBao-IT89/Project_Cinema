using Microsoft.AspNetCore.Mvc;
using Project_Cinema.Services.Email;
using System.Threading.Tasks;

namespace Project_Cinema.Controllers
{
    // DEV ONLY: quick endpoint to verify SMTP configuration.
    public class DevEmailController : Controller
    {
        private readonly IEmailQueue _emailQueue;

        public DevEmailController(IEmailQueue emailQueue)
        {
            _emailQueue = emailQueue;
        }

        [HttpGet]
        public async Task<IActionResult> Test(string to, string? subject = null)
        {
            if (string.IsNullOrWhiteSpace(to))
            {
                return BadRequest("Missing 'to' query string.");
            }

            await _emailQueue.QueueAsync(new EmailMessage
            {
                To = new() { to.Trim() },
                Subject = subject ?? "CinemaHub test email",
                HtmlBody = "<h2>CinemaHub</h2><p>SMTP test email.</p>",
                TextBody = "CinemaHub - SMTP test email."
            });

            return Ok("Queued email.");
        }
    }
}

