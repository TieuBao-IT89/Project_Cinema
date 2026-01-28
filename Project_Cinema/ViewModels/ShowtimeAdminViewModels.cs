using Project_Cinema.Models;
using System;
using System.Collections.Generic;

namespace Project_Cinema.ViewModels
{
    public class ShowtimeIndexItem
    {
        public long ShowtimeId { get; set; }
        public string MovieTitle { get; set; } = string.Empty;
        public string CinemaName { get; set; } = string.Empty;
        public string RoomName { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
        public DateTime StartsAt { get; set; }
        public decimal BasePrice { get; set; }
    }

    public class AdminShowtimeIndexViewModel
    {
        public List<ShowtimeIndexItem> Items { get; set; } = new();
    }

    public class RoomOption
    {
        public long RoomId { get; set; }
        public string CinemaName { get; set; } = string.Empty;
        public string RoomName { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
    }

    public class ShowtimeFormViewModel
    {
        public ShowtimeModel Showtime { get; set; } = new();
        public List<MovieModel> Movies { get; set; } = new();
        public List<RoomOption> Rooms { get; set; } = new();
    }
}
