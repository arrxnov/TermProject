using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Olympus.Controllers
{
    [Authorize]
    public class StudentController : Controller
    {
        public IActionResult Index(string id)
        {
            return View();
        }
    }
}
