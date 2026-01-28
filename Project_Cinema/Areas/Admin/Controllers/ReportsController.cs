using Microsoft.AspNetCore.Mvc;

namespace Project_Cinema.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class ReportsController : Controller
    {
        public IActionResult Index()
        {
            ViewData["AdminTitle"] = "Báo cáo";
            ViewData["AdminActive"] = "Reports";
            return View();
        }
    }
}
