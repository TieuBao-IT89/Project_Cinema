using Microsoft.AspNetCore.Mvc;

namespace Project_Cinema.Controllers
{
    public class ShowtimeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
