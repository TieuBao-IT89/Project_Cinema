using System;
using System.Collections.Generic;

namespace Project_Cinema.ViewModels
{
    public class BookingSuccessViewModel
    {
        public long BookingId { get; set; }
        public string BookingCode { get; set; } = string.Empty;
        public string CustomerEmail { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;

        public long MovieId { get; set; }
        public string MovieTitle { get; set; } = string.Empty;
        public string CinemaName { get; set; } = string.Empty;
        public string CinemaAddress { get; set; } = string.Empty;
        public string RoomName { get; set; } = string.Empty;
        public DateTime StartsAt { get; set; }

        public List<string> SeatCodes { get; set; } = new();
        public decimal TotalAmount { get; set; }

        public string PaymentMethod { get; set; } = string.Empty;
        public string ProviderTxn { get; set; } = string.Empty;
    }
}

