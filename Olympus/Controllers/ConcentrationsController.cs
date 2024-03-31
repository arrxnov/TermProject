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
    public class ConcentrationsController : Controller
    {
        private readonly OlympusContext _context;

        public ConcentrationsController(OlympusContext context)
        {
            _context = context;
        }

        // GET: Concentrations
        public async Task<IActionResult> Index()
        {
            return View(await _context.Concentration.ToListAsync());
        }

        // GET: Concentrations/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var concentration = await _context.Concentration
                .FirstOrDefaultAsync(m => m.Id == id);
            if (concentration == null)
            {
                return NotFound();
            }

            return View(concentration);
        }

        // GET: Concentrations/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Concentrations/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Name,MajorId")] Concentration concentration)
        {
            if (ModelState.IsValid)
            {
                _context.Add(concentration);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(concentration);
        }

        // GET: Concentrations/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var concentration = await _context.Concentration.FindAsync(id);
            if (concentration == null)
            {
                return NotFound();
            }
            return View(concentration);
        }

        // POST: Concentrations/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,MajorId")] Concentration concentration)
        {
            if (id != concentration.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(concentration);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ConcentrationExists(concentration.Id))
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
            return View(concentration);
        }

        // GET: Concentrations/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var concentration = await _context.Concentration
                .FirstOrDefaultAsync(m => m.Id == id);
            if (concentration == null)
            {
                return NotFound();
            }

            return View(concentration);
        }

        // POST: Concentrations/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var concentration = await _context.Concentration.FindAsync(id);
            if (concentration != null)
            {
                _context.Concentration.Remove(concentration);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool ConcentrationExists(int id)
        {
            return _context.Concentration.Any(e => e.Id == id);
        }
    }
}
