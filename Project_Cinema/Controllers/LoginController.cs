using Microsoft.AspNetCore.Mvc;

namespace Project_Cinema.Controllers
{
    public class LoginController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
