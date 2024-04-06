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
    public class AdviseesController : Controller
    {
        private readonly OlympusContext _context;

        public AdviseesController(OlympusContext context)
        {
            _context = context;
        }

        // GET: Advisees
        public async Task<IActionResult> Index()
        {
            return View(await _context.Advisee.ToListAsync());
        }

        // GET: Advisees/Details/5
        public async Task<IActionResult> Details(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var advisee = await _context.Advisee
                .FirstOrDefaultAsync(m => m.AdvisorId == id);
            if (advisee == null)
            {
                return NotFound();
            }

            return View(advisee);
        }

        // GET: Advisees/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Advisees/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("AdvisorId,AdviseeId")] Advisee advisee)
        {
            if (ModelState.IsValid)
            {
                _context.Add(advisee);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(advisee);
        }

        // GET: Advisees/Edit/5
        public async Task<IActionResult> Edit(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var advisee = await _context.Advisee.FindAsync(id);
            if (advisee == null)
            {
                return NotFound();
            }
            return View(advisee);
        }

        // POST: Advisees/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(string id, [Bind("AdvisorId,AdviseeId")] Advisee advisee)
        {
            if (id != advisee.AdvisorId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(advisee);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!AdviseeExists(advisee.AdvisorId))
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
            return View(advisee);
        }

        // GET: Advisees/Delete/5
        public async Task<IActionResult> Delete(string id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var advisee = await _context.Advisee
                .FirstOrDefaultAsync(m => m.AdvisorId == id);
            if (advisee == null)
            {
                return NotFound();
            }

            return View(advisee);
        }

        // POST: Advisees/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(string id)
        {
            var advisee = await _context.Advisee.FindAsync(id);
            if (advisee != null)
            {
                _context.Advisee.Remove(advisee);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool AdviseeExists(string id)
        {
            return _context.Advisee.Any(e => e.AdvisorId == id);
        }
    }
}
