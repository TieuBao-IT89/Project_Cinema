using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Cinema.Models;
using Project_Cinema.Repository;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Project_Cinema.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class CinemasController : Controller
    {
        private readonly DataContext _dataContext;

        public CinemasController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["AdminTitle"] = "Quản lý rạp";
            ViewData["AdminActive"] = "Cinemas";
            var cinemas = await _dataContext.Cinemas
                .AsNoTracking()
                .OrderByDescending(cinema => cinema.CreatedAt)
                .ToListAsync();
            return View(cinemas);
        }

        [HttpGet]
        public IActionResult Create()
        {
            ViewData["AdminTitle"] = "Thêm rạp";
            ViewData["AdminActive"] = "Cinemas";
            return View(new CinemaModel
            {
                Status = "active",
                CreatedAt = DateTime.Now
            });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(CinemaModel model)
        {
            ViewData["AdminTitle"] = "Thêm rạp";
            ViewData["AdminActive"] = "Cinemas";

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            model.CreatedAt = DateTime.Now;
            _dataContext.Cinemas.Add(model);
            await _dataContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        [HttpGet]
        public async Task<IActionResult> Edit(long id)
        {
            ViewData["AdminTitle"] = "Cập nhật rạp";
            ViewData["AdminActive"] = "Cinemas";

            var cinema = await _dataContext.Cinemas.FindAsync(id);
            if (cinema == null)
            {
                return NotFound();
            }

            return View(cinema);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, CinemaModel model)
        {
            ViewData["AdminTitle"] = "Cập nhật rạp";
            ViewData["AdminActive"] = "Cinemas";

            if (id != model.CinemaId)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var cinema = await _dataContext.Cinemas.FindAsync(id);
            if (cinema == null)
            {
                return NotFound();
            }

            cinema.CinemaName = model.CinemaName;
            cinema.Address = model.Address;
            cinema.City = model.City;
            cinema.Latitude = model.Latitude;
            cinema.Longitude = model.Longitude;
            cinema.Phone = model.Phone;
            cinema.Status = model.Status;

            await _dataContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(long id)
        {
            var cinema = await _dataContext.Cinemas.FindAsync(id);
            if (cinema == null)
            {
                return NotFound();
            }

            _dataContext.Cinemas.Remove(cinema);
            await _dataContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
    }
}
