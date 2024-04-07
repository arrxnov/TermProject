using Microsoft.AspNetCore.Mvc;

namespace Olympus.Controllers
{
    public class StudentPlannedCoursesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
