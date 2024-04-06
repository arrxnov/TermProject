using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Olympus.Controllers
{
    public class StudentController : Controller
    {
        [Authorize(Roles = "Admin,Faculty,Student")]
        public IActionResult Index()
        {
            return View();
        }
    }
}
