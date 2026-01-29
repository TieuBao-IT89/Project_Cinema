using Project_Cinema.Models;
using System;
using System.Collections.Generic;

namespace Project_Cinema.ViewModels
{
    public class ShowtimeIndexViewModel
    {
        public MovieModel? Movie { get; set; }
        public long? SelectedMovieId { get; set; }
        public DateTime SelectedDate { get; set; }
        public long? SelectedCinemaId { get; set; }

        // Filter options (to avoid dropdown being limited to results)
        public List<MovieOption> Movies { get; set; } = new();
        public List<CinemaOption> CinemaOptions { get; set; } = new();

        public List<CinemaShowtimeGroup> Cinemas { get; set; } = new();
    }

    public class MovieOption
    {
        public long MovieId { get; set; }
        public string Title { get; set; } = string.Empty;
    }

    public class CinemaOption
    {
        public long CinemaId { get; set; }
        public string CinemaName { get; set; } = string.Empty;
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
        public long RoomId { get; set; }
        public string RoomName { get; set; } = string.Empty;
        public string RoomType { get; set; } = "2D";
        public List<ShowtimeSlot> Showtimes { get; set; } = new();
    }

    public class ShowtimeSlot
    {
        public long ShowtimeId { get; set; }
        public DateTime StartsAt { get; set; }
        public decimal BasePrice { get; set; }

        public int TotalSeats { get; set; }
        public int AvailableSeats { get; set; }
        public string AvailabilityLabel { get; set; } = string.Empty; // Hết chỗ / Ít chỗ / Còn chỗ
        public string AvailabilityClass { get; set; } = "ok";         // soldout / low / ok
    }
}
