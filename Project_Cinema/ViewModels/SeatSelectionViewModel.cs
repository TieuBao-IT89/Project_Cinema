using System;
using System.Collections.Generic;

namespace Project_Cinema.ViewModels
{
    public class SeatSelectionSeat
    {
        public long SeatId { get; set; }
        public string Row { get; set; } = string.Empty;
        public int Number { get; set; }
        public string Code => $"{Row}{Number}";
        public string SeatType { get; set; } = "regular";
        public string Status { get; set; } = "active";
        public bool IsUnavailable { get; set; }
        public decimal Price { get; set; }
    }

    public class SeatSelectionRow
    {
        public string Row { get; set; } = string.Empty;
        public List<SeatSelectionSeat> Seats { get; set; } = new();
    }

    public class SeatSelectionViewModel
    {
        public long ShowtimeId { get; set; }
        public long MovieId { get; set; }
        public string MovieTitle { get; set; } = string.Empty;
        public string CinemaName { get; set; } = string.Empty;
        public string RoomName { get; set; } = string.Empty;
        public DateTime StartsAt { get; set; }
        public decimal BasePrice { get; set; }
        public List<SeatSelectionRow> Rows { get; set; } = new();

        // POST binding
        public List<long> SelectedSeatIds { get; set; } = new();
    }
}

