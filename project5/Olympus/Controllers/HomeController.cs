using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Olympus.Areas.Identity.Data;
using Olympus.Models;
using System.Diagnostics;

namespace Olympus.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly zeusContext _context;
        private readonly UserManager<OlympusUser> _userManager;

        public HomeController(ILogger<HomeController> logger, zeusContext context, UserManager<OlympusUser> userManager)
        {
            _logger = logger;
            _context = context;
            _userManager = userManager;
        }

        [Authorize]
        async public Task<IActionResult> Index()
        {
            if (HttpContext.User.IsInRole("Admin"))
            {
                return RedirectToAction("Index", "Admin");
            } 
            else if (HttpContext.User.IsInRole("Faculty"))
            {
                return RedirectToAction("Index", "Faculty");
            } 
            else
            {
                var user = await _userManager.GetUserAsync(HttpContext.User);
                return RedirectToAction("Index", "Student", new { id = user.Id });
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

    }
}
