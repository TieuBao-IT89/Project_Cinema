using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Cinema.Models;
using Project_Cinema.Repository;
using Project_Cinema.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Project_Cinema.Controllers
{
    public class SeatController : Controller
    {
        private readonly DataContext _dataContext;

        public SeatController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        // Prevent 405 when login redirects back to /Seat/Hold (GET)
        [HttpGet]
        public IActionResult Hold()
        {
            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public async Task<IActionResult> Index(long showtimeId)
        {
            await BookingMaintenance.ExpireHoldsAsync(_dataContext);

            var showtimeInfo = await (from s in _dataContext.Showtimes.AsNoTracking()
                                      join m in _dataContext.Movies.AsNoTracking() on s.MovieId equals m.MovieId
                                      join r in _dataContext.Rooms.AsNoTracking() on s.RoomId equals r.RoomId
                                      join c in _dataContext.Cinemas.AsNoTracking() on r.CinemaId equals c.CinemaId
                                      where s.ShowtimeId == showtimeId
                                      select new
                                      {
                                          s.ShowtimeId,
                                          s.RoomId,
                                          MovieId = m.MovieId,
                                          MovieTitle = m.Title,
                                          CinemaName = c.CinemaName,
                                          RoomName = r.RoomName,
                                          s.StartsAt,
                                          s.BasePrice
                                      }).FirstOrDefaultAsync();

            if (showtimeInfo == null)
            {
                return NotFound();
            }

            var now = DateTime.Now;

            // Find unavailable seats: already held (not expired) or paid/confirmed
            var unavailableSeatIds = await (from bi in _dataContext.BookingItems.AsNoTracking()
                                            join b in _dataContext.Bookings.AsNoTracking() on bi.BookingId equals b.BookingId
                                            where bi.ShowtimeId == showtimeId
                                                  && (b.Status == "paid"
                                                      || b.Status == "confirmed"
                                                      || (b.Status == "held" && b.ExpiresAt != null && b.ExpiresAt > now)
                                                      || (b.Status == "pending" && b.ExpiresAt != null && b.ExpiresAt > now))
                                            select bi.SeatId)
                .Distinct()
                .ToListAsync();

            var seats = await _dataContext.Seats.AsNoTracking()
                .Where(seat => seat.RoomId == showtimeInfo.RoomId)
                .OrderBy(seat => seat.SeatRow)
                .ThenBy(seat => seat.SeatNumber)
                .Select(seat => new SeatSelectionSeat
                {
                    SeatId = seat.SeatId,
                    Row = seat.SeatRow,
                    Number = seat.SeatNumber,
                    SeatType = seat.SeatType ?? "regular",
                    Status = seat.Status ?? "active",
                    IsUnavailable = (seat.Status ?? "active") != "active"
                })
                .ToListAsync();

            // Apply unavailable from bookings
            var unavailableSet = unavailableSeatIds.ToHashSet();
            foreach (var seat in seats)
            {
                if (unavailableSet.Contains(seat.SeatId))
                {
                    seat.IsUnavailable = true;
                }

                seat.Price = CalculateSeatPrice(showtimeInfo.BasePrice, seat.SeatType);
            }

            var rows = seats
                .GroupBy(s => s.Row)
                .OrderBy(g => g.Key)
                .Select(g => new SeatSelectionRow { Row = g.Key, Seats = g.OrderBy(x => x.Number).ToList() })
                .ToList();

            return View(new SeatSelectionViewModel
            {
                ShowtimeId = showtimeInfo.ShowtimeId,
                MovieId = showtimeInfo.MovieId,
                MovieTitle = showtimeInfo.MovieTitle,
                CinemaName = showtimeInfo.CinemaName,
                RoomName = showtimeInfo.RoomName,
                StartsAt = showtimeInfo.StartsAt,
                BasePrice = showtimeInfo.BasePrice,
                Rows = rows
            });
        }

        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Hold(SeatSelectionViewModel model)
        {
            await BookingMaintenance.ExpireHoldsAsync(_dataContext);

            if (model.ShowtimeId <= 0)
            {
                return BadRequest();
            }

            if (model.SelectedSeatIds == null || model.SelectedSeatIds.Count == 0)
            {
                TempData["SeatError"] = "Vui lòng chọn ít nhất 1 ghế.";
                return RedirectToAction(nameof(Index), new { showtimeId = model.ShowtimeId });
            }

            var showtime = await _dataContext.Showtimes.AsNoTracking()
                .FirstOrDefaultAsync(s => s.ShowtimeId == model.ShowtimeId);
            if (showtime == null)
            {
                return NotFound();
            }

            var roomId = showtime.RoomId;

            // Ensure selected seats belong to the room
            var seats = await _dataContext.Seats.AsNoTracking()
                .Where(s => s.RoomId == roomId && model.SelectedSeatIds.Contains(s.SeatId))
                .Select(s => new { s.SeatId, SeatType = s.SeatType ?? "regular", Status = s.Status ?? "active" })
                .ToListAsync();

            if (seats.Count != model.SelectedSeatIds.Count)
            {
                TempData["SeatError"] = "Có ghế không hợp lệ (không thuộc phòng).";
                return RedirectToAction(nameof(Index), new { showtimeId = model.ShowtimeId });
            }

            if (seats.Any(s => s.Status != "active"))
            {
                TempData["SeatError"] = "Có ghế đang bị khóa. Vui lòng chọn ghế khác.";
                return RedirectToAction(nameof(Index), new { showtimeId = model.ShowtimeId });
            }

            var now = DateTime.Now;

            // Check taken seats again (race condition prevention)
            var takenSeatIds = await (from bi in _dataContext.BookingItems.AsNoTracking()
                                      join b in _dataContext.Bookings.AsNoTracking() on bi.BookingId equals b.BookingId
                                      where bi.ShowtimeId == model.ShowtimeId
                                            && model.SelectedSeatIds.Contains(bi.SeatId)
                                            && (b.Status == "paid"
                                                || b.Status == "confirmed"
                                                || (b.Status == "held" && b.ExpiresAt != null && b.ExpiresAt > now)
                                                || (b.Status == "pending" && b.ExpiresAt != null && b.ExpiresAt > now))
                                      select bi.SeatId)
                .Distinct()
                .ToListAsync();

            if (takenSeatIds.Any())
            {
                TempData["SeatError"] = "Một số ghế vừa được người khác chọn. Vui lòng chọn lại.";
                return RedirectToAction(nameof(Index), new { showtimeId = model.ShowtimeId });
            }

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            long? userId = null;
            if (long.TryParse(userIdClaim, out var parsed))
            {
                userId = parsed;
            }

            var subtotal = seats.Sum(s => CalculateSeatPrice(showtime.BasePrice, s.SeatType));
            var expiresAt = now.AddMinutes(10);

            var booking = new BookingModel
            {
                BookingCode = GenerateBookingCode(),
                UserId = userId,
                ShowtimeId = model.ShowtimeId,
                Status = "held",
                Subtotal = subtotal,
                DiscountAmount = 0,
                TotalAmount = subtotal,
                ExpiresAt = expiresAt,
                CreatedAt = now
            };

            _dataContext.Bookings.Add(booking);
            await _dataContext.SaveChangesAsync();

            var items = seats.Select(s => new BookingItemModel
            {
                BookingId = booking.BookingId,
                SeatId = s.SeatId,
                ShowtimeId = model.ShowtimeId,
                Price = CalculateSeatPrice(showtime.BasePrice, s.SeatType),
                TicketStatus = "reserved"
            }).ToList();

            _dataContext.BookingItems.AddRange(items);
            await _dataContext.SaveChangesAsync();

            return RedirectToAction("Checkout", "Booking", new { bookingId = booking.BookingId });
        }

        private static decimal CalculateSeatPrice(decimal basePrice, string seatType)
        {
            return seatType switch
            {
                "vip" => basePrice + 30000,
                "couple" => basePrice + 60000,
                _ => basePrice
            };
        }

        private static string GenerateBookingCode()
        {
            var rnd = Random.Shared.Next(1000, 9999);
            return $"BK-{DateTime.Now:yyyyMMddHHmm}-{rnd}";
        }
    }
}

