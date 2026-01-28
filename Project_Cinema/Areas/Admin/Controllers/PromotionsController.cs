using Microsoft.AspNetCore.Mvc;

namespace Project_Cinema.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class PromotionsController : Controller
    {
        public IActionResult Index()
        {
            ViewData["AdminTitle"] = "Khuyến mãi";
            ViewData["AdminActive"] = "Promotions";
            return View();
        }
    }
}
