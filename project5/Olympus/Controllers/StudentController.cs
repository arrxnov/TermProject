﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Olympus.Controllers
{
    public class StudentController : Controller
    {
        [Authorize(Roles = "Admin,Faculty,Student")]
        public IActionResult Index(string id = "")
        {
            if ((id != "") && HttpContext.User.IsInRole("Student"))
            {
                return Forbid();
            }

            else if ((id != "") && HttpContext.User.IsInRole("Faculty"))
            {
                var isNotAdvisee = new zeusContext().aspnetusers
                    .Where(u => u.Id == user.Id)
                    .Select(u => u.advisees
                        .Where(a => a.Id == studentId))
                    .ToList()[0]
                    .IsNullOrEmpty();

                if (isNotAdvisee)
                {
                    return Forbid();
                }
            }
            
            var user = await _userManager.GetUserAsync(HttpContext.User);
            var uid = user.Id;
            
            if (id != "") {
                uid = id;
            }

            ViewData["studentId"] = uid;
            
            return View();
        }
    }
}
