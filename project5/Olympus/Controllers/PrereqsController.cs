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
    public class PrereqsController : Controller
    {
        private readonly OlympusContext _context;

        public PrereqsController(OlympusContext context)
        {
            _context = context;
        }

        // GET: Prereqs
        public async Task<IActionResult> Index()
        {
            return View(await _context.Prereq.ToListAsync());
        }

        // GET: Prereqs/Details/5
        public async Task<IActionResult> Details(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var prereq = await _context.Prereq
                .FirstOrDefaultAsync(m => m.CourseId == id);
            if (prereq == null)
            {
                return NotFound();
            }

            return View(prereq);
        }

        // GET: Prereqs/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Prereqs/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("CourseId,PrereqId")] Prereq prereq)
        {
            if (ModelState.IsValid)
            {
                _context.Add(prereq);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(prereq);
        }

        // GET: Prereqs/Edit/5
        public async Task<IActionResult> Edit(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var prereq = await _context.Prereq.FindAsync(id);
            if (prereq == null)
            {
                return NotFound();
            }
            return View(prereq);
        }

        // POST: Prereqs/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, [Bind("CourseId,PrereqId")] Prereq prereq)
        {
            if (id != prereq.CourseId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(prereq);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PrereqExists(prereq.CourseId))
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
            return View(prereq);
        }

        // GET: Prereqs/Delete/5
        public async Task<IActionResult> Delete(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var prereq = await _context.Prereq
                .FirstOrDefaultAsync(m => m.CourseId == id);
            if (prereq == null)
            {
                return NotFound();
            }

            return View(prereq);
        }

        // POST: Prereqs/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            var prereq = await _context.Prereq.FindAsync(id);
            if (prereq != null)
            {
                _context.Prereq.Remove(prereq);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool PrereqExists(string id)
        {
            return _context.Prereq.Any(e => e.CourseId == id);
        }
    }
}
