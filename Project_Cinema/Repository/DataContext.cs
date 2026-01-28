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
        public DbSet<RoomModel> Rooms { get; set; }
        public DbSet<SeatModel> Seats { get; set; }
        public DbSet<BookingModel> Bookings { get; set; }
        public DbSet<BookingItemModel> BookingItems { get; set; }
        public DbSet<PaymentModel> Payments { get; set; }
        public DbSet<PromotionModel> Promotions { get; set; }
        public DbSet<BookingPromotionModel> BookingPromotions { get; set; }
        public DbSet<UserModel> Users { get; set; }
        public DbSet<GenreModel> Genres { get; set; }
        public DbSet<MovieGenreModel> MovieGenres { get; set; }
        public DbSet<BlogPostModel> BlogPosts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<MovieGenreModel>()
                .HasKey(entity => new { entity.MovieId, entity.GenreId });

            modelBuilder.Entity<BookingPromotionModel>()
                .HasKey(entity => new { entity.BookingId, entity.PromotionId });
        }
    }
}
