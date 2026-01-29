using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Cinema.Repository;
using System;
using System.Linq;
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

            var booking = await _dataContext.Bookings.AsNoTracking()
                .FirstOrDefaultAsync(b => b.BookingId == bookingId);

            if (booking == null)
            {
                return NotFound();
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

            ViewData["BookingCode"] = booking.BookingCode;
            ViewData["BookingExpiresAt"] = booking.ExpiresAt;
            ViewData["BookingTotal"] = booking.TotalAmount;
            ViewData["Seats"] = string.Join(", ", items.Select(i => i.Code));
            ViewData["BookingId"] = booking.BookingId;
            ViewData["ShowtimeId"] = booking.ShowtimeId;

            var isExpired = booking.ExpiresAt != null && booking.ExpiresAt <= DateTime.Now;
            ViewData["IsExpired"] = isExpired;

            return View();
        }
    }
}

