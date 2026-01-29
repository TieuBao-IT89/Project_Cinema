using Project_Cinema.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Project_Cinema.Repository
{
    public static class DbInitializer
    {
        public static void Seed(DataContext context)
        {
            if (context.Movies.Any() || context.Cinemas.Any())
            {
                return;
            }

            var now = DateTime.Now;

            var cinemas = new List<CinemaModel>
            {
                new CinemaModel
                {
                    CinemaName = "CGV Vincom Đồng Khởi",
                    Address = "72 Lê Thánh Tôn, Bến Nghé, Quận 1",
                    City = "TP. Hồ Chí Minh",
                    Latitude = 10.776889m,
                    Longitude = 106.703179m,
                    Phone = "028 3821 8888",
                    Status = "active",
                    CreatedAt = now
                },
                new CinemaModel
                {
                    CinemaName = "Lotte Cinema Gò Vấp",
                    Address = "242 Nguyễn Văn Lượng, Gò Vấp",
                    City = "TP. Hồ Chí Minh",
                    Latitude = 10.839920m,
                    Longitude = 106.668130m,
                    Phone = "028 7300 4444",
                    Status = "active",
                    CreatedAt = now
                }
            };

            context.Cinemas.AddRange(cinemas);
            context.SaveChanges();

            var rooms = new List<RoomModel>
            {
                new RoomModel { CinemaId = cinemas[0].CinemaId, RoomName = "Phòng 1", RoomType = "2D", Status = "active" },
                new RoomModel { CinemaId = cinemas[0].CinemaId, RoomName = "Phòng 2", RoomType = "3D", Status = "active" },
                new RoomModel { CinemaId = cinemas[1].CinemaId, RoomName = "Phòng A", RoomType = "2D", Status = "active" },
                new RoomModel { CinemaId = cinemas[1].CinemaId, RoomName = "Phòng B", RoomType = "IMAX", Status = "active" }
            };

            context.Rooms.AddRange(rooms);
            context.SaveChanges();

            var seats = new List<SeatModel>();
            foreach (var room in rooms)
            {
                for (var rowIndex = 0; rowIndex < 4; rowIndex++)
                {
                    var rowChar = (char)('A' + rowIndex);
                    for (var seatNumber = 1; seatNumber <= 8; seatNumber++)
                    {
                        seats.Add(new SeatModel
                        {
                            RoomId = room.RoomId,
                            SeatRow = rowChar.ToString(),
                            SeatNumber = seatNumber,
                            SeatType = rowIndex == 0 ? "vip" : "regular",
                            Status = "active"
                        });
                    }
                }
            }

            context.Seats.AddRange(seats);
            context.SaveChanges();

            var movies = new List<MovieModel>
            {
                new MovieModel
                {
                    Title = "Lật Mặt 7",
                    Slug = "lat-mat-7",
                    Description = "Một bộ phim hành động - tình cảm hấp dẫn.",
                    DurationMin = 128,
                    ReleaseDate = DateTime.Today.AddDays(-10),
                    Language = "Việt",
                    AgeRating = "C16",
                    PosterUrl = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500",
                    TrailerUrl = "https://www.youtube.com/watch?v=TcMBFSGVi1c",
                    Status = "now_showing",
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new MovieModel
                {
                    Title = "Mai",
                    Slug = "mai-2024",
                    Description = "Phim tâm lý - gia đình với nhiều cảm xúc.",
                    DurationMin = 131,
                    ReleaseDate = DateTime.Today.AddDays(-20),
                    Language = "Việt",
                    AgeRating = "C13",
                    PosterUrl = "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500",
                    TrailerUrl = "https://www.youtube.com/watch?v=JfVOs4VSpmA",
                    Status = "now_showing",
                    CreatedAt = now,
                    UpdatedAt = now
                },
                new MovieModel
                {
                    Title = "Âm Dương Lộ",
                    Slug = "am-duong-lo",
                    Description = "Phim kinh dị Việt Nam, dự kiến ra mắt.",
                    DurationMin = 105,
                    ReleaseDate = DateTime.Today.AddDays(15),
                    Language = "Việt",
                    AgeRating = "C18",
                    PosterUrl = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500",
                    TrailerUrl = "https://www.youtube.com/watch?v=giXco2jaZ_4",
                    Status = "coming_soon",
                    CreatedAt = now,
                    UpdatedAt = now
                }
            };

            context.Movies.AddRange(movies);
            context.SaveChanges();

            var showtimes = new List<ShowtimeModel>
            {
                new ShowtimeModel
                {
                    MovieId = movies[0].MovieId,
                    RoomId = rooms[0].RoomId,
                    StartsAt = DateTime.Today.AddDays(1).AddHours(9),
                    EndsAt = DateTime.Today.AddDays(1).AddHours(11),
                    BasePrice = 120000,
                    Status = "scheduled",
                    CreatedAt = now
                },
                new ShowtimeModel
                {
                    MovieId = movies[1].MovieId,
                    RoomId = rooms[1].RoomId,
                    StartsAt = DateTime.Today.AddDays(1).AddHours(14),
                    EndsAt = DateTime.Today.AddDays(1).AddHours(16),
                    BasePrice = 150000,
                    Status = "scheduled",
                    CreatedAt = now
                },
                new ShowtimeModel
                {
                    MovieId = movies[2].MovieId,
                    RoomId = rooms[3].RoomId,
                    StartsAt = DateTime.Today.AddDays(5).AddHours(19),
                    EndsAt = DateTime.Today.AddDays(5).AddHours(21),
                    BasePrice = 180000,
                    Status = "scheduled",
                    CreatedAt = now
                }
            };

            context.Showtimes.AddRange(showtimes);
            context.SaveChanges();
        }
    }
}
