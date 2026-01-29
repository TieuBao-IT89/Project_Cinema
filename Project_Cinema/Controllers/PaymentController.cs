using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Project_Cinema.Models;
using Project_Cinema.Repository;
using Project_Cinema.Services.Email;
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
        private readonly IEmailQueue _emailQueue;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(DataContext dataContext, IEmailQueue emailQueue, ILogger<PaymentController> logger)
        {
            _dataContext = dataContext;
            _emailQueue = emailQueue;
            _logger = logger;
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

            // Send ticket email (queued) after payment success
            try
            {
                var user = await _dataContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == userId);
                if (user == null)
                {
                    _logger.LogWarning("Payment email: user not found. bookingId={BookingId}, userId={UserId}", booking.BookingId, userId);
                }
                else if (string.IsNullOrWhiteSpace(user.Email))
                {
                    _logger.LogWarning("Payment email: user email missing. bookingId={BookingId}, userId={UserId}", booking.BookingId, userId);
                }
                else
                {
                    var info = await (from s in _dataContext.Showtimes.AsNoTracking()
                                      join m in _dataContext.Movies.AsNoTracking() on s.MovieId equals m.MovieId
                                      join r in _dataContext.Rooms.AsNoTracking() on s.RoomId equals r.RoomId
                                      join c in _dataContext.Cinemas.AsNoTracking() on r.CinemaId equals c.CinemaId
                                      where s.ShowtimeId == booking.ShowtimeId
                                      select new
                                      {
                                          MovieTitle = m.Title,
                                          CinemaName = c.CinemaName,
                                          RoomName = r.RoomName,
                                          s.StartsAt
                                      }).FirstOrDefaultAsync();

                    var seatCodes = await (from bi in _dataContext.BookingItems.AsNoTracking()
                                           join seat in _dataContext.Seats.AsNoTracking() on bi.SeatId equals seat.SeatId
                                           where bi.BookingId == booking.BookingId
                                           orderby seat.SeatRow, seat.SeatNumber
                                           select seat.SeatRow + seat.SeatNumber)
                        .ToListAsync();

                    if (info != null)
                    {
                        var ticketUrl = Url.Action("Ticket", "Account", new { bookingId = booking.BookingId }, protocol: Request.Scheme) ?? "";
                        var msg = TicketEmailTemplate.BuildTicketEmail(
                            toEmail: user.Email,
                            customerName: user.FullName,
                            bookingCode: booking.BookingCode ?? $"BK-{booking.BookingId}",
                            movieTitle: info.MovieTitle,
                            cinemaName: info.CinemaName,
                            roomName: info.RoomName,
                            startsAt: info.StartsAt,
                            seatCodes: seatCodes,
                            totalAmount: booking.TotalAmount,
                            ticketUrl: ticketUrl);

                        await _emailQueue.QueueAsync(msg);
                    }
                }
            }
            catch (Exception ex)
            {
                // Do not block payment success flow if email fails
                _logger.LogWarning(ex, "Payment email: failed to queue ticket email. bookingId={BookingId}, userId={UserId}", booking.BookingId, userId);
            }

            return RedirectToAction(nameof(Success), new { bookingId = booking.BookingId });
        }

        [HttpGet]
        public async Task<IActionResult> Success(long bookingId)
        {
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
                                  CinemaAddress = c.Address,
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

            var payment = await _dataContext.Payments.AsNoTracking()
                .Where(p => p.BookingId == bookingId)
                .OrderByDescending(p => p.PaidAt ?? p.CreatedAt)
                .FirstOrDefaultAsync();

            return View(new BookingSuccessViewModel
            {
                BookingId = booking.BookingId,
                BookingCode = booking.BookingCode ?? $"BK-{booking.BookingId}",
                CustomerEmail = user?.Email ?? "",
                CustomerName = user?.FullName ?? User.Identity?.Name ?? "",
                MovieId = info.MovieId,
                MovieTitle = info.MovieTitle,
                CinemaName = info.CinemaName,
                CinemaAddress = info.CinemaAddress,
                RoomName = info.RoomName,
                StartsAt = info.StartsAt,
                SeatCodes = seatCodes,
                TotalAmount = booking.TotalAmount,
                PaymentMethod = payment?.Method ?? "mock",
                ProviderTxn = payment?.ProviderTxn ?? ""
            });
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

