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
    public class GenedsController : Controller
    {
        private readonly OlympusContext _context;

        public GenedsController(OlympusContext context)
        {
            _context = context;
        }

        // GET: Geneds
        public async Task<IActionResult> Index()
        {
            return View(await _context.Gened.ToListAsync());
        }

        // GET: Geneds/Details/5
        public async Task<IActionResult> Details(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var gened = await _context.Gened
                .FirstOrDefaultAsync(m => m.CourseId == id);
            if (gened == null)
            {
                return NotFound();
            }

            return View(gened);
        }

        // GET: Geneds/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Geneds/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("CatalogYear,CourseId,Type")] Gened gened)
        {
            if (ModelState.IsValid)
            {
                _context.Add(gened);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(gened);
        }

        // GET: Geneds/Edit/5
        public async Task<IActionResult> Edit(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var gened = await _context.Gened.FindAsync(id);
            if (gened == null)
            {
                return NotFound();
            }
            return View(gened);
        }

        // POST: Geneds/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, [Bind("CatalogYear,CourseId,Type")] Gened gened)
        {
            if (id != gened.CourseId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(gened);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!GenedExists(gened.CourseId))
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
            return View(gened);
        }

        // GET: Geneds/Delete/5
        public async Task<IActionResult> Delete(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var gened = await _context.Gened
                .FirstOrDefaultAsync(m => m.CourseId == id);
            if (gened == null)
            {
                return NotFound();
            }

            return View(gened);
        }

        // POST: Geneds/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            var gened = await _context.Gened.FindAsync(id);
            if (gened != null)
            {
                _context.Gened.Remove(gened);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool GenedExists(string id)
        {
            return _context.Gened.Any(e => e.CourseId == id);
        }
    }
}
