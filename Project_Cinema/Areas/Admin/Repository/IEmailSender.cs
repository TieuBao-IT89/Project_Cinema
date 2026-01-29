using System.Threading;
using System.Threading.Tasks;

namespace Project_Cinema.Services.Email
{
    public interface IEmailSender
    {
        Task SendAsync(EmailMessage message, CancellationToken cancellationToken = default);
    }

    public interface IEmailQueue
    {
        ValueTask QueueAsync(EmailMessage message, CancellationToken cancellationToken = default);
    }
}
