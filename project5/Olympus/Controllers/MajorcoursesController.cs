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
    public class MajorcoursesController : Controller
    {
        private readonly OlympusContext _context;

        public MajorcoursesController(OlympusContext context)
        {
            _context = context;
        }

        // GET: Majorcourses
        public async Task<IActionResult> Index()
        {
            return View(await _context.Majorcourse.ToListAsync());
        }

        // GET: Majorcourses/Details/5
        public async Task<IActionResult> Details(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var majorcourse = await _context.Majorcourse
                .FirstOrDefaultAsync(m => m.CourseId == id);
            if (majorcourse == null)
            {
                return NotFound();
            }

            return View(majorcourse);
        }

        // GET: Majorcourses/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Majorcourses/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("MajorId,CourseId,Type")] Majorcourse majorcourse)
        {
            if (ModelState.IsValid)
            {
                _context.Add(majorcourse);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(majorcourse);
        }

        // GET: Majorcourses/Edit/5
        public async Task<IActionResult> Edit(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var majorcourse = await _context.Majorcourse.FindAsync(id);
            if (majorcourse == null)
            {
                return NotFound();
            }
            return View(majorcourse);
        }

        // POST: Majorcourses/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, [Bind("MajorId,CourseId,Type")] Majorcourse majorcourse)
        {
            if (id != majorcourse.CourseId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(majorcourse);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!MajorcourseExists(majorcourse.CourseId))
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
            return View(majorcourse);
        }

        // GET: Majorcourses/Delete/5
        public async Task<IActionResult> Delete(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var majorcourse = await _context.Majorcourse
                .FirstOrDefaultAsync(m => m.CourseId == id);
            if (majorcourse == null)
            {
                return NotFound();
            }

            return View(majorcourse);
        }

        // POST: Majorcourses/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            var majorcourse = await _context.Majorcourse.FindAsync(id);
            if (majorcourse != null)
            {
                _context.Majorcourse.Remove(majorcourse);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool MajorcourseExists(string id)
        {
            return _context.Majorcourse.Any(e => e.CourseId == id);
        }
    }
}
