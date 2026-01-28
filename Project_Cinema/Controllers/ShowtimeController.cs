using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Cinema.Repository;
using Project_Cinema.ViewModels;
using System;
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

        public async Task<IActionResult> Index(long movieId, long? cinemaId = null, DateTime? date = null)
        {
            var selectedDate = date?.Date ?? DateTime.Today;

            var movie = await _dataContext.Movies
                .AsNoTracking()
                .FirstOrDefaultAsync(item => item.MovieId == movieId);

            if (movie == null)
            {
                return NotFound();
            }

            var query = from showtime in _dataContext.Showtimes.AsNoTracking()
                        join room in _dataContext.Rooms.AsNoTracking() on showtime.RoomId equals room.RoomId
                        join cinema in _dataContext.Cinemas.AsNoTracking() on room.CinemaId equals cinema.CinemaId
                        where showtime.MovieId == movieId
                              && showtime.StartsAt.Date == selectedDate
                              && (cinemaId == null || cinema.CinemaId == cinemaId)
                        orderby cinema.CinemaName, room.RoomType, showtime.StartsAt
                        select new
                        {
                            cinema.CinemaId,
                            cinema.CinemaName,
                            cinema.Address,
                            room.RoomType,
                            room.RoomName,
                            showtime.ShowtimeId,
                            showtime.StartsAt,
                            showtime.BasePrice
                        };

            var rawItems = await query.ToListAsync();

            var grouped = rawItems
                .GroupBy(item => new { item.CinemaId, item.CinemaName, item.Address })
                .Select(cinemaGroup => new CinemaShowtimeGroup
                {
                    CinemaId = cinemaGroup.Key.CinemaId,
                    CinemaName = cinemaGroup.Key.CinemaName,
                    Address = cinemaGroup.Key.Address,
                    Rooms = cinemaGroup
                        .GroupBy(item => item.RoomType ?? "2D")
                        .Select(roomGroup => new RoomShowtimeGroup
                        {
                            RoomType = roomGroup.Key,
                            Showtimes = roomGroup.Select(slot => new ShowtimeSlot
                            {
                                ShowtimeId = slot.ShowtimeId,
                                StartsAt = slot.StartsAt,
                                BasePrice = slot.BasePrice,
                                RoomName = slot.RoomName
                            }).ToList()
                        }).ToList()
                }).ToList();

            var viewModel = new ShowtimeIndexViewModel
            {
                Movie = movie,
                SelectedDate = selectedDate,
                SelectedCinemaId = cinemaId,
                Cinemas = grouped
            };

            return View(viewModel);
        }
    }
}
