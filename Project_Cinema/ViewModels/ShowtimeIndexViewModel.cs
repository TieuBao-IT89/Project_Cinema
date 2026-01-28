using Project_Cinema.Models;
using System;
using System.Collections.Generic;

namespace Project_Cinema.ViewModels
{
    public class ShowtimeIndexViewModel
    {
        public MovieModel? Movie { get; set; }
        public DateTime? SelectedDate { get; set; }
        public long? SelectedCinemaId { get; set; }
        public List<CinemaShowtimeGroup> Cinemas { get; set; } = new();
    }

    public class CinemaShowtimeGroup
    {
        public long CinemaId { get; set; }
        public string CinemaName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public List<RoomShowtimeGroup> Rooms { get; set; } = new();
    }

    public class RoomShowtimeGroup
    {
        public string RoomType { get; set; } = "2D";
        public List<ShowtimeSlot> Showtimes { get; set; } = new();
    }

    public class ShowtimeSlot
    {
        public long ShowtimeId { get; set; }
        public DateTime StartsAt { get; set; }
        public decimal BasePrice { get; set; }
        public string RoomName { get; set; } = string.Empty;
    }
}
