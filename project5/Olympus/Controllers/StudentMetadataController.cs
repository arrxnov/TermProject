using Microsoft.AspNetCore.Mvc;

namespace Olympus.Controllers
{
    public class StudentMetadataController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
