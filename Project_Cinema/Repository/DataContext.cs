using Microsoft.EntityFrameworkCore;
using Project_Cinema.Models;

namespace Project_Cinema.Repository
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }

        public DbSet<MovieModel> Movies { get; set; }
        public DbSet<CinemaModel> Cinemas { get; set; }
        public DbSet<ShowtimeModel> Showtimes { get; set; }
    }
}
