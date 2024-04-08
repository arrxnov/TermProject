using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Olympus.Areas.Identity.Data;
using Olympus.Models;

namespace Olympus.Controllers
{
    [Authorize]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class StudentDataController : ControllerBase
    {
        private readonly zeusContext _context;
        private readonly UserManager<OlympusUser> _userManager;

        public StudentDataController(zeusContext context, UserManager<OlympusUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCourses()
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            var JsonData = new zeusContext().courses
                .Select(c => new { c.id, c.name, c.credits, c.description });

            return Ok(JsonData);
        }

        [HttpGet("{studentId}")]
        public async Task<IActionResult> GetUserMetadata(string studentId)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            if ((HttpContext.User.IsInRole("Student")) && (user.Id != studentId))
            {
                return Forbid();
            }

            var JsonData = new zeusContext().users
                .Where(u =>  u.id == studentId)
                .Select(u => new { u.name, u.gpa, u.major_gpa, u.default_plan_id });

            return Ok(JsonData);
        }

        [HttpGet("{studentId}")]
        public async Task<IActionResult> GetPlans(string studentId)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            if ((HttpContext.User.IsInRole("Student")) && (user.Id != studentId))
            {
                return Forbid();
            }

            var JsonData = new zeusContext().plans
                .Where(p => p.user_id == studentId)
                .Select(p => new { p.id });

            return Ok(JsonData);
        }

        [HttpGet("{studentId}/{planId}")]
        public async Task<IActionResult> GetPlannedCourses(string studentId, int planId)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            if ((HttpContext.User.IsInRole("Student")) && (user.Id != studentId))
            {
                return Forbid();
            }

            // TODO add database query here

            var JsonData = new { };

            return Ok(JsonData);
        }

        [HttpGet("{studentId}/{planId}")]
        public async Task<IActionResult> GetRequirements(string studentId, int planId)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            if ((HttpContext.User.IsInRole("Student")) && (user.Id != studentId))
            {
                return Forbid();
            }

            // TODO add database query here

            var JsonData = new { };

            return Ok(JsonData);
        }
    }
}
