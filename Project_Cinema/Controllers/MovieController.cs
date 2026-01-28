using Microsoft.AspNetCore.Mvc;

namespace Project_Cinema.Controllers
{
    public class MovieController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Details()
        {
            return View();
        }
    }
}
