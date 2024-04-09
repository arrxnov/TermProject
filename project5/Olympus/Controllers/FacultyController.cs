using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Olympus.Areas.Identity.Data;
using Olympus.Models;

namespace Olympus.Controllers
{
    [Authorize(Roles = "Admin,Faculty")]
    public class FacultyController : Controller
    {
        private readonly zeusContext _context;
        private readonly UserManager<OlympusUser> _userManager;

        public FacultyController(zeusContext context, UserManager<OlympusUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<IActionResult> Index(string id = "")
        {
            if ((HttpContext.User.IsInRole("Faculty")) && (id != ""))
            {
                return Forbid();
            }
            
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var uid = user.Id;
            
            if (id != "") {
                uid = id;
            }

            return View(await _context.aspnetusers.Where(stu => (stu.advisors.Select(t => t.Id).ToList().Contains(uid)) || false).ToListAsync());
        }
    }
}
