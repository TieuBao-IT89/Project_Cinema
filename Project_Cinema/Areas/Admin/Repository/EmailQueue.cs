using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace Project_Cinema.Services.Email
{
    public class EmailQueue : IEmailQueue
    {
        private readonly Channel<EmailMessage> _channel;

        public EmailQueue()
        {
            _channel = Channel.CreateUnbounded<EmailMessage>(new UnboundedChannelOptions
            {
                SingleReader = true,
                SingleWriter = false
            });
        }

        internal ChannelReader<EmailMessage> Reader => _channel.Reader;

        public ValueTask QueueAsync(EmailMessage message, CancellationToken cancellationToken = default)
        {
            return _channel.Writer.WriteAsync(message, cancellationToken);
        }
    }
}

