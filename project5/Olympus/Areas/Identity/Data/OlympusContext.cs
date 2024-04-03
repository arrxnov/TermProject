using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Olympus.Areas.Identity.Data;
using Olympus.Models;

namespace Olympus.Data;

public class OlympusContext : IdentityDbContext<OlympusUser>
{
    public OlympusContext(DbContextOptions<OlympusContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        // Customize the ASP.NET Identity model and override the defaults if needed.
        // For example, you can rename the ASP.NET Identity table names and more.
        // Add your customizations after calling base.OnModelCreating(builder);
    }

public DbSet<Olympus.Models.User1> User { get; set; } = default!;

public DbSet<Olympus.Models.Catalog> Catalog { get; set; } = default!;

public DbSet<Olympus.Models.Major> Major { get; set; } = default!;

public DbSet<Olympus.Models.Minor> Minor { get; set; } = default!;

public DbSet<Olympus.Models.Concentration> Concentration { get; set; } = default!;

public DbSet<Olympus.Models.Course> Course { get; set; } = default!;

public DbSet<Olympus.Models.Catalogcourse> Catalogcourse { get; set; } = default!;

public DbSet<Olympus.Models.Prereq> Prereq { get; set; } = default!;

public DbSet<Olympus.Models.Gened> Gened { get; set; } = default!;

public DbSet<Olympus.Models.Majorcourse> Majorcourse { get; set; } = default!;

public DbSet<Olympus.Models.Minorcourse> Minorcourse { get; set; } = default!;

public DbSet<Olympus.Models.Concentrationcourse> Concentrationcourse { get; set; } = default!;

public DbSet<Olympus.Models.Plan1> Plan { get; set; } = default!;

public DbSet<Olympus.Models.Plannedmajor> Plannedmajor { get; set; } = default!;

public DbSet<Olympus.Models.Plannedminor> Plannedminor { get; set; } = default!;

public DbSet<Olympus.Models.Plannedconcentration> Plannedconcentration { get; set; } = default!;

public DbSet<Olympus.Models.Plannedcourse> Plannedcourse { get; set; } = default!;
}
