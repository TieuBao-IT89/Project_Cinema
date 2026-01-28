using System;
using System.Collections.Generic;

namespace Project_Cinema.ViewModels
{
    public class BookingIndexItem
    {
        public long BookingId { get; set; }
        public string BookingCode { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string MovieTitle { get; set; } = string.Empty;
        public string CinemaName { get; set; } = string.Empty;
        public DateTime StartsAt { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class BookingIndexViewModel
    {
        public List<BookingIndexItem> Items { get; set; } = new();
    }

    public class PaymentIndexItem
    {
        public long PaymentId { get; set; }
        public string BookingCode { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Method { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime? PaidAt { get; set; }
    }

    public class PaymentIndexViewModel
    {
        public List<PaymentIndexItem> Items { get; set; } = new();
    }
}
