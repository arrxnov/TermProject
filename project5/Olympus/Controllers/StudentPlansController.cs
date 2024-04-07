using Microsoft.AspNetCore.Mvc;

namespace Olympus.Controllers
{
    public class StudentPlansController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
