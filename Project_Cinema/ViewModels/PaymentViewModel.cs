using System;
using System.Collections.Generic;

namespace Project_Cinema.ViewModels
{
    public class PaymentViewModel
    {
        public long BookingId { get; set; }
        public string BookingCode { get; set; } = string.Empty;
        public long MovieId { get; set; }
        public string MovieTitle { get; set; } = string.Empty;
        public string CinemaName { get; set; } = string.Empty;
        public string RoomName { get; set; } = string.Empty;
        public DateTime StartsAt { get; set; }
        public List<string> SeatCodes { get; set; } = new();
        public decimal TotalAmount { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public bool IsExpired { get; set; }

        // Prefill from account
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
    }

    public class ProcessPaymentRequest
    {
        public long BookingId { get; set; }
        public string Method { get; set; } = "momo";
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}

