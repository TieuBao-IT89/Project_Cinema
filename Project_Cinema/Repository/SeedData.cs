using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Project_Cinema.Models;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Project_Cinema.Repository
{
    public static class SeedData
    {
        public static async Task EnsureSeededAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<DataContext>();

            // Try apply migrations (safe for dev). If migrations aren't set up, this won't block seeding.
            try
            {
                await context.Database.MigrateAsync();
            }
            catch
            {
                // ignore
            }

            // Seed only when database is empty enough to avoid duplicates
            var hasAnyCinema = await context.Cinemas.AsNoTracking().AnyAsync();
            var hasAnyMovie = await context.Movies.AsNoTracking().AnyAsync();
            var hasAnyRoom = await context.Rooms.AsNoTracking().AnyAsync();
            var hasAnySeat = await context.Seats.AsNoTracking().AnyAsync();
            var hasAnyShowtime = await context.Showtimes.AsNoTracking().AnyAsync();

            if (hasAnyCinema && hasAnyMovie && hasAnyRoom && hasAnySeat && hasAnyShowtime)
            {
                return;
            }

            // --- CINEMAS ---
            if (!hasAnyCinema)
            {
                var cinemas = new List<CinemaModel>
                {
                    new()
                    {
                        CinemaName = "CGV Vincom Đồng Khởi",
                        Address = "72 Lê Thánh Tôn, Bến Nghé, Quận 1",
                        City = "TP. Hồ Chí Minh",
                        Latitude = 10.7758m,
                        Longitude = 106.7024m,
                        Phone = "028 1234 5678",
                        Status = "active",
                        CreatedAt = DateTime.Now
                    },
                    new()
                    {
                        CinemaName = "Lotte Cinema Gò Vấp",
                        Address = "242 Nguyễn Văn Lượng, Phường 10, Gò Vấp",
                        City = "TP. Hồ Chí Minh",
                        Latitude = 10.8366m,
                        Longitude = 106.6694m,
                        Phone = "028 2345 6789",
                        Status = "active",
                        CreatedAt = DateTime.Now
                    },
                    new()
                    {
                        CinemaName = "Galaxy Nguyễn Du",
                        Address = "116 Nguyễn Du, Bến Thành, Quận 1",
                        City = "TP. Hồ Chí Minh",
                        Latitude = 10.7767m,
                        Longitude = 106.6917m,
                        Phone = "028 3456 7890",
                        Status = "active",
                        CreatedAt = DateTime.Now
                    }
                };

                context.Cinemas.AddRange(cinemas);
                await context.SaveChangesAsync();
            }

            // --- ROOMS ---
            if (!hasAnyRoom)
            {
                var cinemaIds = await context.Cinemas.AsNoTracking()
                    .OrderBy(c => c.CinemaId)
                    .Select(c => c.CinemaId)
                    .ToListAsync();

                var rooms = new List<RoomModel>();
                foreach (var cinemaId in cinemaIds)
                {
                    rooms.Add(new RoomModel { CinemaId = cinemaId, RoomName = "Phòng 1", RoomType = "2D", Status = "active" });
                    rooms.Add(new RoomModel { CinemaId = cinemaId, RoomName = "Phòng 2", RoomType = "3D", Status = "active" });
                }

                context.Rooms.AddRange(rooms);
                await context.SaveChangesAsync();
            }

            // --- MOVIES ---
            if (!hasAnyMovie)
            {
                var now = DateTime.Now;
                var movies = new List<MovieModel>
                {
                    new()
                    {
                        Title = "Âm Dương Lộ",
                        Slug = Slugify("Âm Dương Lộ"),
                        Description = "Một chuyến đi định mệnh đưa họ đến ranh giới giữa âm và dương.",
                        DurationMin = 105,
                        ReleaseDate = DateTime.Today.AddDays(45),
                        Language = "Việt",
                        AgeRating = "C16",
                        PosterUrl = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600",
                        TrailerUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        Status = "coming_soon",
                        CreatedAt = now,
                        UpdatedAt = now
                    },
                    new()
                    {
                        Title = "Làm Giàu Với Ma 2",
                        Slug = Slugify("Làm Giàu Với Ma 2"),
                        Description = "Khi tham vọng gặp thế giới tâm linh, mọi thứ đảo lộn ngoài dự đoán.",
                        DurationMin = 110,
                        ReleaseDate = DateTime.Today.AddDays(70),
                        Language = "Việt",
                        AgeRating = "C13",
                        PosterUrl = "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=600",
                        TrailerUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        Status = "coming_soon",
                        CreatedAt = now,
                        UpdatedAt = now
                    },
                    new()
                    {
                        Title = "Người Mặt Trời",
                        Slug = Slugify("Người Mặt Trời"),
                        Description = "Một bí mật cổ xưa thức tỉnh, kéo theo cuộc chiến sinh tồn.",
                        DurationMin = 115,
                        ReleaseDate = DateTime.Today.AddDays(-10),
                        Language = "Việt",
                        AgeRating = "C18",
                        PosterUrl = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600",
                        TrailerUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        Status = "now_showing",
                        CreatedAt = now,
                        UpdatedAt = now
                    },
                    new()
                    {
                        Title = "Mai",
                        Slug = Slugify("Mai"),
                        Description = "Một câu chuyện tình yêu và trưởng thành giữa nhịp sống hiện đại.",
                        DurationMin = 131,
                        ReleaseDate = DateTime.Today.AddDays(-120),
                        Language = "Việt",
                        AgeRating = "C13",
                        PosterUrl = "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600",
                        TrailerUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        Status = "now_showing",
                        CreatedAt = now,
                        UpdatedAt = now
                    }
                };

                context.Movies.AddRange(movies);
                await context.SaveChangesAsync();
            }

            // --- SHOWTIMES ---
            if (!hasAnyShowtime)
            {
                var movieIds = await context.Movies.AsNoTracking()
                    .Where(m => m.Status == "now_showing")
                    .OrderBy(m => m.MovieId)
                    .Select(m => m.MovieId)
                    .ToListAsync();

                var roomIds = await context.Rooms.AsNoTracking()
                    .OrderBy(r => r.RoomId)
                    .Select(r => r.RoomId)
                    .ToListAsync();

                if (movieIds.Count > 0 && roomIds.Count > 0)
                {
                    var showtimes = new List<ShowtimeModel>();
                    var startBase = DateTime.Today.AddHours(9);
                    var createdAt = DateTime.Now;

                    // Create a few showtimes across rooms for the next 5 days
                    for (var day = 0; day < 5; day++)
                    {
                        var dayStart = startBase.AddDays(day);
                        foreach (var roomId in roomIds.Take(6))
                        {
                            // 3 slots per day per room
                            var slots = new[] { 9, 13, 18 };
                            foreach (var hour in slots)
                            {
                                var startsAt = DateTime.Today.AddDays(day).AddHours(hour);
                                var movieId = movieIds[(day + hour) % movieIds.Count];
                                showtimes.Add(new ShowtimeModel
                                {
                                    MovieId = movieId,
                                    RoomId = roomId,
                                    StartsAt = startsAt,
                                    EndsAt = startsAt.AddMinutes(130),
                                    BasePrice = 120000,
                                    Status = "scheduled",
                                    CreatedAt = createdAt
                                });
                            }
                        }
                    }

                    context.Showtimes.AddRange(showtimes);
                    await context.SaveChangesAsync();
                }
            }

            // --- SEATS ---
            if (!hasAnySeat)
            {
                var roomIds = await context.Rooms.AsNoTracking()
                    .OrderBy(r => r.RoomId)
                    .Select(r => r.RoomId)
                    .ToListAsync();

                var seats = new List<SeatModel>();
                foreach (var roomId in roomIds)
                {
                    // 6 rows (A-F) x 8 seats = 48 seats per room
                    for (var rowIndex = 0; rowIndex < 6; rowIndex++)
                    {
                        var rowChar = (char)('A' + rowIndex);
                        for (var seatNumber = 1; seatNumber <= 8; seatNumber++)
                        {
                            var isVip = rowIndex >= 4; // E-F as VIP
                            seats.Add(new SeatModel
                            {
                                RoomId = roomId,
                                SeatRow = rowChar.ToString(),
                                SeatNumber = seatNumber,
                                SeatType = isVip ? "vip" : "regular",
                                Status = "active"
                            });
                        }
                    }
                }

                context.Seats.AddRange(seats);
                await context.SaveChangesAsync();
            }
        }

        private static string Slugify(string text)
        {
            if (string.IsNullOrWhiteSpace(text)) return string.Empty;

            var normalized = text.Trim().ToLowerInvariant().Normalize(NormalizationForm.FormD);
            var chars = normalized
                .Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                .Select(c => char.IsLetterOrDigit(c) ? c : '-')
                .ToArray();

            var slug = new string(chars)
                .Replace("--", "-", StringComparison.Ordinal)
                .Replace("--", "-", StringComparison.Ordinal)
                .Trim('-');

            return slug;
        }
    }
}

