using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Cinema.Repository;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Project_Cinema.Repository.Components
{
    public class ComingSoonMoviesViewComponent : ViewComponent
    {
        private readonly DataContext _dataContext;

        public ComingSoonMoviesViewComponent(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IViewComponentResult> InvokeAsync(int count = 6, string? status = null)
        {
            var query = _dataContext.Movies.AsNoTracking();

            if (!string.IsNullOrWhiteSpace(status))
            {
                query = query.Where(movie => movie.Status == status);
            }
            else
            {
                query = query.Where(movie => movie.ReleaseDate != null && movie.ReleaseDate > DateTime.Today);
            }

            var movies = await query
                .OrderBy(movie => movie.ReleaseDate ?? DateTime.MaxValue)
                .ThenByDescending(movie => movie.CreatedAt)
                .Take(count)
                .ToListAsync();

            return View(movies);
        }
    }
}

