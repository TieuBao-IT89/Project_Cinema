using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Cinema.Repository;
using Project_Cinema.ViewModels;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Project_Cinema.Controllers
{
    public class MovieController : Controller
    {
        private readonly DataContext _dataContext;

        public MovieController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IActionResult> Index()
        {
            var movies = await _dataContext.Movies
                .AsNoTracking()
                .OrderByDescending(movie => movie.ReleaseDate)
                .ThenByDescending(movie => movie.CreatedAt)
                .ToListAsync();

            return View(movies);
        }

        public async Task<IActionResult> Details(long id)
        {
            var movie = await _dataContext.Movies
                .AsNoTracking()
                .FirstOrDefaultAsync(item => item.MovieId == id);

            if (movie == null)
            {
                return NotFound();
            }

            // Load upcoming showtimes for quick booking (next 7 days)
            var fromDate = DateTime.Today;
            var toDate = DateTime.Today.AddDays(7);

            var showtimes = await (from s in _dataContext.Showtimes.AsNoTracking()
                                   join r in _dataContext.Rooms.AsNoTracking() on s.RoomId equals r.RoomId
                                   join c in _dataContext.Cinemas.AsNoTracking() on r.CinemaId equals c.CinemaId
                                   where s.MovieId == id
                                         && s.StartsAt >= fromDate
                                         && s.StartsAt < toDate.AddDays(1)
                                   orderby s.StartsAt, c.CinemaName, r.RoomName
                                   select new MovieShowtimeQuickItem
                                   {
                                       ShowtimeId = s.ShowtimeId,
                                       StartsAt = s.StartsAt,
                                       BasePrice = s.BasePrice,
                                       CinemaId = c.CinemaId,
                                       CinemaName = c.CinemaName,
                                       CinemaAddress = c.Address,
                                       RoomName = r.RoomName,
                                       RoomType = r.RoomType ?? "2D"
                                   })
                .ToListAsync();

            return View(new MovieDetailsViewModel
            {
                Movie = movie,
                Showtimes = showtimes
            });
        }
    }
}
