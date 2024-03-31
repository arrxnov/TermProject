using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Olympus.Data;
using Olympus.Models;

namespace Olympus.Controllers
{
    public class PlannedcoursesController : Controller
    {
        private readonly OlympusContext _context;

        public PlannedcoursesController(OlympusContext context)
        {
            _context = context;
        }

        // GET: Plannedcourses
        public async Task<IActionResult> Index()
        {
            return View(await _context.Plannedcourse.ToListAsync());
        }

        // GET: Plannedcourses/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var plannedcourse = await _context.Plannedcourse
                .FirstOrDefaultAsync(m => m.PlanId == id);
            if (plannedcourse == null)
            {
                return NotFound();
            }

            return View(plannedcourse);
        }

        // GET: Plannedcourses/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Plannedcourses/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("PlanId,CourseId,Year,Term")] Plannedcourse plannedcourse)
        {
            if (ModelState.IsValid)
            {
                _context.Add(plannedcourse);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(plannedcourse);
        }

        // GET: Plannedcourses/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var plannedcourse = await _context.Plannedcourse.FindAsync(id);
            if (plannedcourse == null)
            {
                return NotFound();
            }
            return View(plannedcourse);
        }

        // POST: Plannedcourses/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("PlanId,CourseId,Year,Term")] Plannedcourse plannedcourse)
        {
            if (id != plannedcourse.PlanId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(plannedcourse);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PlannedcourseExists(plannedcourse.PlanId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(plannedcourse);
        }

        // GET: Plannedcourses/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var plannedcourse = await _context.Plannedcourse
                .FirstOrDefaultAsync(m => m.PlanId == id);
            if (plannedcourse == null)
            {
                return NotFound();
            }

            return View(plannedcourse);
        }

        // POST: Plannedcourses/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var plannedcourse = await _context.Plannedcourse.FindAsync(id);
            if (plannedcourse != null)
            {
                _context.Plannedcourse.Remove(plannedcourse);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool PlannedcourseExists(int id)
        {
            return _context.Plannedcourse.Any(e => e.PlanId == id);
        }
    }
}
