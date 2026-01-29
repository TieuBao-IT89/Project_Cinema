using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Cinema.Repository;
using Project_Cinema.ViewModels;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Project_Cinema.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class ShowtimesController : Controller
    {
        private readonly DataContext _dataContext;

        public ShowtimesController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["AdminTitle"] = "Lịch chiếu";
            ViewData["AdminActive"] = "Showtimes";

            var items = await (from showtime in _dataContext.Showtimes.AsNoTracking()
                               join movie in _dataContext.Movies.AsNoTracking() on showtime.MovieId equals movie.MovieId
                               join room in _dataContext.Rooms.AsNoTracking() on showtime.RoomId equals room.RoomId
                               join cinema in _dataContext.Cinemas.AsNoTracking() on room.CinemaId equals cinema.CinemaId
                               orderby showtime.StartsAt descending
                               select new ShowtimeIndexItem
                               {
                                   ShowtimeId = showtime.ShowtimeId,
                                   MovieTitle = movie.Title,
                                   CinemaName = cinema.CinemaName,
                                   RoomName = room.RoomName,
                                   RoomType = room.RoomType ?? "2D",
                                   StartsAt = showtime.StartsAt,
                                   BasePrice = showtime.BasePrice
                               }).ToListAsync();

            return View(new AdminShowtimeIndexViewModel { Items = items });
        }

        [HttpGet]
        public async Task<IActionResult> Create()
        {
            ViewData["AdminTitle"] = "Thêm lịch chiếu";
            ViewData["AdminActive"] = "Showtimes";

            var viewModel = new ShowtimeFormViewModel
            {
                Showtime = new Models.ShowtimeModel
                {
                    StartsAt = DateTime.Today.AddHours(9),
                    EndsAt = DateTime.Today.AddHours(11),
                    BasePrice = 120000,
                    Status = "scheduled",
                    CreatedAt = DateTime.Now
                },
                Movies = await _dataContext.Movies.AsNoTracking().OrderBy(m => m.Title).ToListAsync(),
                Rooms = await (from room in _dataContext.Rooms.AsNoTracking()
                               join cinema in _dataContext.Cinemas.AsNoTracking() on room.CinemaId equals cinema.CinemaId
                               orderby cinema.CinemaName, room.RoomName
                               select new RoomOption
                               {
                                   RoomId = room.RoomId,
                                   CinemaName = cinema.CinemaName,
                                   RoomName = room.RoomName,
                                   RoomType = room.RoomType ?? "2D"
                               }).ToListAsync()
            };

            return View(viewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(ShowtimeFormViewModel model)
        {
            ViewData["AdminTitle"] = "Thêm lịch chiếu";
            ViewData["AdminActive"] = "Showtimes";

            await ValidateShowtimeAsync(model.Showtime, excludeShowtimeId: null);

            if (!ModelState.IsValid)
            {
                model.Movies = await _dataContext.Movies.AsNoTracking().OrderBy(m => m.Title).ToListAsync();
                model.Rooms = await (from room in _dataContext.Rooms.AsNoTracking()
                                     join cinema in _dataContext.Cinemas.AsNoTracking() on room.CinemaId equals cinema.CinemaId
                                     orderby cinema.CinemaName, room.RoomName
                                     select new RoomOption
                                     {
                                         RoomId = room.RoomId,
                                         CinemaName = cinema.CinemaName,
                                         RoomName = room.RoomName,
                                         RoomType = room.RoomType ?? "2D"
                                     }).ToListAsync();
                return View(model);
            }

            model.Showtime.CreatedAt = DateTime.Now;
            _dataContext.Showtimes.Add(model.Showtime);
            await _dataContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        [HttpGet]
        public async Task<IActionResult> Edit(long id)
        {
            ViewData["AdminTitle"] = "Cập nhật lịch chiếu";
            ViewData["AdminActive"] = "Showtimes";

            var showtime = await _dataContext.Showtimes.FindAsync(id);
            if (showtime == null)
            {
                return NotFound();
            }

            var viewModel = new ShowtimeFormViewModel
            {
                Showtime = showtime,
                Movies = await _dataContext.Movies.AsNoTracking().OrderBy(m => m.Title).ToListAsync(),
                Rooms = await (from room in _dataContext.Rooms.AsNoTracking()
                               join cinema in _dataContext.Cinemas.AsNoTracking() on room.CinemaId equals cinema.CinemaId
                               orderby cinema.CinemaName, room.RoomName
                               select new RoomOption
                               {
                                   RoomId = room.RoomId,
                                   CinemaName = cinema.CinemaName,
                                   RoomName = room.RoomName,
                                   RoomType = room.RoomType ?? "2D"
                               }).ToListAsync()
            };

            return View(viewModel);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, ShowtimeFormViewModel model)
        {
            ViewData["AdminTitle"] = "Cập nhật lịch chiếu";
            ViewData["AdminActive"] = "Showtimes";

            if (id != model.Showtime.ShowtimeId)
            {
                return BadRequest();
            }

            await ValidateShowtimeAsync(model.Showtime, excludeShowtimeId: id);

            if (!ModelState.IsValid)
            {
                model.Movies = await _dataContext.Movies.AsNoTracking().OrderBy(m => m.Title).ToListAsync();
                model.Rooms = await (from room in _dataContext.Rooms.AsNoTracking()
                                     join cinema in _dataContext.Cinemas.AsNoTracking() on room.CinemaId equals cinema.CinemaId
                                     orderby cinema.CinemaName, room.RoomName
                                     select new RoomOption
                                     {
                                         RoomId = room.RoomId,
                                         CinemaName = cinema.CinemaName,
                                         RoomName = room.RoomName,
                                         RoomType = room.RoomType ?? "2D"
                                     }).ToListAsync();
                return View(model);
            }

            var showtime = await _dataContext.Showtimes.FindAsync(id);
            if (showtime == null)
            {
                return NotFound();
            }

            showtime.MovieId = model.Showtime.MovieId;
            showtime.RoomId = model.Showtime.RoomId;
            showtime.StartsAt = model.Showtime.StartsAt;
            showtime.EndsAt = model.Showtime.EndsAt;
            showtime.BasePrice = model.Showtime.BasePrice;
            showtime.Status = model.Showtime.Status;

            await _dataContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private async Task ValidateShowtimeAsync(Models.ShowtimeModel showtime, long? excludeShowtimeId)
        {
            // ends > starts
            if (showtime.EndsAt <= showtime.StartsAt)
            {
                ModelState.AddModelError("Showtime.EndsAt", "Giờ kết thúc phải lớn hơn giờ bắt đầu.");
            }

            // Overlap in same room
            if (showtime.RoomId <= 0)
            {
                return;
            }

            var overlapQuery = _dataContext.Showtimes.AsNoTracking()
                .Where(s => s.RoomId == showtime.RoomId);

            if (excludeShowtimeId.HasValue)
            {
                overlapQuery = overlapQuery.Where(s => s.ShowtimeId != excludeShowtimeId.Value);
            }

            var overlapped = await overlapQuery
                .Where(s => s.StartsAt < showtime.EndsAt && s.EndsAt > showtime.StartsAt)
                .OrderBy(s => s.StartsAt)
                .FirstOrDefaultAsync();

            if (overlapped != null)
            {
                ModelState.AddModelError(string.Empty,
                    $"Phòng chiếu đã có lịch trùng thời gian: {overlapped.StartsAt:dd/MM/yyyy HH:mm} - {overlapped.EndsAt:dd/MM/yyyy HH:mm}. Vui lòng chọn khung giờ khác.");
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(long id)
        {
            var showtime = await _dataContext.Showtimes.FindAsync(id);
            if (showtime == null)
            {
                return NotFound();
            }

            _dataContext.Showtimes.Remove(showtime);
            await _dataContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
    }
}
