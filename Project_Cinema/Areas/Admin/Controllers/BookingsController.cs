using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Cinema.Repository;
using Project_Cinema.ViewModels;
using System.Linq;
using System.Threading.Tasks;

namespace Project_Cinema.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class BookingsController : Controller
    {
        private readonly DataContext _dataContext;

        public BookingsController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["AdminTitle"] = "Đặt vé";
            ViewData["AdminActive"] = "Bookings";

            var items = await (from booking in _dataContext.Bookings.AsNoTracking()
                               join showtime in _dataContext.Showtimes.AsNoTracking() on booking.ShowtimeId equals showtime.ShowtimeId
                               join movie in _dataContext.Movies.AsNoTracking() on showtime.MovieId equals movie.MovieId
                               join room in _dataContext.Rooms.AsNoTracking() on showtime.RoomId equals room.RoomId
                               join cinema in _dataContext.Cinemas.AsNoTracking() on room.CinemaId equals cinema.CinemaId
                               join user in _dataContext.Users.AsNoTracking() on booking.UserId equals user.UserId into userJoin
                               from user in userJoin.DefaultIfEmpty()
                               orderby booking.CreatedAt descending
                               select new BookingIndexItem
                               {
                                   BookingId = booking.BookingId,
                                   BookingCode = booking.BookingCode ?? $"BK-{booking.BookingId}",
                                   UserName = user != null ? user.FullName : "Khách",
                                   MovieTitle = movie.Title,
                                   CinemaName = cinema.CinemaName,
                                   StartsAt = showtime.StartsAt,
                                   TotalAmount = booking.TotalAmount,
                                   Status = booking.Status ?? "pending"
                               }).ToListAsync();

            return View(new BookingIndexViewModel { Items = items });
        }
    }
}
