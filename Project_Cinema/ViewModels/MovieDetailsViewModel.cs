using Project_Cinema.Models;
using System;
using System.Collections.Generic;

namespace Project_Cinema.ViewModels
{
    public class MovieDetailsViewModel
    {
        public MovieModel Movie { get; set; } = null!;
        public List<MovieShowtimeQuickItem> Showtimes { get; set; } = new();
    }

    public class MovieShowtimeQuickItem
    {
        public long ShowtimeId { get; set; }
        public DateTime StartsAt { get; set; }
        public decimal BasePrice { get; set; }

        public long CinemaId { get; set; }
        public string CinemaName { get; set; } = string.Empty;
        public string CinemaAddress { get; set; } = string.Empty;

        public string RoomName { get; set; } = string.Empty;
        public string RoomType { get; set; } = string.Empty;
    }
}

