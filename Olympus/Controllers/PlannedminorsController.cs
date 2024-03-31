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
    public class PlannedminorsController : Controller
    {
        private readonly OlympusContext _context;

        public PlannedminorsController(OlympusContext context)
        {
            _context = context;
        }

        // GET: Plannedminors
        public async Task<IActionResult> Index()
        {
            return View(await _context.Plannedminor.ToListAsync());
        }

        // GET: Plannedminors/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var plannedminor = await _context.Plannedminor
                .FirstOrDefaultAsync(m => m.MinorId == id);
            if (plannedminor == null)
            {
                return NotFound();
            }

            return View(plannedminor);
        }

        // GET: Plannedminors/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Plannedminors/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("MinorId,PlanId")] Plannedminor plannedminor)
        {
            if (ModelState.IsValid)
            {
                _context.Add(plannedminor);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(plannedminor);
        }

        // GET: Plannedminors/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var plannedminor = await _context.Plannedminor.FindAsync(id);
            if (plannedminor == null)
            {
                return NotFound();
            }
            return View(plannedminor);
        }

        // POST: Plannedminors/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("MinorId,PlanId")] Plannedminor plannedminor)
        {
            if (id != plannedminor.MinorId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(plannedminor);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PlannedminorExists(plannedminor.MinorId))
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
            return View(plannedminor);
        }

        // GET: Plannedminors/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var plannedminor = await _context.Plannedminor
                .FirstOrDefaultAsync(m => m.MinorId == id);
            if (plannedminor == null)
            {
                return NotFound();
            }

            return View(plannedminor);
        }

        // POST: Plannedminors/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var plannedminor = await _context.Plannedminor.FindAsync(id);
            if (plannedminor != null)
            {
                _context.Plannedminor.Remove(plannedminor);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool PlannedminorExists(int id)
        {
            return _context.Plannedminor.Any(e => e.MinorId == id);
        }
    }
}
