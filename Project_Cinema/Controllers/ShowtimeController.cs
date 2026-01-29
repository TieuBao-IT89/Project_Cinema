using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Cinema.Repository;
using Project_Cinema.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project_Cinema.Controllers
{
    public class ShowtimeController : Controller
    {
        private readonly DataContext _dataContext;

        public ShowtimeController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IActionResult> Index(long? movieId = null, long? cinemaId = null, DateTime? date = null)
        {
            var selectedDate = date?.Date ?? DateTime.Today;

            // Dropdown options
            var cinemaOptions = await _dataContext.Cinemas.AsNoTracking()
                .OrderBy(c => c.CinemaName)
                .Select(c => new CinemaOption { CinemaId = c.CinemaId, CinemaName = c.CinemaName })
                .ToListAsync();

            // Movies that have showtimes for the selected date (and cinema filter), fallback to all movies
            var moviesForDate = await (from s in _dataContext.Showtimes.AsNoTracking()
                                       join r in _dataContext.Rooms.AsNoTracking() on s.RoomId equals r.RoomId
                                       where s.StartsAt.Date == selectedDate
                                             && (cinemaId == null || r.CinemaId == cinemaId)
                                       select s.MovieId)
                .Distinct()
                .ToListAsync();

            var moviesQuery = _dataContext.Movies.AsNoTracking().AsQueryable();
            if (moviesForDate.Count > 0)
            {
                moviesQuery = moviesQuery.Where(m => moviesForDate.Contains(m.MovieId));
            }

            var movieOptions = await moviesQuery
                .OrderBy(m => m.Title)
                .Select(m => new MovieOption { MovieId = m.MovieId, Title = m.Title })
                .ToListAsync();

            var selectedMovieId = (movieId ?? 0) > 0 ? movieId!.Value : movieOptions.FirstOrDefault()?.MovieId;

            var movie = selectedMovieId != null
                ? await _dataContext.Movies.AsNoTracking().FirstOrDefaultAsync(m => m.MovieId == selectedMovieId.Value)
                : null;

            var query = from showtime in _dataContext.Showtimes.AsNoTracking()
                        join room in _dataContext.Rooms.AsNoTracking() on showtime.RoomId equals room.RoomId
                        join cinema in _dataContext.Cinemas.AsNoTracking() on room.CinemaId equals cinema.CinemaId
                        where (selectedMovieId == null || showtime.MovieId == selectedMovieId)
                              && showtime.StartsAt.Date == selectedDate
                              && (cinemaId == null || cinema.CinemaId == cinemaId)
                        orderby cinema.CinemaName, room.RoomName, showtime.StartsAt
                        select new
                        {
                            cinema.CinemaId,
                            cinema.CinemaName,
                            cinema.Address,
                            room.RoomId,
                            room.RoomType,
                            room.RoomName,
                            showtime.ShowtimeId,
                            showtime.StartsAt,
                            showtime.BasePrice
                        };

            var rawItems = await query.ToListAsync();

            // Seat availability (based on current bookings/holds)
            var now = DateTime.Now;
            var roomIds = rawItems.Select(x => x.RoomId).Distinct().ToList();
            var showtimeIds = rawItems.Select(x => x.ShowtimeId).Distinct().ToList();

            var activeSeatsByRoom = new Dictionary<long, int>();
            if (roomIds.Count > 0)
            {
                activeSeatsByRoom = await _dataContext.Seats.AsNoTracking()
                    .Where(s => roomIds.Contains(s.RoomId) && (s.Status ?? "active") == "active")
                    .GroupBy(s => s.RoomId)
                    .Select(g => new { RoomId = g.Key, Total = g.Count() })
                    .ToDictionaryAsync(x => x.RoomId, x => x.Total);
            }

            var takenSeatsByShowtime = new Dictionary<long, int>();
            if (showtimeIds.Count > 0)
            {
                var takenRows = await (from bi in _dataContext.BookingItems.AsNoTracking()
                                       join b in _dataContext.Bookings.AsNoTracking() on bi.BookingId equals b.BookingId
                                       where showtimeIds.Contains(bi.ShowtimeId)
                                             && (b.Status == "paid"
                                                 || b.Status == "confirmed"
                                                 || (b.Status == "held" && b.ExpiresAt != null && b.ExpiresAt > now)
                                                 || (b.Status == "pending" && b.ExpiresAt != null && b.ExpiresAt > now))
                                       select new { bi.ShowtimeId, bi.SeatId })
                    .Distinct()
                    .ToListAsync();

                takenSeatsByShowtime = takenRows
                    .GroupBy(x => x.ShowtimeId)
                    .ToDictionary(g => g.Key, g => g.Count());
            }

            var grouped = rawItems
                .GroupBy(item => new { item.CinemaId, item.CinemaName, item.Address })
                .Select(cinemaGroup => new CinemaShowtimeGroup
                {
                    CinemaId = cinemaGroup.Key.CinemaId,
                    CinemaName = cinemaGroup.Key.CinemaName,
                    Address = cinemaGroup.Key.Address,
                    Rooms = cinemaGroup
                        .GroupBy(item => new { item.RoomId, item.RoomName, RoomType = item.RoomType ?? "2D" })
                        .Select(roomGroup => new RoomShowtimeGroup
                        {
                            RoomId = roomGroup.Key.RoomId,
                            RoomName = roomGroup.Key.RoomName,
                            RoomType = roomGroup.Key.RoomType,
                            Showtimes = roomGroup.Select(slot => new ShowtimeSlot
                            {
                                ShowtimeId = slot.ShowtimeId,
                                StartsAt = slot.StartsAt,
                                BasePrice = slot.BasePrice,
                                TotalSeats = activeSeatsByRoom.TryGetValue(roomGroup.Key.RoomId, out var total) ? total : 0,
                                AvailableSeats = Math.Max(0, (activeSeatsByRoom.TryGetValue(roomGroup.Key.RoomId, out var t) ? t : 0)
                                                            - (takenSeatsByShowtime.TryGetValue(slot.ShowtimeId, out var taken) ? taken : 0))
                            }).ToList()
                        }).ToList()
                }).ToList();

            // Label availability
            foreach (var c in grouped)
            {
                foreach (var r in c.Rooms)
                {
                    foreach (var s in r.Showtimes)
                    {
                        if (s.TotalSeats <= 0)
                        {
                            s.AvailabilityClass = "ok";
                            s.AvailabilityLabel = "";
                            continue;
                        }

                        if (s.AvailableSeats <= 0)
                        {
                            s.AvailabilityClass = "soldout";
                            s.AvailabilityLabel = "Hết chỗ";
                        }
                        else
                        {
                            var ratio = (double)s.AvailableSeats / s.TotalSeats;
                            if (s.AvailableSeats <= 10 || ratio <= 0.2)
                            {
                                s.AvailabilityClass = "low";
                                s.AvailabilityLabel = "Ít chỗ";
                            }
                            else
                            {
                                s.AvailabilityClass = "ok";
                                s.AvailabilityLabel = "Còn chỗ";
                            }
                        }
                    }
                }
            }

            var viewModel = new ShowtimeIndexViewModel
            {
                Movie = movie,
                SelectedMovieId = selectedMovieId,
                SelectedDate = selectedDate,
                SelectedCinemaId = cinemaId,
                Movies = movieOptions,
                CinemaOptions = cinemaOptions,
                Cinemas = grouped
            };

            return View(viewModel);
        }
    }
}
