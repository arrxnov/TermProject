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
    public class MinorcoursesController : Controller
    {
        private readonly OlympusContext _context;

        public MinorcoursesController(OlympusContext context)
        {
            _context = context;
        }

        // GET: Minorcourses
        public async Task<IActionResult> Index()
        {
            return View(await _context.Minorcourse.ToListAsync());
        }

        // GET: Minorcourses/Details/5
        public async Task<IActionResult> Details(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var minorcourse = await _context.Minorcourse
                .FirstOrDefaultAsync(m => m.CourseId == id);
            if (minorcourse == null)
            {
                return NotFound();
            }

            return View(minorcourse);
        }

        // GET: Minorcourses/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Minorcourses/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("MinorId,CourseId,Type")] Minorcourse minorcourse)
        {
            if (ModelState.IsValid)
            {
                _context.Add(minorcourse);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(minorcourse);
        }

        // GET: Minorcourses/Edit/5
        public async Task<IActionResult> Edit(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var minorcourse = await _context.Minorcourse.FindAsync(id);
            if (minorcourse == null)
            {
                return NotFound();
            }
            return View(minorcourse);
        }

        // POST: Minorcourses/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, [Bind("MinorId,CourseId,Type")] Minorcourse minorcourse)
        {
            if (id != minorcourse.CourseId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(minorcourse);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!MinorcourseExists(minorcourse.CourseId))
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
            return View(minorcourse);
        }

        // GET: Minorcourses/Delete/5
        public async Task<IActionResult> Delete(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var minorcourse = await _context.Minorcourse
                .FirstOrDefaultAsync(m => m.CourseId == id);
            if (minorcourse == null)
            {
                return NotFound();
            }

            return View(minorcourse);
        }

        // POST: Minorcourses/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            var minorcourse = await _context.Minorcourse.FindAsync(id);
            if (minorcourse != null)
            {
                _context.Minorcourse.Remove(minorcourse);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool MinorcourseExists(string id)
        {
            return _context.Minorcourse.Any(e => e.CourseId == id);
        }
    }
}
