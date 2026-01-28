using Project_Cinema.Models;
using System.Collections.Generic;

namespace Project_Cinema.ViewModels
{
    public class RoomIndexItem
    {
        public long RoomId { get; set; }
        public string CinemaName { get; set; } = string.Empty;
        public string RoomName { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class RoomIndexViewModel
    {
        public List<RoomIndexItem> Items { get; set; } = new();
    }

    public class RoomFormViewModel
    {
        public RoomModel Room { get; set; } = new();
        public List<CinemaModel> Cinemas { get; set; } = new();
    }

    public class SeatIndexItem
    {
        public long SeatId { get; set; }
        public string CinemaName { get; set; } = string.Empty;
        public string RoomName { get; set; } = string.Empty;
        public string SeatRow { get; set; } = string.Empty;
        public int SeatNumber { get; set; }
        public string SeatType { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class SeatIndexViewModel
    {
        public List<SeatIndexItem> Items { get; set; } = new();
    }

    public class SeatRoomOption
    {
        public long RoomId { get; set; }
        public string CinemaName { get; set; } = string.Empty;
        public string RoomName { get; set; } = string.Empty;
    }

    public class SeatFormViewModel
    {
        public SeatModel Seat { get; set; } = new();
        public List<SeatRoomOption> Rooms { get; set; } = new();
    }
}
