//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Identity;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Mvc.Rendering;
//using Microsoft.EntityFrameworkCore;
//using Olympus.Models;

//namespace Olympus.Controllers
//{
//    public class AdvisorController : Controller
//    {
//        private readonly Zeus _context;
//        private readonly UserManager<aspnetuser> _userManager;

//        public AdvisorController(Zeus context, UserManager<aspnetuser> userManager)
//        {
//            _context = context;
//            _userManager = userManager;
//        }

//        // GET: aspnetusers
//        public async Task<IActionResult> Index()
//        {
//            var user = await _userManager.GetUserAsync(User);
            
//            return View(await _context.aspnetusers.Where(stu => stu.advisors.ToList().Contains(user)).ToListAsync());
//        }

//        // GET: aspnetusers/Details/5
//        public async Task<IActionResult> Details(string id)
//        {
//            if (id == null)
//            {
//                return NotFound();
//            }

//            var aspnetuser = await _context.aspnetusers
//                .FirstOrDefaultAsync(m => m.Id == id);
//            if (aspnetuser == null)
//            {
//                return NotFound();
//            }

//            return View(aspnetuser);
//        }

//        // GET: aspnetusers/Create
//        public IActionResult Create()
//        {
//            return View();
//        }

//        // POST: aspnetusers/Create
//        // To protect from overposting attacks, enable the specific properties you want to bind to.
//        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
//        [HttpPost]
//        [ValidateAntiForgeryToken]
//        public async Task<IActionResult> Create([Bind("Id,UserName,NormalizedUserName,Email,NormalizedEmail,EmailConfirmed,PasswordHash,SecurityStamp,ConcurrencyStamp,PhoneNumber,PhoneNumberConfirmed,TwoFactorEnabled,LockoutEnd,LockoutEnabled,AccessFailedCount")] aspnetuser aspnetuser)
//        {
//            if (ModelState.IsValid)
//            {
//                _context.Add(aspnetuser);
//                await _context.SaveChangesAsync();
//                return RedirectToAction(nameof(Index));
//            }
//            return View(aspnetuser);
//        }

//        // GET: aspnetusers/Edit/5
//        public async Task<IActionResult> Edit(string id)
//        {
//            if (id == null)
//            {
//                return NotFound();
//            }

//            var aspnetuser = await _context.aspnetusers.FindAsync(id);
//            if (aspnetuser == null)
//            {
//                return NotFound();
//            }
//            return View(aspnetuser);
//        }

//        // POST: aspnetusers/Edit/5
//        // To protect from overposting attacks, enable the specific properties you want to bind to.
//        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
//        [HttpPost]
//        [ValidateAntiForgeryToken]
//        public async Task<IActionResult> Edit(string id, [Bind("Id,UserName,NormalizedUserName,Email,NormalizedEmail,EmailConfirmed,PasswordHash,SecurityStamp,ConcurrencyStamp,PhoneNumber,PhoneNumberConfirmed,TwoFactorEnabled,LockoutEnd,LockoutEnabled,AccessFailedCount")] aspnetuser aspnetuser)
//        {
//            if (id != aspnetuser.Id)
//            {
//                return NotFound();
//            }

//            if (ModelState.IsValid)
//            {
//                try
//                {
//                    _context.Update(aspnetuser);
//                    await _context.SaveChangesAsync();
//                }
//                catch (DbUpdateConcurrencyException)
//                {
//                    if (!aspnetuserExists(aspnetuser.Id))
//                    {
//                        return NotFound();
//                    }
//                    else
//                    {
//                        throw;
//                    }
//                }
//                return RedirectToAction(nameof(Index));
//            }
//            return View(aspnetuser);
//        }

//        // GET: aspnetusers/Delete/5
//        public async Task<IActionResult> Delete(string id)
//        {
//            if (id == null)
//            {
//                return NotFound();
//            }

//            var aspnetuser = await _context.aspnetusers
//                .FirstOrDefaultAsync(m => m.Id == id);
//            if (aspnetuser == null)
//            {
//                return NotFound();
//            }

//            return View(aspnetuser);
//        }

//        // POST: aspnetusers/Delete/5
//        [HttpPost, ActionName("Delete")]
//        [ValidateAntiForgeryToken]
//        public async Task<IActionResult> DeleteConfirmed(string id)
//        {
//            var aspnetuser = await _context.aspnetusers.FindAsync(id);
//            if (aspnetuser != null)
//            {
//                _context.aspnetusers.Remove(aspnetuser);
//            }

//            await _context.SaveChangesAsync();
//            return RedirectToAction(nameof(Index));
//        }

//        private bool aspnetuserExists(string id)
//        {
//            return _context.aspnetusers.Any(e => e.Id == id);
//        }
//    }
//}
