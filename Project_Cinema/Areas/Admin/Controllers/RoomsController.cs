using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Cinema.Repository;
using Project_Cinema.ViewModels;
using System.Linq;
using System.Threading.Tasks;

namespace Project_Cinema.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class RoomsController : Controller
    {
        private readonly DataContext _dataContext;

        public RoomsController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["AdminTitle"] = "Quản lý phòng";
            ViewData["AdminActive"] = "Rooms";

            var items = await (from room in _dataContext.Rooms.AsNoTracking()
                               join cinema in _dataContext.Cinemas.AsNoTracking() on room.CinemaId equals cinema.CinemaId
                               orderby cinema.CinemaName, room.RoomName
                               select new RoomIndexItem
                               {
                                   RoomId = room.RoomId,
                                   CinemaName = cinema.CinemaName,
                                   RoomName = room.RoomName,
                                   RoomType = room.RoomType ?? "2D",
                                   Status = room.Status ?? "active"
                               }).ToListAsync();

            return View(new RoomIndexViewModel { Items = items });
        }

        [HttpGet]
        public async Task<IActionResult> Create()
        {
            ViewData["AdminTitle"] = "Thêm phòng";
            ViewData["AdminActive"] = "Rooms";
            return View(new RoomFormViewModel
            {
                Room = new Models.RoomModel { Status = "active" },
                Cinemas = await _dataContext.Cinemas.AsNoTracking().OrderBy(c => c.CinemaName).ToListAsync()
            });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(RoomFormViewModel model)
        {
            ViewData["AdminTitle"] = "Thêm phòng";
            ViewData["AdminActive"] = "Rooms";

            if (!ModelState.IsValid)
            {
                model.Cinemas = await _dataContext.Cinemas.AsNoTracking().OrderBy(c => c.CinemaName).ToListAsync();
                return View(model);
            }

            _dataContext.Rooms.Add(model.Room);
            await _dataContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        [HttpGet]
        public async Task<IActionResult> Edit(long id)
        {
            ViewData["AdminTitle"] = "Cập nhật phòng";
            ViewData["AdminActive"] = "Rooms";

            var room = await _dataContext.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            return View(new RoomFormViewModel
            {
                Room = room,
                Cinemas = await _dataContext.Cinemas.AsNoTracking().OrderBy(c => c.CinemaName).ToListAsync()
            });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, RoomFormViewModel model)
        {
            ViewData["AdminTitle"] = "Cập nhật phòng";
            ViewData["AdminActive"] = "Rooms";

            if (id != model.Room.RoomId)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                model.Cinemas = await _dataContext.Cinemas.AsNoTracking().OrderBy(c => c.CinemaName).ToListAsync();
                return View(model);
            }

            var room = await _dataContext.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            room.CinemaId = model.Room.CinemaId;
            room.RoomName = model.Room.RoomName;
            room.RoomType = model.Room.RoomType;
            room.Status = model.Room.Status;

            await _dataContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(long id)
        {
            var room = await _dataContext.Rooms.FindAsync(id);
            if (room == null)
            {
                return NotFound();
            }

            _dataContext.Rooms.Remove(room);
            await _dataContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
    }
}
