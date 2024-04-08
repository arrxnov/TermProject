using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
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

            else if (HttpContext.User.IsInRole("Faculty"))
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

            else if (HttpContext.User.IsInRole("Faculty"))
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

            var JsonData = new zeusContext().plans
                .Where(p => p.user_id == studentId)
                .Select(p => new { p.id });

            return Ok(JsonData);
        }

        [HttpGet("{studentId}/{planId}")]
        public async Task<IActionResult> GetPlanMetadata(string studentId, int planId)
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);

            if ((HttpContext.User.IsInRole("Student")) && (user.Id != studentId))
            {
                return Forbid();
            }

            else if (HttpContext.User.IsInRole("Faculty"))
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

            var JsonData = new zeusContext().plans
                .Where(p => p.id == planId)
                .Select(p => new { p.name, p.catalog_year, majors = p.majors.Select(m => m.name), minors = p.minors.Select(m => m.name) });

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

            else if (HttpContext.User.IsInRole("Faculty"))
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

            var JsonData = new zeusContext().plannedcourses
                .Where(c => c.plan_id == planId)
                .Select(c => new { c.course_id, c.year, c.term});

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

           else if (HttpContext.User.IsInRole("Faculty"))
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

           var context = new zeusContext();

           var catYear = context.plans
               .Where(p => p.id == planId)
               .Select(p => p.catalog_year)
               .ToList()[0];

           var genedData = context.geneds
               .Where(g => g.catalog_year == catYear)
               .Select(g => new { g.course_id, g.type });

           var majorData = context.plans
               .Select(p => p.majors
                   .Select(m => m.majorcourses
                       .Select(mc => new { mc.course_id, mc.type })));
            
           var minorData = context.plans
               .Select(p => p.minors
                   .Select(m => m.minorcourses
                       .Select(mc => new { mc.course_id, mc.type })));

           var concentrationData = context.plans
               .Select(p => p.concentrations
                   .Select(m => m.concentrationcourses
                       .Select(mc => new { mc.course_id, mc.type })));

           var JsonData = genedData.Union(majorData);


           // TODO add database query here
           // union the following:
           // geneds {course_id, type} (select by plan.catalog_year)
           // plan.majors.majorcourses {course_id, type} (select by plan.catalog_year)
           // plan.minors.minorcourses {course_id, type} (select by plan.catalog_year)
           // plan.concentration.concentrationcourses {course_id, type} (select by plan.catalog_year)

           return Ok(JsonData);
        }
    }
}
