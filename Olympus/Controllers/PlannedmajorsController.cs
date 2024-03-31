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
    public class PlannedmajorsController : Controller
    {
        private readonly OlympusContext _context;

        public PlannedmajorsController(OlympusContext context)
        {
            _context = context;
        }

        // GET: Plannedmajors
        public async Task<IActionResult> Index()
        {
            return View(await _context.Plannedmajor.ToListAsync());
        }

        // GET: Plannedmajors/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var plannedmajor = await _context.Plannedmajor
                .FirstOrDefaultAsync(m => m.MajorId == id);
            if (plannedmajor == null)
            {
                return NotFound();
            }

            return View(plannedmajor);
        }

        // GET: Plannedmajors/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Plannedmajors/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("MajorId,PlanId")] Plannedmajor plannedmajor)
        {
            if (ModelState.IsValid)
            {
                _context.Add(plannedmajor);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(plannedmajor);
        }

        // GET: Plannedmajors/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var plannedmajor = await _context.Plannedmajor.FindAsync(id);
            if (plannedmajor == null)
            {
                return NotFound();
            }
            return View(plannedmajor);
        }

        // POST: Plannedmajors/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("MajorId,PlanId")] Plannedmajor plannedmajor)
        {
            if (id != plannedmajor.MajorId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(plannedmajor);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PlannedmajorExists(plannedmajor.MajorId))
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
            return View(plannedmajor);
        }

        // GET: Plannedmajors/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var plannedmajor = await _context.Plannedmajor
                .FirstOrDefaultAsync(m => m.MajorId == id);
            if (plannedmajor == null)
            {
                return NotFound();
            }

            return View(plannedmajor);
        }

        // POST: Plannedmajors/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var plannedmajor = await _context.Plannedmajor.FindAsync(id);
            if (plannedmajor != null)
            {
                _context.Plannedmajor.Remove(plannedmajor);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool PlannedmajorExists(int id)
        {
            return _context.Plannedmajor.Any(e => e.MajorId == id);
        }
    }
}
