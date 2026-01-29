using System.Collections.Generic;

namespace Project_Cinema.Services.Email
{
    public class EmailMessage
    {
        public List<string> To { get; set; } = new();
        public string Subject { get; set; } = string.Empty;
        public string? HtmlBody { get; set; }
        public string? TextBody { get; set; }
    }
}

