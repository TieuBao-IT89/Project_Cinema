using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Cinema.Repository;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Project_Cinema.Controllers
{
    [Authorize]
    public class BookingController : Controller
    {
        private readonly DataContext _dataContext;

        public BookingController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet]
        public async Task<IActionResult> Checkout(long bookingId)
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

            var items = await (from bi in _dataContext.BookingItems.AsNoTracking()
                               join seat in _dataContext.Seats.AsNoTracking() on bi.SeatId equals seat.SeatId
                               where bi.BookingId == bookingId
                               orderby seat.SeatRow, seat.SeatNumber
                               select new
                               {
                                   Code = seat.SeatRow + seat.SeatNumber,
                                   bi.Price
                               }).ToListAsync();

            var info = await (from s in _dataContext.Showtimes.AsNoTracking()
                              join m in _dataContext.Movies.AsNoTracking() on s.MovieId equals m.MovieId
                              join r in _dataContext.Rooms.AsNoTracking() on s.RoomId equals r.RoomId
                              join c in _dataContext.Cinemas.AsNoTracking() on r.CinemaId equals c.CinemaId
                              where s.ShowtimeId == booking.ShowtimeId
                              select new
                              {
                                  MovieTitle = m.Title,
                                  CinemaName = c.CinemaName,
                                  CinemaAddress = c.Address,
                                  RoomName = r.RoomName,
                                  s.StartsAt
                              }).FirstOrDefaultAsync();

            ViewData["BookingCode"] = booking.BookingCode;
            ViewData["BookingExpiresAt"] = booking.ExpiresAt;
            ViewData["BookingTotal"] = booking.TotalAmount;
            ViewData["Seats"] = string.Join(", ", items.Select(i => i.Code));
            ViewData["SeatCodes"] = items.Select(i => i.Code).ToList();
            ViewData["SeatCount"] = items.Count;
            ViewData["SeatsSubtotal"] = items.Sum(i => i.Price);
            ViewData["BookingId"] = booking.BookingId;
            ViewData["ShowtimeId"] = booking.ShowtimeId;
            ViewData["MovieTitle"] = info?.MovieTitle ?? "";
            ViewData["CinemaName"] = info?.CinemaName ?? "";
            ViewData["CinemaAddress"] = info?.CinemaAddress ?? "";
            ViewData["RoomName"] = info?.RoomName ?? "";
            ViewData["StartsAt"] = info?.StartsAt;

            var isExpired = booking.ExpiresAt != null && booking.ExpiresAt <= DateTime.Now;
            ViewData["IsExpired"] = isExpired;

            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CancelHold(long bookingId, long showtimeId)
        {
            await BookingMaintenance.ExpireHoldsAsync(_dataContext);

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdClaim, out var userId))
            {
                return Forbid();
            }

            var booking = await _dataContext.Bookings.FirstOrDefaultAsync(b => b.BookingId == bookingId);
            if (booking == null)
            {
                return NotFound();
            }

            if (booking.UserId != userId)
            {
                return Forbid();
            }

            // Only cancel active holds
            if (booking.Status == "held" || booking.Status == "pending")
            {
                booking.Status = "cancelled";
                booking.ExpiresAt = DateTime.Now;

                var items = await _dataContext.BookingItems
                    .Where(i => i.BookingId == bookingId)
                    .ToListAsync();

                foreach (var item in items)
                {
                    item.TicketStatus = "cancelled";
                }

                await _dataContext.SaveChangesAsync();
            }

            return RedirectToAction("Index", "Seat", new { showtimeId });
        }
    }
}

