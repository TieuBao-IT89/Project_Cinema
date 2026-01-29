using System.Collections.Generic;

namespace Project_Cinema.ViewModels
{
    public class SeatMapSeat
    {
        public long SeatId { get; set; }
        public string Row { get; set; } = string.Empty;
        public int Number { get; set; }
        public string Code => $"{Row}{Number}";
        public string SeatType { get; set; } = "regular";
        public string Status { get; set; } = "active";
    }

    public class SeatMapRow
    {
        public string Row { get; set; } = string.Empty;
        public List<SeatMapSeat> Seats { get; set; } = new();
    }

    public class AdminSeatMapViewModel
    {
        public List<SeatRoomOption> Rooms { get; set; } = new();
        public long SelectedRoomId { get; set; }
        public string SelectedRoomLabel { get; set; } = string.Empty;
        public List<SeatMapRow> Rows { get; set; } = new();

        public SeatMapSeat? SelectedSeat { get; set; }
    }

    public class SeatUpdateRequest
    {
        public long SeatId { get; set; }
        public string SeatType { get; set; } = "regular";
        public string Status { get; set; } = "active";
    }
}

