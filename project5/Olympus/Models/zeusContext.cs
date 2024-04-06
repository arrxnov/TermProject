using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;

namespace Olympus.Models;

public partial class zeusContext : DbContext
{
    public zeusContext()
    {
    }

    public zeusContext(DbContextOptions<zeusContext> options)
        : base(options)
    {
    }

    public virtual DbSet<__efmigrationshistory> __efmigrationshistories { get; set; }

    public virtual DbSet<aspnetrole> aspnetroles { get; set; }

    public virtual DbSet<aspnetroleclaim> aspnetroleclaims { get; set; }

    public virtual DbSet<aspnetuser> aspnetusers { get; set; }

    public virtual DbSet<aspnetuserclaim> aspnetuserclaims { get; set; }

    public virtual DbSet<aspnetuserlogin> aspnetuserlogins { get; set; }

    public virtual DbSet<aspnetusertoken> aspnetusertokens { get; set; }

    public virtual DbSet<catalog> catalogs { get; set; }

    public virtual DbSet<concentration> concentrations { get; set; }

    public virtual DbSet<concentrationcourse> concentrationcourses { get; set; }

    public virtual DbSet<course> courses { get; set; }

    public virtual DbSet<gened> geneds { get; set; }

    public virtual DbSet<major> majors { get; set; }

    public virtual DbSet<majorcourse> majorcourses { get; set; }

    public virtual DbSet<minor> minors { get; set; }

    public virtual DbSet<minorcourse> minorcourses { get; set; }

    public virtual DbSet<plan> plans { get; set; }

    public virtual DbSet<plannedcourse> plannedcourses { get; set; }

    public virtual DbSet<user> users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseMySql("server=localhost;database=zeus;username=root", Microsoft.EntityFrameworkCore.ServerVersion.Parse("10.4.32-mariadb"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_general_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<__efmigrationshistory>(entity =>
        {
            entity.HasKey(e => e.MigrationId).HasName("PRIMARY");

            entity.ToTable("__efmigrationshistory");

            entity.Property(e => e.MigrationId).HasMaxLength(150);
            entity.Property(e => e.ProductVersion).HasMaxLength(32);
        });

        modelBuilder.Entity<aspnetrole>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.HasIndex(e => e.NormalizedName, "RoleNameIndex").IsUnique();

            entity.Property(e => e.Name).HasMaxLength(256);
            entity.Property(e => e.NormalizedName).HasMaxLength(256);
        });

        modelBuilder.Entity<aspnetroleclaim>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.HasIndex(e => e.RoleId, "IX_AspNetRoleClaims_RoleId");

            entity.Property(e => e.Id).HasColumnType("int(11)");

