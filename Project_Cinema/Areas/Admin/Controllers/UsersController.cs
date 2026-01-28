using Microsoft.AspNetCore.Mvc;

namespace Project_Cinema.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class UsersController : Controller
    {
        public IActionResult Index()
        {
            ViewData["AdminTitle"] = "Người dùng";
            ViewData["AdminActive"] = "Users";
            return View();
        }
    }
}
