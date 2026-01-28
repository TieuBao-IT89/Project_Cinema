using Microsoft.AspNetCore.Mvc;

namespace Project_Cinema.Controllers
{
    public class CinemaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
