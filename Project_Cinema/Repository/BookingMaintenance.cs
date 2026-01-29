using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Project_Cinema.Repository
{
    public static class BookingMaintenance
    {
        public static async Task ExpireHoldsAsync(DataContext context)
        {
            var now = DateTime.Now;

            var expiredBookings = await context.Bookings
                .Where(b => (b.Status == "held" || b.Status == "pending") && b.ExpiresAt != null && b.ExpiresAt <= now)
                .ToListAsync();

            if (!expiredBookings.Any())
            {
                return;
            }

            foreach (var booking in expiredBookings)
            {
                booking.Status = "expired";
            }

            // Optional: mark booking items as expired (for reporting)
            var expiredIds = expiredBookings.Select(b => b.BookingId).ToList();
            var items = await context.BookingItems
                .Where(i => expiredIds.Contains(i.BookingId))
                .ToListAsync();
            foreach (var item in items)
            {
                item.TicketStatus = "expired";
            }

            await context.SaveChangesAsync();
        }
    }
}

