using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Cinema.Repository;
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

            return View(movie);
        }
    }
}
