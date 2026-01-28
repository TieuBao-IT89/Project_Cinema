using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Cinema.Repository;
using Project_Cinema.ViewModels;
using System.Linq;
using System.Threading.Tasks;

namespace Project_Cinema.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class SeatsController : Controller
    {
        private readonly DataContext _dataContext;

        public SeatsController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["AdminTitle"] = "Sơ đồ ghế";
            ViewData["AdminActive"] = "Seats";

            var items = await (from seat in _dataContext.Seats.AsNoTracking()
                               join room in _dataContext.Rooms.AsNoTracking() on seat.RoomId equals room.RoomId
                               join cinema in _dataContext.Cinemas.AsNoTracking() on room.CinemaId equals cinema.CinemaId
                               orderby cinema.CinemaName, room.RoomName, seat.SeatRow, seat.SeatNumber
                               select new SeatIndexItem
                               {
                                   SeatId = seat.SeatId,
                                   CinemaName = cinema.CinemaName,
                                   RoomName = room.RoomName,
                                   SeatRow = seat.SeatRow,
                                   SeatNumber = seat.SeatNumber,
                                   SeatType = seat.SeatType ?? "regular",
                                   Status = seat.Status ?? "active"
                               }).ToListAsync();

            return View(new SeatIndexViewModel { Items = items });
        }

        [HttpGet]
        public async Task<IActionResult> Create()
        {
            ViewData["AdminTitle"] = "Thêm ghế";
            ViewData["AdminActive"] = "Seats";

            var rooms = await (from room in _dataContext.Rooms.AsNoTracking()
                               join cinema in _dataContext.Cinemas.AsNoTracking() on room.CinemaId equals cinema.CinemaId
                               orderby cinema.CinemaName, room.RoomName
                               select new SeatRoomOption
                               {
                                   RoomId = room.RoomId,
                                   CinemaName = cinema.CinemaName,
                                   RoomName = room.RoomName
                               }).ToListAsync();

            return View(new SeatFormViewModel
            {
                Seat = new Models.SeatModel { Status = "active", SeatType = "regular" },
                Rooms = rooms
            });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(SeatFormViewModel model)
        {
            ViewData["AdminTitle"] = "Thêm ghế";
            ViewData["AdminActive"] = "Seats";

            if (!ModelState.IsValid)
            {
                model.Rooms = await (from room in _dataContext.Rooms.AsNoTracking()
                                     join cinema in _dataContext.Cinemas.AsNoTracking() on room.CinemaId equals cinema.CinemaId
                                     orderby cinema.CinemaName, room.RoomName
                                     select new SeatRoomOption
                                     {
                                         RoomId = room.RoomId,
                                         CinemaName = cinema.CinemaName,
                                         RoomName = room.RoomName
                                     }).ToListAsync();
                return View(model);
            }

            _dataContext.Seats.Add(model.Seat);
            await _dataContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        [HttpGet]
        public async Task<IActionResult> Edit(long id)
        {
            ViewData["AdminTitle"] = "Cập nhật ghế";
            ViewData["AdminActive"] = "Seats";

            var seat = await _dataContext.Seats.FindAsync(id);
            if (seat == null)
            {
                return NotFound();
            }

            var rooms = await (from room in _dataContext.Rooms.AsNoTracking()
                               join cinema in _dataContext.Cinemas.AsNoTracking() on room.CinemaId equals cinema.CinemaId
                               orderby cinema.CinemaName, room.RoomName
                               select new SeatRoomOption
                               {
                                   RoomId = room.RoomId,
                                   CinemaName = cinema.CinemaName,
                                   RoomName = room.RoomName
                               }).ToListAsync();

            return View(new SeatFormViewModel
            {
                Seat = seat,
                Rooms = rooms
            });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, SeatFormViewModel model)
        {
            ViewData["AdminTitle"] = "Cập nhật ghế";
            ViewData["AdminActive"] = "Seats";

            if (id != model.Seat.SeatId)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                model.Rooms = await (from room in _dataContext.Rooms.AsNoTracking()
                                     join cinema in _dataContext.Cinemas.AsNoTracking() on room.CinemaId equals cinema.CinemaId
                                     orderby cinema.CinemaName, room.RoomName
                                     select new SeatRoomOption
                                     {
                                         RoomId = room.RoomId,
                                         CinemaName = cinema.CinemaName,
                                         RoomName = room.RoomName
                                     }).ToListAsync();
                return View(model);
            }

            var seat = await _dataContext.Seats.FindAsync(id);
            if (seat == null)
            {
                return NotFound();
            }

            seat.RoomId = model.Seat.RoomId;
            seat.SeatRow = model.Seat.SeatRow;
            seat.SeatNumber = model.Seat.SeatNumber;
            seat.SeatType = model.Seat.SeatType;
            seat.Status = model.Seat.Status;

            await _dataContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(long id)
        {
            var seat = await _dataContext.Seats.FindAsync(id);
            if (seat == null)
            {
                return NotFound();
            }

            _dataContext.Seats.Remove(seat);
            await _dataContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
    }
}
