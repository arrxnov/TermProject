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
    public class PlannedconcentrationsController : Controller
    {
        private readonly OlympusContext _context;

        public PlannedconcentrationsController(OlympusContext context)
        {
            _context = context;
        }

        // GET: Plannedconcentrations
        public async Task<IActionResult> Index()
        {
            return View(await _context.Plannedconcentration.ToListAsync());
        }

        // GET: Plannedconcentrations/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var plannedconcentration = await _context.Plannedconcentration
                .FirstOrDefaultAsync(m => m.ConcentrationId == id);
            if (plannedconcentration == null)
            {
                return NotFound();
            }

            return View(plannedconcentration);
        }

        // GET: Plannedconcentrations/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Plannedconcentrations/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ConcentrationId,PlanId")] Plannedconcentration plannedconcentration)
        {
            if (ModelState.IsValid)
            {
                _context.Add(plannedconcentration);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(plannedconcentration);
        }

        // GET: Plannedconcentrations/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var plannedconcentration = await _context.Plannedconcentration.FindAsync(id);
            if (plannedconcentration == null)
            {
                return NotFound();
            }
            return View(plannedconcentration);
        }

        // POST: Plannedconcentrations/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ConcentrationId,PlanId")] Plannedconcentration plannedconcentration)
        {
            if (id != plannedconcentration.ConcentrationId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(plannedconcentration);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PlannedconcentrationExists(plannedconcentration.ConcentrationId))
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
            return View(plannedconcentration);
        }

        // GET: Plannedconcentrations/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var plannedconcentration = await _context.Plannedconcentration
                .FirstOrDefaultAsync(m => m.ConcentrationId == id);
            if (plannedconcentration == null)
            {
                return NotFound();
            }

            return View(plannedconcentration);
        }

        // POST: Plannedconcentrations/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var plannedconcentration = await _context.Plannedconcentration.FindAsync(id);
            if (plannedconcentration != null)
            {
                _context.Plannedconcentration.Remove(plannedconcentration);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool PlannedconcentrationExists(int id)
        {
            return _context.Plannedconcentration.Any(e => e.ConcentrationId == id);
        }
    }
}