            entity.HasOne(d => d.Role).WithMany(p => p.aspnetroleclaims)
                .HasForeignKey(d => d.RoleId)
                .HasConstraintName("FK_AspNetRoleClaims_AspNetRoles_RoleId");
        });

        modelBuilder.Entity<aspnetuser>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.HasIndex(e => e.NormalizedEmail, "EmailIndex");

            entity.HasIndex(e => e.NormalizedUserName, "UserNameIndex").IsUnique();

            entity.Property(e => e.AccessFailedCount).HasColumnType("int(11)");
            entity.Property(e => e.Email).HasMaxLength(256);
            entity.Property(e => e.LockoutEnd).HasMaxLength(6);
            entity.Property(e => e.NormalizedEmail).HasMaxLength(256);
            entity.Property(e => e.NormalizedUserName).HasMaxLength(256);
            entity.Property(e => e.UserName).HasMaxLength(256);

            entity.HasMany(d => d.Roles).WithMany(p => p.Users)
                .UsingEntity<Dictionary<string, object>>(
                    "aspnetuserrole",
                    r => r.HasOne<aspnetrole>().WithMany()
                        .HasForeignKey("RoleId")
                        .HasConstraintName("FK_AspNetUserRoles_AspNetRoles_RoleId"),
                    l => l.HasOne<aspnetuser>().WithMany()
                        .HasForeignKey("UserId")
                        .HasConstraintName("FK_AspNetUserRoles_AspNetUsers_UserId"),
                    j =>
                    {
                        j.HasKey("UserId", "RoleId")
                            .HasName("PRIMARY")
                            .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });
                        j.ToTable("aspnetuserroles");
                        j.HasIndex(new[] { "RoleId" }, "IX_AspNetUserRoles_RoleId");
                    });

            entity.HasMany(d => d.advisees).WithMany(p => p.advisors)
                .UsingEntity<Dictionary<string, object>>(
                    "advisee",
                    r => r.HasOne<aspnetuser>().WithMany()
                        .HasForeignKey("advisee_id")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("advisee_ibfk_2"),
                    l => l.HasOne<aspnetuser>().WithMany()
                        .HasForeignKey("advisor_id")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("advisee_ibfk_1"),
                    j =>
                    {
                        j.HasKey("advisor_id", "advisee_id")
                            .HasName("PRIMARY")
                            .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });
                        j.ToTable("advisee");
                        j.HasIndex(new[] { "advisee_id" }, "advisee_id");
                    });

            entity.HasMany(d => d.advisors).WithMany(p => p.advisees)
                .UsingEntity<Dictionary<string, object>>(
                    "advisee",
                    r => r.HasOne<aspnetuser>().WithMany()
                        .HasForeignKey("advisor_id")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("advisee_ibfk_1"),
                    l => l.HasOne<aspnetuser>().WithMany()
                        .HasForeignKey("advisee_id")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("advisee_ibfk_2"),
                    j =>
                    {
                        j.HasKey("advisor_id", "advisee_id")
                            .HasName("PRIMARY")
                            .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });
                        j.ToTable("advisee");
                        j.HasIndex(new[] { "advisee_id" }, "advisee_id");
                    });
        });

        modelBuilder.Entity<aspnetuserclaim>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.HasIndex(e => e.UserId, "IX_AspNetUserClaims_UserId");

            entity.Property(e => e.Id).HasColumnType("int(11)");

            entity.HasOne(d => d.User).WithMany(p => p.aspnetuserclaims)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_AspNetUserClaims_AspNetUsers_UserId");
        });

        modelBuilder.Entity<aspnetuserlogin>(entity =>
        {
            entity.HasKey(e => new { e.LoginProvider, e.ProviderKey })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.HasIndex(e => e.UserId, "IX_AspNetUserLogins_UserId");

            entity.Property(e => e.LoginProvider).HasMaxLength(128);
            entity.Property(e => e.ProviderKey).HasMaxLength(128);

            entity.HasOne(d => d.User).WithMany(p => p.aspnetuserlogins)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_AspNetUserLogins_AspNetUsers_UserId");
        });

        modelBuilder.Entity<aspnetusertoken>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.LoginProvider, e.Name })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0, 0 });

            entity.Property(e => e.LoginProvider).HasMaxLength(128);
            entity.Property(e => e.Name).HasMaxLength(128);

            entity.HasOne(d => d.User).WithMany(p => p.aspnetusertokens)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_AspNetUserTokens_AspNetUsers_UserId");
        });

        modelBuilder.Entity<catalog>(entity =>
        {
            entity.HasKey(e => e.year).HasName("PRIMARY");

            entity.ToTable("catalog");

            entity.Property(e => e.year).HasPrecision(4);
        });

        modelBuilder.Entity<concentration>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.ToTable("concentration");

            entity.HasIndex(e => e.major_id, "major_id");

            entity.Property(e => e.id).HasColumnType("int(11)");
            entity.Property(e => e.major_id).HasColumnType("int(11)");
            entity.Property(e => e.name).HasMaxLength(32);

            entity.HasOne(d => d.major).WithMany(p => p.concentrations)
                .HasForeignKey(d => d.major_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("concentration_ibfk_1");

            entity.HasMany(d => d.plans).WithMany(p => p.concentrations)
                .UsingEntity<Dictionary<string, object>>(
                    "plannedconcentration",
                    r => r.HasOne<plan>().WithMany()
                        .HasForeignKey("plan_id")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("plannedconcentration_ibfk_2"),
                    l => l.HasOne<concentration>().WithMany()
                        .HasForeignKey("concentration_id")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("plannedconcentration_ibfk_1"),
                    j =>
                    {
                        j.HasKey("concentration_id", "plan_id")
                            .HasName("PRIMARY")
                            .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });
                        j.ToTable("plannedconcentration");
                        j.HasIndex(new[] { "plan_id" }, "plan_id");
                        j.IndexerProperty<int>("concentration_id").HasColumnType("int(11)");
                        j.IndexerProperty<int>("plan_id").HasColumnType("int(11)");
                    });
        });

        modelBuilder.Entity<concentrationcourse>(entity =>
        {
            entity.HasKey(e => new { e.course_id, e.concentration_id })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.ToTable("concentrationcourse");

            entity.HasIndex(e => e.concentration_id, "concentration_id");

            entity.Property(e => e.course_id).HasMaxLength(9);
            entity.Property(e => e.concentration_id).HasColumnType("int(11)");
            entity.Property(e => e.type).HasMaxLength(9);

            entity.HasOne(d => d.concentration).WithMany(p => p.concentrationcourses)
                .HasForeignKey(d => d.concentration_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("concentrationcourse_ibfk_1");

            entity.HasOne(d => d.course).WithMany(p => p.concentrationcourses)
                .HasForeignKey(d => d.course_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("concentrationcourse_ibfk_2");
        });

        modelBuilder.Entity<course>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.ToTable("course");

            entity.Property(e => e.id).HasMaxLength(9);
            entity.Property(e => e.credits).HasMaxLength(9);
            entity.Property(e => e.description).HasMaxLength(512);
            entity.Property(e => e.name).HasMaxLength(64);

            entity.HasMany(d => d.catalog_years).WithMany(p => p.courses)
                .UsingEntity<Dictionary<string, object>>(
                    "catalogcourse",
                    r => r.HasOne<catalog>().WithMany()
                        .HasForeignKey("catalog_year")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("catalogcourse_ibfk_1"),
                    l => l.HasOne<course>().WithMany()
                        .HasForeignKey("course_id")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("catalogcourse_ibfk_2"),
                    j =>
                    {
                        j.HasKey("course_id", "catalog_year")
                            .HasName("PRIMARY")
                            .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });
                        j.ToTable("catalogcourse");
                        j.HasIndex(new[] { "catalog_year" }, "catalog_year");
                        j.IndexerProperty<string>("course_id").HasMaxLength(9);
                        j.IndexerProperty<decimal>("catalog_year").HasPrecision(4);
                    });

            entity.HasMany(d => d.courses).WithMany(p => p.prereqs)
                .UsingEntity<Dictionary<string, object>>(
                    "prereq",
                    r => r.HasOne<course>().WithMany()
                        .HasForeignKey("course_id")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("prereq_ibfk_1"),
                    l => l.HasOne<course>().WithMany()
                        .HasForeignKey("prereq_id")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("prereq_ibfk_2"),
                    j =>
                    {
                        j.HasKey("course_id", "prereq_id")
                            .HasName("PRIMARY")
                            .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });
                        j.ToTable("prereq");
                        j.HasIndex(new[] { "prereq_id" }, "prereq_id");
                        j.IndexerProperty<string>("course_id").HasMaxLength(9);
                        j.IndexerProperty<string>("prereq_id").HasMaxLength(9);
                    });

            entity.HasMany(d => d.prereqs).WithMany(p => p.courses)
                .UsingEntity<Dictionary<string, object>>(
                    "prereq",
                    r => r.HasOne<course>().WithMany()
                        .HasForeignKey("prereq_id")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("prereq_ibfk_2"),
                    l => l.HasOne<course>().WithMany()
                        .HasForeignKey("course_id")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("prereq_ibfk_1"),
                    j =>
                    {
                        j.HasKey("course_id", "prereq_id")
                            .HasName("PRIMARY")
                            .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });
                        j.ToTable("prereq");
                        j.HasIndex(new[] { "prereq_id" }, "prereq_id");
                        j.IndexerProperty<string>("course_id").HasMaxLength(9);
                        j.IndexerProperty<string>("prereq_id").HasMaxLength(9);
                    });
        });

        modelBuilder.Entity<gened>(entity =>
        {
            entity.HasKey(e => new { e.course_id, e.catalog_year })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.ToTable("gened");

            entity.HasIndex(e => e.catalog_year, "catalog_year");

            entity.Property(e => e.course_id).HasMaxLength(9);
            entity.Property(e => e.catalog_year).HasPrecision(4);
            entity.Property(e => e.type).HasMaxLength(9);

            entity.HasOne(d => d.catalog_yearNavigation).WithMany(p => p.geneds)
                .HasForeignKey(d => d.catalog_year)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("gened_ibfk_1");

            entity.HasOne(d => d.course).WithMany(p => p.geneds)
                .HasForeignKey(d => d.course_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("gened_ibfk_2");
        });

        modelBuilder.Entity<major>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.ToTable("major");

            entity.HasIndex(e => e.catalog_year, "catalog_year");

            entity.Property(e => e.id).HasColumnType("int(11)");
            entity.Property(e => e.catalog_year).HasPrecision(4);
            entity.Property(e => e.name).HasMaxLength(32);

            entity.HasOne(d => d.catalog_yearNavigation).WithMany(p => p.majors)
                .HasForeignKey(d => d.catalog_year)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("major_ibfk_1");

            entity.HasMany(d => d.plans).WithMany(p => p.majors)
                .UsingEntity<Dictionary<string, object>>(
                    "plannedmajor",
                    r => r.HasOne<plan>().WithMany()
                        .HasForeignKey("plan_id")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("plannedmajor_ibfk_2"),
                    l => l.HasOne<major>().WithMany()
                        .HasForeignKey("major_id")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("plannedmajor_ibfk_1"),
                    j =>
                    {
                        j.HasKey("major_id", "plan_id")
                            .HasName("PRIMARY")
                            .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });
                        j.ToTable("plannedmajor");
                        j.HasIndex(new[] { "plan_id" }, "plan_id");
                        j.IndexerProperty<int>("major_id").HasColumnType("int(11)");
                        j.IndexerProperty<int>("plan_id").HasColumnType("int(11)");
                    });
        });

        modelBuilder.Entity<majorcourse>(entity =>
        {
            entity.HasKey(e => new { e.course_id, e.major_id })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.ToTable("majorcourse");

            entity.HasIndex(e => e.major_id, "major_id");

            entity.Property(e => e.course_id).HasMaxLength(9);
            entity.Property(e => e.major_id).HasColumnType("int(11)");
            entity.Property(e => e.type).HasMaxLength(9);

            entity.HasOne(d => d.course).WithMany(p => p.majorcourses)
                .HasForeignKey(d => d.course_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("majorcourse_ibfk_1");

            entity.HasOne(d => d.major).WithMany(p => p.majorcourses)
                .HasForeignKey(d => d.major_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("majorcourse_ibfk_2");
        });

        modelBuilder.Entity<minor>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.ToTable("minor");

            entity.HasIndex(e => e.catalog_year, "catalog_year");

            entity.Property(e => e.id).HasColumnType("int(11)");
            entity.Property(e => e.catalog_year).HasPrecision(4);
            entity.Property(e => e.name).HasMaxLength(32);

            entity.HasOne(d => d.catalog_yearNavigation).WithMany(p => p.minors)
                .HasForeignKey(d => d.catalog_year)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("minor_ibfk_1");

            entity.HasMany(d => d.plans).WithMany(p => p.minors)
                .UsingEntity<Dictionary<string, object>>(
                    "plannedminor",
                    r => r.HasOne<plan>().WithMany()
                        .HasForeignKey("plan_id")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("plannedminor_ibfk_2"),
                    l => l.HasOne<minor>().WithMany()
                        .HasForeignKey("minor_id")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("plannedminor_ibfk_1"),
                    j =>
                    {
                        j.HasKey("minor_id", "plan_id")
                            .HasName("PRIMARY")
                            .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });
                        j.ToTable("plannedminor");
                        j.HasIndex(new[] { "plan_id" }, "plan_id");
                        j.IndexerProperty<int>("minor_id").HasColumnType("int(11)");
                        j.IndexerProperty<int>("plan_id").HasColumnType("int(11)");
                    });
        });

        modelBuilder.Entity<minorcourse>(entity =>
        {
            entity.HasKey(e => new { e.course_id, e.minor_id })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity.ToTable("minorcourse");

            entity.HasIndex(e => e.minor_id, "minor_id");

            entity.Property(e => e.course_id).HasMaxLength(9);
            entity.Property(e => e.minor_id).HasColumnType("int(11)");
            entity.Property(e => e.type).HasMaxLength(9);

            entity.HasOne(d => d.course).WithMany(p => p.minorcourses)
                .HasForeignKey(d => d.course_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("minorcourse_ibfk_2");

            entity.HasOne(d => d.minor).WithMany(p => p.minorcourses)
                .HasForeignKey(d => d.minor_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("minorcourse_ibfk_1");
        });

        modelBuilder.Entity<plan>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.ToTable("plan");

            entity.HasIndex(e => e.catalog_year, "catalog_year");

            entity.HasIndex(e => e.user_id, "user_id");

            entity.Property(e => e.id).HasColumnType("int(11)");
            entity.Property(e => e.catalog_year).HasPrecision(4);
            entity.Property(e => e.name).HasMaxLength(32);

            entity.HasOne(d => d.catalog_yearNavigation).WithMany(p => p.plans)
                .HasForeignKey(d => d.catalog_year)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("plan_ibfk_2");

            entity.HasOne(d => d.user).WithMany(p => p.plans)
                .HasForeignKey(d => d.user_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("plan_ibfk_1");
        });

        modelBuilder.Entity<plannedcourse>(entity =>
        {
            entity.HasKey(e => new { e.plan_id, e.course_id, e.year, e.term })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0, 0, 0 });

            entity.ToTable("plannedcourse");

            entity.HasIndex(e => e.course_id, "course_id");

            entity.Property(e => e.plan_id).HasColumnType("int(11)");
            entity.Property(e => e.course_id).HasMaxLength(9);
            entity.Property(e => e.year).HasPrecision(4);
            entity.Property(e => e.term).HasMaxLength(6);

            entity.HasOne(d => d.course).WithMany(p => p.plannedcourses)
                .HasForeignKey(d => d.course_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("plannedcourse_ibfk_1");

            entity.HasOne(d => d.plan).WithMany(p => p.plannedcourses)
                .HasForeignKey(d => d.plan_id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("plannedcourse_ibfk_2");
        });

        modelBuilder.Entity<user>(entity =>
        {
            entity.HasKey(e => e.id).HasName("PRIMARY");

            entity.ToTable("user");

            entity.Property(e => e.default_plan_id).HasColumnType("int(11)");
            entity.Property(e => e.gpa).HasPrecision(3, 2);
            entity.Property(e => e.major_gpa).HasPrecision(3, 2);
            entity.Property(e => e.name).HasMaxLength(64);

            entity.HasOne(d => d.idNavigation).WithOne(p => p.user)
                .HasForeignKey<user>(d => d.id)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("user_ibfk_1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
