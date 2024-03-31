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
    public class ConcentrationcoursesController : Controller
    {
        private readonly OlympusContext _context;

        public ConcentrationcoursesController(OlympusContext context)
        {
            _context = context;
        }

        // GET: Concentrationcourses
        public async Task<IActionResult> Index()
        {
            return View(await _context.Concentrationcourse.ToListAsync());
        }

        // GET: Concentrationcourses/Details/5
        public async Task<IActionResult> Details(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var concentrationcourse = await _context.Concentrationcourse
                .FirstOrDefaultAsync(m => m.CourseId == id);
            if (concentrationcourse == null)
            {
                return NotFound();
            }

            return View(concentrationcourse);
        }

        // GET: Concentrationcourses/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Concentrationcourses/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ConcentrationId,CourseId,Type")] Concentrationcourse concentrationcourse)
        {
            if (ModelState.IsValid)
            {
                _context.Add(concentrationcourse);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(concentrationcourse);
        }

        // GET: Concentrationcourses/Edit/5
        public async Task<IActionResult> Edit(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var concentrationcourse = await _context.Concentrationcourse.FindAsync(id);
            if (concentrationcourse == null)
            {
                return NotFound();
            }
            return View(concentrationcourse);
        }

        // POST: Concentrationcourses/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, [Bind("ConcentrationId,CourseId,Type")] Concentrationcourse concentrationcourse)
        {
            if (id != concentrationcourse.CourseId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(concentrationcourse);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ConcentrationcourseExists(concentrationcourse.CourseId))
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
            return View(concentrationcourse);
        }

        // GET: Concentrationcourses/Delete/5
        public async Task<IActionResult> Delete(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var concentrationcourse = await _context.Concentrationcourse
                .FirstOrDefaultAsync(m => m.CourseId == id);
            if (concentrationcourse == null)
            {
                return NotFound();
            }

            return View(concentrationcourse);
        }

        // POST: Concentrationcourses/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            var concentrationcourse = await _context.Concentrationcourse.FindAsync(id);
            if (concentrationcourse != null)
            {
                _context.Concentrationcourse.Remove(concentrationcourse);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool ConcentrationcourseExists(string id)
        {
            return _context.Concentrationcourse.Any(e => e.CourseId == id);
        }
    }
}
