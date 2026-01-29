using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Cinema.Models;
using Project_Cinema.Repository;
using Project_Cinema.ViewModels;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Project_Cinema.Controllers
{
    [Authorize]
    public class PaymentController : Controller
    {
        private readonly DataContext _dataContext;

        public PaymentController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet]
        public async Task<IActionResult> Index(long bookingId)
        {
            await BookingMaintenance.ExpireHoldsAsync(_dataContext);

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdClaim, out var userId))
            {
                return Forbid();
            }

            var booking = await _dataContext.Bookings.AsNoTracking()
                .FirstOrDefaultAsync(b => b.BookingId == bookingId);

            if (booking == null)
            {
                return NotFound();
            }

            if (booking.UserId != userId)
            {
                return Forbid();
            }

            if (booking.Status == "paid")
            {
                return RedirectToAction("Success", "Payment", new { bookingId });
            }

            var isExpired = booking.ExpiresAt != null && booking.ExpiresAt <= DateTime.Now || booking.Status == "expired";
            if (isExpired)
            {
                return RedirectToAction(nameof(Failed), new { bookingId, reason = "Booking đã hết hạn. Vui lòng chọn ghế lại." });
            }

            var info = await (from s in _dataContext.Showtimes.AsNoTracking()
                              join m in _dataContext.Movies.AsNoTracking() on s.MovieId equals m.MovieId
                              join r in _dataContext.Rooms.AsNoTracking() on s.RoomId equals r.RoomId
                              join c in _dataContext.Cinemas.AsNoTracking() on r.CinemaId equals c.CinemaId
                              where s.ShowtimeId == booking.ShowtimeId
                              select new
                              {
                                  MovieId = m.MovieId,
                                  MovieTitle = m.Title,
                                  CinemaName = c.CinemaName,
                                  RoomName = r.RoomName,
                                  s.StartsAt
                              }).FirstOrDefaultAsync();

            if (info == null)
            {
                return NotFound();
            }

            var seatCodes = await (from bi in _dataContext.BookingItems.AsNoTracking()
                                   join seat in _dataContext.Seats.AsNoTracking() on bi.SeatId equals seat.SeatId
                                   where bi.BookingId == bookingId
                                   orderby seat.SeatRow, seat.SeatNumber
                                   select seat.SeatRow + seat.SeatNumber)
                .ToListAsync();

            var user = await _dataContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == userId);

            return View(new PaymentViewModel
            {
                BookingId = booking.BookingId,
                BookingCode = booking.BookingCode ?? $"BK-{booking.BookingId}",
                MovieId = info.MovieId,
                MovieTitle = info.MovieTitle,
                CinemaName = info.CinemaName,
                RoomName = info.RoomName,
                StartsAt = info.StartsAt,
                SeatCodes = seatCodes,
                TotalAmount = booking.TotalAmount,
                ExpiresAt = booking.ExpiresAt,
                IsExpired = false,
                FullName = user?.FullName ?? User.Identity?.Name ?? "",
                Email = user?.Email ?? "",
                Phone = user?.Phone ?? ""
            });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Process(ProcessPaymentRequest model)
        {
            await BookingMaintenance.ExpireHoldsAsync(_dataContext);

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdClaim, out var userId))
            {
                return Forbid();
            }

            var booking = await _dataContext.Bookings.FirstOrDefaultAsync(b => b.BookingId == model.BookingId);
            if (booking == null)
            {
                return NotFound();
            }

            if (booking.UserId != userId)
            {
                return Forbid();
            }

            var isExpired = booking.ExpiresAt != null && booking.ExpiresAt <= DateTime.Now || booking.Status == "expired";
            if (isExpired)
            {
                return RedirectToAction(nameof(Failed), new { bookingId = booking.BookingId, reason = "Booking đã hết hạn. Vui lòng chọn ghế lại." });
            }

            if (booking.Status != "held" && booking.Status != "pending")
            {
                return RedirectToAction(nameof(Failed), new { bookingId = booking.BookingId, reason = "Booking không hợp lệ để thanh toán." });
            }

            // Mock payment: mark as paid
            var now = DateTime.Now;
            var payment = new PaymentModel
            {
                BookingId = booking.BookingId,
                Method = string.IsNullOrWhiteSpace(model.Method) ? "momo" : model.Method,
                Provider = "mock",
                ProviderTxn = $"MOCK-{now:yyyyMMddHHmmss}-{Random.Shared.Next(1000, 9999)}",
                Amount = booking.TotalAmount,
                Currency = "VND",
                Status = "paid",
                PaidAt = now,
                CreatedAt = now
            };

            _dataContext.Payments.Add(payment);
            booking.Status = "paid";
            booking.ExpiresAt = null;

            await _dataContext.SaveChangesAsync();

            return RedirectToAction(nameof(Success), new { bookingId = booking.BookingId });
        }

        [HttpGet]
        public async Task<IActionResult> Success(long bookingId)
        {
            var booking = await _dataContext.Bookings.AsNoTracking().FirstOrDefaultAsync(b => b.BookingId == bookingId);
            if (booking == null)
            {
                return NotFound();
            }
            return View(booking);
        }

        [HttpGet]
        public IActionResult Failed(long bookingId, string? reason = null)
        {
            ViewData["Reason"] = reason ?? "Thanh toán thất bại. Vui lòng thử lại.";
            ViewData["BookingId"] = bookingId;
            return View();
        }
    }
}

