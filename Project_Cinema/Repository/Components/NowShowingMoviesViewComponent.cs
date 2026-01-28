using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Cinema.Repository;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Project_Cinema.Repository.Components
{
    public class NowShowingMoviesViewComponent : ViewComponent
    {
        private readonly DataContext _dataContext;

        public NowShowingMoviesViewComponent(DataContext dataContext)
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

            var movies = await query
                .OrderByDescending(movie => movie.ReleaseDate ?? DateTime.MinValue)
                .ThenByDescending(movie => movie.CreatedAt)
                .Take(count)
                .ToListAsync();

            return View(movies);
        }
    }
}

