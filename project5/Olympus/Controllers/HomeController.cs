using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Olympus.Models;
using System.Diagnostics;

namespace Olympus.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        [Authorize(Roles = "Admin,Faculty,Student")]
        public IActionResult Index()
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
                return RedirectToAction("Index", "Student");
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

    }
}
