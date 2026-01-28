using Microsoft.AspNetCore.Mvc;

namespace Project_Cinema.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            ViewData["AdminTitle"] = "Dashboard";
            ViewData["AdminActive"] = "Dashboard";
            return View();
        }
    }
}
