using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Cinema.Repository;
using Project_Cinema.ViewModels;
using System.Linq;
using System.Threading.Tasks;

namespace Project_Cinema.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class PaymentsController : Controller
    {
        private readonly DataContext _dataContext;

        public PaymentsController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<IActionResult> Index()
        {
            ViewData["AdminTitle"] = "Thanh toán";
            ViewData["AdminActive"] = "Payments";

            var items = await (from payment in _dataContext.Payments.AsNoTracking()
                               join booking in _dataContext.Bookings.AsNoTracking() on payment.BookingId equals booking.BookingId
                               join user in _dataContext.Users.AsNoTracking() on booking.UserId equals user.UserId into userJoin
                               from user in userJoin.DefaultIfEmpty()
                               orderby payment.CreatedAt descending
                               select new PaymentIndexItem
                               {
                                   PaymentId = payment.PaymentId,
                                   BookingCode = booking.BookingCode ?? $"BK-{booking.BookingId}",
                                   UserName = user != null ? user.FullName : "Khách",
                                   Amount = payment.Amount,
                                   Method = payment.Method,
                                   Status = payment.Status ?? "initiated",
                                   PaidAt = payment.PaidAt
                               }).ToListAsync();

            return View(new PaymentIndexViewModel { Items = items });
        }
    }
}
