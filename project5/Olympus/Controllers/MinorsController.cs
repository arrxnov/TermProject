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
    public class MinorsController : Controller
    {
        private readonly OlympusContext _context;

        public MinorsController(OlympusContext context)
        {
            _context = context;
        }

        // GET: Minors
        public async Task<IActionResult> Index()
        {
            return View(await _context.Minor.ToListAsync());
        }

        // GET: Minors/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var minor = await _context.Minor
                .FirstOrDefaultAsync(m => m.Id == id);
            if (minor == null)
            {
                return NotFound();
            }

            return View(minor);
        }

        // GET: Minors/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Minors/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Name,CatalogYear")] Minor minor)
        {
            if (ModelState.IsValid)
            {
                _context.Add(minor);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(minor);
        }

        // GET: Minors/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var minor = await _context.Minor.FindAsync(id);
            if (minor == null)
            {
                return NotFound();
            }
            return View(minor);
        }

        // POST: Minors/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,CatalogYear")] Minor minor)
        {
            if (id != minor.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(minor);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!MinorExists(minor.Id))
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
            return View(minor);
        }

        // GET: Minors/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var minor = await _context.Minor
                .FirstOrDefaultAsync(m => m.Id == id);
            if (minor == null)
            {
                return NotFound();
            }

            return View(minor);
        }

        // POST: Minors/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var minor = await _context.Minor.FindAsync(id);
            if (minor != null)
            {
                _context.Minor.Remove(minor);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool MinorExists(int id)
        {
            return _context.Minor.Any(e => e.Id == id);
        }
    }
}
