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
    public class CatalogcoursesController : Controller
    {
        private readonly OlympusContext _context;

        public CatalogcoursesController(OlympusContext context)
        {
            _context = context;
        }

        // GET: Catalogcourses
        public async Task<IActionResult> Index()
        {
            return View(await _context.Catalogcourse.ToListAsync());
        }

        // GET: Catalogcourses/Details/5
        public async Task<IActionResult> Details(decimal? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var catalogcourse = await _context.Catalogcourse
                .FirstOrDefaultAsync(m => m.CatalogYear == id);
            if (catalogcourse == null)
            {
                return NotFound();
            }

            return View(catalogcourse);
        }

        // GET: Catalogcourses/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Catalogcourses/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("CatalogYear,CourseId")] Catalogcourse catalogcourse)
        {
            if (ModelState.IsValid)
            {
                _context.Add(catalogcourse);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(catalogcourse);
        }

        // GET: Catalogcourses/Edit/5
        public async Task<IActionResult> Edit(decimal? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var catalogcourse = await _context.Catalogcourse.FindAsync(id);
            if (catalogcourse == null)
            {
                return NotFound();
            }
            return View(catalogcourse);
        }

        // POST: Catalogcourses/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(decimal id, [Bind("CatalogYear,CourseId")] Catalogcourse catalogcourse)
        {
            if (id != catalogcourse.CatalogYear)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(catalogcourse);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CatalogcourseExists(catalogcourse.CatalogYear))
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
            return View(catalogcourse);
        }

        // GET: Catalogcourses/Delete/5
        public async Task<IActionResult> Delete(decimal? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var catalogcourse = await _context.Catalogcourse
                .FirstOrDefaultAsync(m => m.CatalogYear == id);
            if (catalogcourse == null)
            {
                return NotFound();
            }

            return View(catalogcourse);
        }

        // POST: Catalogcourses/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(decimal id)
        {
            var catalogcourse = await _context.Catalogcourse.FindAsync(id);
            if (catalogcourse != null)
            {
                _context.Catalogcourse.Remove(catalogcourse);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool CatalogcourseExists(decimal id)
        {
            return _context.Catalogcourse.Any(e => e.CatalogYear == id);
        }
    }
}
