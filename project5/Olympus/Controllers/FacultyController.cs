﻿using Microsoft.AspNetCore.Authorization;
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

        public async Task<IActionResult> Index()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            if (user == null)
            {
                return NotFound();
            }

            return View(await _context.aspnetusers.Where(stu => (stu.advisors.Select(t => t.Id).ToList().Contains(user.Id)) || false).ToListAsync());
        }
    }
}
