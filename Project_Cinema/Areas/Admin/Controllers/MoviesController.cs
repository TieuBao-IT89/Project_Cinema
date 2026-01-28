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
    public class MoviesController : Controller
    {
        private readonly DataContext _dataContext;

        public MoviesController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["AdminTitle"] = "Quản lý phim";
            ViewData["AdminActive"] = "Movies";
            var movies = await _dataContext.Movies
                .AsNoTracking()
                .OrderByDescending(movie => movie.CreatedAt)
                .ToListAsync();
            return View(movies);
        }

        [HttpGet]
        public IActionResult Create()
        {
            ViewData["AdminTitle"] = "Thêm phim";
            ViewData["AdminActive"] = "Movies";
            return View(new MovieModel
            {
                ReleaseDate = DateTime.Today,
                Status = "now_showing",
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(MovieModel model)
        {
            ViewData["AdminTitle"] = "Thêm phim";
            ViewData["AdminActive"] = "Movies";

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            model.CreatedAt = DateTime.Now;
            model.UpdatedAt = DateTime.Now;

            _dataContext.Movies.Add(model);
            await _dataContext.SaveChangesAsync();

            return RedirectToAction(nameof(Index));
        }

        [HttpGet]
        public async Task<IActionResult> Edit(long id)
        {
            ViewData["AdminTitle"] = "Cập nhật phim";
            ViewData["AdminActive"] = "Movies";

            var movie = await _dataContext.Movies.FindAsync(id);
            if (movie == null)
            {
                return NotFound();
            }

            return View(movie);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(long id, MovieModel model)
        {
            ViewData["AdminTitle"] = "Cập nhật phim";
            ViewData["AdminActive"] = "Movies";

            if (id != model.MovieId)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var movie = await _dataContext.Movies.FindAsync(id);
            if (movie == null)
            {
                return NotFound();
            }

            movie.Title = model.Title;
            movie.Slug = model.Slug;
            movie.Description = model.Description;
            movie.DurationMin = model.DurationMin;
            movie.ReleaseDate = model.ReleaseDate;
            movie.Language = model.Language;
            movie.AgeRating = model.AgeRating;
            movie.PosterUrl = model.PosterUrl;
            movie.TrailerUrl = model.TrailerUrl;
            movie.Status = model.Status;
            movie.UpdatedAt = DateTime.Now;

            await _dataContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(long id)
        {
            var movie = await _dataContext.Movies.FindAsync(id);
            if (movie == null)
            {
                return NotFound();
            }

            _dataContext.Movies.Remove(movie);
            await _dataContext.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
    }
}
