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

        public async Task<IActionResult> Index(long? roomId = null)
        {
            ViewData["AdminTitle"] = "Sơ đồ ghế";
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

            if (!rooms.Any())
            {
                return View(new AdminSeatMapViewModel());
            }

            var selectedRoomId = roomId ?? rooms.First().RoomId;
            var selectedRoomLabel = rooms.FirstOrDefault(r => r.RoomId == selectedRoomId) is SeatRoomOption opt
                ? $"{opt.CinemaName} - {opt.RoomName}"
                : string.Empty;

            var seatList = await _dataContext.Seats.AsNoTracking()
                .Where(seat => seat.RoomId == selectedRoomId)
                .OrderBy(seat => seat.SeatRow)
                .ThenBy(seat => seat.SeatNumber)
                .Select(seat => new SeatMapSeat
                {
                    SeatId = seat.SeatId,
                    Row = seat.SeatRow,
                    Number = seat.SeatNumber,
                    SeatType = seat.SeatType ?? "regular",
                    Status = seat.Status ?? "active"
                })
                .ToListAsync();

            var rows = seatList
                .GroupBy(seat => seat.Row)
                .OrderBy(group => group.Key)
                .Select(group => new SeatMapRow
                {
                    Row = group.Key,
                    Seats = group.OrderBy(s => s.Number).ToList()
                })
                .ToList();

            var selectedSeat = rows.FirstOrDefault()?.Seats.FirstOrDefault();

            return View(new AdminSeatMapViewModel
            {
                Rooms = rooms,
                SelectedRoomId = selectedRoomId,
                SelectedRoomLabel = selectedRoomLabel,
                Rows = rows,
                SelectedSeat = selectedSeat
            });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> UpdateSeat(SeatUpdateRequest model)
        {
            var seat = await _dataContext.Seats.FindAsync(model.SeatId);
            if (seat == null)
            {
                return NotFound(new { success = false, message = "Không tìm thấy ghế." });
            }

            seat.SeatType = model.SeatType;
            seat.Status = model.Status;
            await _dataContext.SaveChangesAsync();

            return Ok(new { success = true });
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
