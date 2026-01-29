using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Project_Cinema.Services.Email
{
    public class EmailQueueHostedService : BackgroundService
    {
        private readonly EmailQueue _queue;
        private readonly IEmailSender _sender;
        private readonly ILogger<EmailQueueHostedService> _logger;

        public EmailQueueHostedService(EmailQueue queue, IEmailSender sender, ILogger<EmailQueueHostedService> logger)
        {
            _queue = queue;
            _sender = sender;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Email queue hosted service started");

            await foreach (var message in _queue.Reader.ReadAllAsync(stoppingToken))
            {
                try
                {
                    await _sender.SendAsync(message, stoppingToken);
                }
                catch (Exception ex)
                {
                    // For now: log and continue. Later you can add retry + dead-letter storage.
                    _logger.LogError(ex, "Email send failed (queued). Subject={Subject}", message.Subject);
                }
            }
        }
    }
}

