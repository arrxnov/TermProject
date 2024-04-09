﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Olympus.Models;

#nullable disable

namespace Olympus.Migrations.zeus
{
    [DbContext(typeof(zeusContext))]
    partial class zeusContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .UseCollation("utf8mb4_general_ci")
                .HasAnnotation("ProductVersion", "8.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            MySqlModelBuilderExtensions.HasCharSet(modelBuilder, "utf8mb4");
            MySqlModelBuilderExtensions.AutoIncrementColumns(modelBuilder);

            modelBuilder.Entity("Olympus.Models.__efmigrationshistory", b =>
                {
                    b.Property<string>("MigrationId")
                        .HasMaxLength(150)
                        .HasColumnType("varchar(150)");

                    b.Property<string>("ProductVersion")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("varchar(32)");

                    b.HasKey("MigrationId")
                        .HasName("PRIMARY");

                    b.ToTable("__efmigrationshistory", (string)null);
                });

            modelBuilder.Entity("Olympus.Models.aspnetrole", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("ConcurrencyStamp")
                        .HasColumnType("longtext");

                    b.Property<string>("Name")
                        .HasMaxLength(256)
                        .HasColumnType("varchar(256)");

                    b.Property<string>("NormalizedName")
                        .HasMaxLength(256)
                        .HasColumnType("varchar(256)");

                    b.HasKey("Id")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "NormalizedName" }, "RoleNameIndex")
                        .IsUnique();

                    b.ToTable("aspnetroles");
                });

            modelBuilder.Entity("Olympus.Models.aspnetroleclaim", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int(11)");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("longtext");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("longtext");

                    b.Property<string>("RoleId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "RoleId" }, "IX_AspNetRoleClaims_RoleId");

                    b.ToTable("aspnetroleclaims");
                });

            modelBuilder.Entity("Olympus.Models.aspnetuser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("varchar(255)");

                    b.Property<int>("AccessFailedCount")
                        .HasColumnType("int(11)");

                    b.Property<string>("ConcurrencyStamp")
                        .HasColumnType("longtext");

                    b.Property<string>("Email")
                        .HasMaxLength(256)
                        .HasColumnType("varchar(256)");

                    b.Property<bool>("EmailConfirmed")
                        .HasColumnType("tinyint(1)");

                    b.Property<bool>("LockoutEnabled")
                        .HasColumnType("tinyint(1)");

                    b.Property<DateTime?>("LockoutEnd")
                        .HasMaxLength(6)
                        .HasColumnType("datetime(6)");

                    b.Property<string>("NormalizedEmail")
                        .HasMaxLength(256)
                        .HasColumnType("varchar(256)");

                    b.Property<string>("NormalizedUserName")
                        .HasMaxLength(256)
                        .HasColumnType("varchar(256)");

                    b.Property<string>("PasswordHash")
                        .HasColumnType("longtext");

                    b.Property<string>("PhoneNumber")
                        .HasColumnType("longtext");

                    b.Property<bool>("PhoneNumberConfirmed")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("SecurityStamp")
                        .HasColumnType("longtext");

                    b.Property<bool>("TwoFactorEnabled")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("UserName")
                        .HasMaxLength(256)
                        .HasColumnType("varchar(256)");

                    b.HasKey("Id")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "NormalizedEmail" }, "EmailIndex");

                    b.HasIndex(new[] { "NormalizedUserName" }, "UserNameIndex")
                        .IsUnique();

                    b.ToTable("aspnetusers");
                });

            modelBuilder.Entity("Olympus.Models.aspnetuserclaim", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int(11)");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ClaimType")
                        .HasColumnType("longtext");

                    b.Property<string>("ClaimValue")
                        .HasColumnType("longtext");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "UserId" }, "IX_AspNetUserClaims_UserId");

                    b.ToTable("aspnetuserclaims");
                });

            modelBuilder.Entity("Olympus.Models.aspnetuserlogin", b =>
                {
                    b.Property<string>("LoginProvider")
                        .HasMaxLength(128)
                        .HasColumnType("varchar(128)");

                    b.Property<string>("ProviderKey")
                        .HasMaxLength(128)
                        .HasColumnType("varchar(128)");

                    b.Property<string>("ProviderDisplayName")
                        .HasColumnType("longtext");

                    b.Property<string>("UserId")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("LoginProvider", "ProviderKey")
                        .HasName("PRIMARY")
                        .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                    b.HasIndex(new[] { "UserId" }, "IX_AspNetUserLogins_UserId");

                    b.ToTable("aspnetuserlogins");
                });

            modelBuilder.Entity("Olympus.Models.aspnetusertoken", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("LoginProvider")
                        .HasMaxLength(128)
                        .HasColumnType("varchar(128)");

                    b.Property<string>("Name")
                        .HasMaxLength(128)
                        .HasColumnType("varchar(128)");

                    b.Property<string>("Value")
                        .HasColumnType("longtext");

                    b.HasKey("UserId", "LoginProvider", "Name")
                        .HasName("PRIMARY")
                        .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0, 0 });

                    b.ToTable("aspnetusertokens");
                });

            modelBuilder.Entity("Olympus.Models.catalog", b =>
                {
                    b.Property<decimal>("year")
                        .HasPrecision(4)
                        .HasColumnType("decimal(4)");

                    b.HasKey("year")
                        .HasName("PRIMARY");

                    b.ToTable("catalog", (string)null);
                });

            modelBuilder.Entity("Olympus.Models.concentration", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int(11)");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("id"));

                    b.Property<int>("major_id")
                        .HasColumnType("int(11)");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("varchar(32)");

                    b.HasKey("id")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "major_id" }, "major_id");

                    b.ToTable("concentration", (string)null);
                });

            modelBuilder.Entity("Olympus.Models.concentrationcourse", b =>
                {
                    b.Property<string>("course_id")
                        .HasMaxLength(9)
                        .HasColumnType("varchar(9)");

                    b.Property<int>("concentration_id")
                        .HasColumnType("int(11)");

                    b.Property<string>("type")
                        .IsRequired()
                        .HasMaxLength(9)
                        .HasColumnType("varchar(9)");

                    b.HasKey("course_id", "concentration_id")
                        .HasName("PRIMARY")
                        .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                    b.HasIndex(new[] { "concentration_id" }, "concentration_id");

                    b.ToTable("concentrationcourse", (string)null);
                });

            modelBuilder.Entity("Olympus.Models.course", b =>
                {
                    b.Property<string>("id")
                        .HasMaxLength(9)
                        .HasColumnType("varchar(9)");

                    b.Property<string>("credits")
                        .IsRequired()
                        .HasMaxLength(9)
                        .HasColumnType("varchar(9)");

                    b.Property<string>("description")
                        .IsRequired()
                        .HasMaxLength(512)
                        .HasColumnType("varchar(512)");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("varchar(64)");

                    b.HasKey("id")
                        .HasName("PRIMARY");

                    b.ToTable("course", (string)null);
                });

            modelBuilder.Entity("Olympus.Models.gened", b =>
                {
                    b.Property<string>("course_id")
                        .HasMaxLength(9)
                        .HasColumnType("varchar(9)");

                    b.Property<decimal>("catalog_year")
                        .HasPrecision(4)
                        .HasColumnType("decimal(4)");

                    b.Property<string>("type")
                        .IsRequired()
                        .HasMaxLength(9)
                        .HasColumnType("varchar(9)");

                    b.HasKey("course_id", "catalog_year")
                        .HasName("PRIMARY")
                        .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                    b.HasIndex(new[] { "catalog_year" }, "catalog_year");

                    b.ToTable("gened", (string)null);
                });

            modelBuilder.Entity("Olympus.Models.major", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int(11)");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("id"));

                    b.Property<decimal>("catalog_year")
                        .HasPrecision(4)
                        .HasColumnType("decimal(4)");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("varchar(32)");

                    b.HasKey("id")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "catalog_year" }, "catalog_year")
                        .HasDatabaseName("catalog_year1");

                    b.ToTable("major", (string)null);
                });

            modelBuilder.Entity("Olympus.Models.majorcourse", b =>
                {
                    b.Property<string>("course_id")
                        .HasMaxLength(9)
                        .HasColumnType("varchar(9)");

                    b.Property<int>("major_id")
                        .HasColumnType("int(11)");

                    b.Property<string>("type")
                        .IsRequired()
                        .HasMaxLength(9)
                        .HasColumnType("varchar(9)");

                    b.HasKey("course_id", "major_id")
                        .HasName("PRIMARY")
                        .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                    b.HasIndex(new[] { "major_id" }, "major_id")
                        .HasDatabaseName("major_id1");

                    b.ToTable("majorcourse", (string)null);
                });

            modelBuilder.Entity("Olympus.Models.minor", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int(11)");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("id"));

                    b.Property<decimal>("catalog_year")
                        .HasPrecision(4)
                        .HasColumnType("decimal(4)");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("varchar(32)");

                    b.HasKey("id")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "catalog_year" }, "catalog_year")
                        .HasDatabaseName("catalog_year2");

                    b.ToTable("minor", (string)null);
                });

            modelBuilder.Entity("Olympus.Models.minorcourse", b =>
                {
                    b.Property<string>("course_id")
                        .HasMaxLength(9)
                        .HasColumnType("varchar(9)");

                    b.Property<int>("minor_id")
                        .HasColumnType("int(11)");

                    b.Property<string>("type")
                        .IsRequired()
                        .HasMaxLength(9)
                        .HasColumnType("varchar(9)");

                    b.HasKey("course_id", "minor_id")
                        .HasName("PRIMARY")
                        .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                    b.HasIndex(new[] { "minor_id" }, "minor_id");

                    b.ToTable("minorcourse", (string)null);
                });

            modelBuilder.Entity("Olympus.Models.plan", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int(11)");

                    MySqlPropertyBuilderExtensions.UseMySqlIdentityColumn(b.Property<int>("id"));

                    b.Property<decimal>("catalog_year")
                        .HasPrecision(4)
                        .HasColumnType("decimal(4)");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasMaxLength(32)
                        .HasColumnType("varchar(32)");

                    b.Property<string>("user_id")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("id")
                        .HasName("PRIMARY");

                    b.HasIndex(new[] { "catalog_year" }, "catalog_year")
                        .HasDatabaseName("catalog_year3");

                    b.HasIndex(new[] { "user_id" }, "user_id");

                    b.ToTable("plan", (string)null);
                });

            modelBuilder.Entity("Olympus.Models.plannedcourse", b =>
                {
                    b.Property<int>("plan_id")
                        .HasColumnType("int(11)");

                    b.Property<string>("course_id")
                        .HasMaxLength(9)
                        .HasColumnType("varchar(9)");

                    b.Property<decimal>("year")
                        .HasPrecision(4)
                        .HasColumnType("decimal(4)");

                    b.Property<string>("term")
                        .HasMaxLength(6)
                        .HasColumnType("varchar(6)");

                    b.HasKey("plan_id", "course_id", "year", "term")
                        .HasName("PRIMARY")
                        .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0, 0, 0 });

                    b.HasIndex(new[] { "course_id" }, "course_id");

                    b.ToTable("plannedcourse", (string)null);
                });

            modelBuilder.Entity("Olympus.Models.user", b =>
                {
                    b.Property<string>("id")
                        .HasColumnType("varchar(255)");

                    b.Property<int>("default_plan_id")
                        .HasColumnType("int(11)");

                    b.Property<decimal>("gpa")
                        .HasPrecision(3, 2)
                        .HasColumnType("decimal(3,2)");

                    b.Property<decimal>("major_gpa")
                        .HasPrecision(3, 2)
                        .HasColumnType("decimal(3,2)");

                    b.Property<string>("name")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("varchar(64)");

                    b.HasKey("id")
                        .HasName("PRIMARY");

                    b.ToTable("user", (string)null);
                });

            modelBuilder.Entity("advisee", b =>
                {
                    b.Property<string>("advisor_id")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("advisee_id")
                        .HasColumnType("varchar(255)");

                    b.HasKey("advisor_id", "advisee_id")
                        .HasName("PRIMARY")
                        .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                    b.HasIndex(new[] { "advisee_id" }, "advisee_id");

                    b.ToTable("advisee", (string)null);
                });

            modelBuilder.Entity("aspnetuserrole", b =>
                {
                    b.Property<string>("UserId")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("RoleId")
                        .HasColumnType("varchar(255)");

                    b.HasKey("UserId", "RoleId")
                        .HasName("PRIMARY")
                        .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                    b.HasIndex(new[] { "RoleId" }, "IX_AspNetUserRoles_RoleId");

                    b.ToTable("aspnetuserroles", (string)null);
                });

            modelBuilder.Entity("catalogcourse", b =>
                {
                    b.Property<string>("course_id")
                        .HasMaxLength(9)
                        .HasColumnType("varchar(9)");

                    b.Property<decimal>("catalog_year")
                        .HasPrecision(4)
                        .HasColumnType("decimal(4)");

                    b.HasKey("course_id", "catalog_year")
                        .HasName("PRIMARY")
                        .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                    b.HasIndex(new[] { "catalog_year" }, "catalog_year")
                        .HasDatabaseName("catalog_year4");

                    b.ToTable("catalogcourse", (string)null);
                });

            modelBuilder.Entity("plannedconcentration", b =>
                {
                    b.Property<int>("concentration_id")
                        .HasColumnType("int(11)");

                    b.Property<int>("plan_id")
                        .HasColumnType("int(11)");

                    b.HasKey("concentration_id", "plan_id")
                        .HasName("PRIMARY")
                        .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                    b.HasIndex(new[] { "plan_id" }, "plan_id");

                    b.ToTable("plannedconcentration", (string)null);
                });

            modelBuilder.Entity("plannedmajor", b =>
                {
                    b.Property<int>("major_id")
                        .HasColumnType("int(11)");

                    b.Property<int>("plan_id")
                        .HasColumnType("int(11)");

                    b.HasKey("major_id", "plan_id")
                        .HasName("PRIMARY")
                        .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                    b.HasIndex(new[] { "plan_id" }, "plan_id")
                        .HasDatabaseName("plan_id1");

                    b.ToTable("plannedmajor", (string)null);
                });

            modelBuilder.Entity("plannedminor", b =>
                {
                    b.Property<int>("minor_id")
                        .HasColumnType("int(11)");

                    b.Property<int>("plan_id")
                        .HasColumnType("int(11)");

                    b.HasKey("minor_id", "plan_id")
                        .HasName("PRIMARY")
                        .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                    b.HasIndex(new[] { "plan_id" }, "plan_id")
                        .HasDatabaseName("plan_id2");

                    b.ToTable("plannedminor", (string)null);
                });

            modelBuilder.Entity("prereq", b =>
                {
                    b.Property<string>("course_id")
                        .HasMaxLength(9)
                        .HasColumnType("varchar(9)");

                    b.Property<string>("prereq_id")
                        .HasMaxLength(9)
                        .HasColumnType("varchar(9)");

                    b.HasKey("course_id", "prereq_id")
                        .HasName("PRIMARY")
                        .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

                    b.HasIndex(new[] { "prereq_id" }, "prereq_id");

                    b.ToTable("prereq", (string)null);
                });

            modelBuilder.Entity("Olympus.Models.aspnetroleclaim", b =>
                {
                    b.HasOne("Olympus.Models.aspnetrole", "Role")
                        .WithMany("aspnetroleclaims")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("FK_AspNetRoleClaims_AspNetRoles_RoleId");

                    b.Navigation("Role");
                });

            modelBuilder.Entity("Olympus.Models.aspnetuserclaim", b =>
                {
                    b.HasOne("Olympus.Models.aspnetuser", "User")
                        .WithMany("aspnetuserclaims")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("FK_AspNetUserClaims_AspNetUsers_UserId");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Olympus.Models.aspnetuserlogin", b =>
                {
                    b.HasOne("Olympus.Models.aspnetuser", "User")
                        .WithMany("aspnetuserlogins")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("FK_AspNetUserLogins_AspNetUsers_UserId");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Olympus.Models.aspnetusertoken", b =>
                {
                    b.HasOne("Olympus.Models.aspnetuser", "User")
                        .WithMany("aspnetusertokens")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("FK_AspNetUserTokens_AspNetUsers_UserId");

                    b.Navigation("User");
                });

            modelBuilder.Entity("Olympus.Models.concentration", b =>
                {
                    b.HasOne("Olympus.Models.major", "major")
                        .WithMany("concentrations")
                        .HasForeignKey("major_id")
                        .IsRequired()
                        .HasConstraintName("concentration_ibfk_1");

                    b.Navigation("major");
                });

            modelBuilder.Entity("Olympus.Models.concentrationcourse", b =>
                {
                    b.HasOne("Olympus.Models.concentration", "concentration")
                        .WithMany("concentrationcourses")
                        .HasForeignKey("concentration_id")
                        .IsRequired()
                        .HasConstraintName("concentrationcourse_ibfk_1");

                    b.HasOne("Olympus.Models.course", "course")
                        .WithMany("concentrationcourses")
                        .HasForeignKey("course_id")
                        .IsRequired()
                        .HasConstraintName("concentrationcourse_ibfk_2");

                    b.Navigation("concentration");

                    b.Navigation("course");
                });

            modelBuilder.Entity("Olympus.Models.gened", b =>
                {
                    b.HasOne("Olympus.Models.catalog", "catalog_yearNavigation")
                        .WithMany("geneds")
                        .HasForeignKey("catalog_year")
                        .IsRequired()
                        .HasConstraintName("gened_ibfk_1");

                    b.HasOne("Olympus.Models.course", "course")
                        .WithMany("geneds")
                        .HasForeignKey("course_id")
                        .IsRequired()
                        .HasConstraintName("gened_ibfk_2");

                    b.Navigation("catalog_yearNavigation");

                    b.Navigation("course");
                });

            modelBuilder.Entity("Olympus.Models.major", b =>
                {
                    b.HasOne("Olympus.Models.catalog", "catalog_yearNavigation")
                        .WithMany("majors")
                        .HasForeignKey("catalog_year")
                        .IsRequired()
                        .HasConstraintName("major_ibfk_1");

                    b.Navigation("catalog_yearNavigation");
                });

            modelBuilder.Entity("Olympus.Models.majorcourse", b =>
                {
                    b.HasOne("Olympus.Models.course", "course")
                        .WithMany("majorcourses")
                        .HasForeignKey("course_id")
                        .IsRequired()
                        .HasConstraintName("majorcourse_ibfk_1");

                    b.HasOne("Olympus.Models.major", "major")
                        .WithMany("majorcourses")
                        .HasForeignKey("major_id")
                        .IsRequired()
                        .HasConstraintName("majorcourse_ibfk_2");

                    b.Navigation("course");

                    b.Navigation("major");
                });

            modelBuilder.Entity("Olympus.Models.minor", b =>
                {
                    b.HasOne("Olympus.Models.catalog", "catalog_yearNavigation")
                        .WithMany("minors")
                        .HasForeignKey("catalog_year")
                        .IsRequired()
                        .HasConstraintName("minor_ibfk_1");

                    b.Navigation("catalog_yearNavigation");
                });

            modelBuilder.Entity("Olympus.Models.minorcourse", b =>
                {
                    b.HasOne("Olympus.Models.course", "course")
                        .WithMany("minorcourses")
                        .HasForeignKey("course_id")
                        .IsRequired()
                        .HasConstraintName("minorcourse_ibfk_2");

                    b.HasOne("Olympus.Models.minor", "minor")
                        .WithMany("minorcourses")
                        .HasForeignKey("minor_id")
                        .IsRequired()
                        .HasConstraintName("minorcourse_ibfk_1");

                    b.Navigation("course");

                    b.Navigation("minor");
                });

            modelBuilder.Entity("Olympus.Models.plan", b =>
                {
                    b.HasOne("Olympus.Models.catalog", "catalog_yearNavigation")
                        .WithMany("plans")
                        .HasForeignKey("catalog_year")
                        .IsRequired()
                        .HasConstraintName("plan_ibfk_2");

                    b.HasOne("Olympus.Models.user", "user")
                        .WithMany("plans")
                        .HasForeignKey("user_id")
                        .IsRequired()
                        .HasConstraintName("plan_ibfk_1");

                    b.Navigation("catalog_yearNavigation");

                    b.Navigation("user");
                });

            modelBuilder.Entity("Olympus.Models.plannedcourse", b =>
                {
                    b.HasOne("Olympus.Models.course", "course")
                        .WithMany("plannedcourses")
                        .HasForeignKey("course_id")
                        .IsRequired()
                        .HasConstraintName("plannedcourse_ibfk_1");

                    b.HasOne("Olympus.Models.plan", "plan")
                        .WithMany("plannedcourses")
                        .HasForeignKey("plan_id")
                        .IsRequired()
                        .HasConstraintName("plannedcourse_ibfk_2");

                    b.Navigation("course");

                    b.Navigation("plan");
                });

            modelBuilder.Entity("Olympus.Models.user", b =>
                {
                    b.HasOne("Olympus.Models.aspnetuser", "idNavigation")
                        .WithOne("user")
                        .HasForeignKey("Olympus.Models.user", "id")
                        .IsRequired()
                        .HasConstraintName("user_ibfk_1");

                    b.Navigation("idNavigation");
                });

            modelBuilder.Entity("advisee", b =>
                {
                    b.HasOne("Olympus.Models.aspnetuser", null)
                        .WithMany()
                        .HasForeignKey("advisee_id")
                        .IsRequired()
                        .HasConstraintName("advisee_ibfk_2");

                    b.HasOne("Olympus.Models.aspnetuser", null)
                        .WithMany()
                        .HasForeignKey("advisor_id")
                        .IsRequired()
                        .HasConstraintName("advisee_ibfk_1");
                });

            modelBuilder.Entity("aspnetuserrole", b =>
                {
                    b.HasOne("Olympus.Models.aspnetrole", null)
                        .WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("FK_AspNetUserRoles_AspNetRoles_RoleId");

                    b.HasOne("Olympus.Models.aspnetuser", null)
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired()
                        .HasConstraintName("FK_AspNetUserRoles_AspNetUsers_UserId");
                });

            modelBuilder.Entity("catalogcourse", b =>
                {
                    b.HasOne("Olympus.Models.catalog", null)
                        .WithMany()
                        .HasForeignKey("catalog_year")
                        .IsRequired()
                        .HasConstraintName("catalogcourse_ibfk_1");

                    b.HasOne("Olympus.Models.course", null)
                        .WithMany()
                        .HasForeignKey("course_id")
                        .IsRequired()
                        .HasConstraintName("catalogcourse_ibfk_2");
                });

            modelBuilder.Entity("plannedconcentration", b =>
                {
                    b.HasOne("Olympus.Models.concentration", null)
                        .WithMany()
                        .HasForeignKey("concentration_id")
                        .IsRequired()
                        .HasConstraintName("plannedconcentration_ibfk_1");

                    b.HasOne("Olympus.Models.plan", null)
                        .WithMany()
                        .HasForeignKey("plan_id")
                        .IsRequired()
                        .HasConstraintName("plannedconcentration_ibfk_2");
                });

            modelBuilder.Entity("plannedmajor", b =>
                {
                    b.HasOne("Olympus.Models.major", null)
                        .WithMany()
                        .HasForeignKey("major_id")
                        .IsRequired()
                        .HasConstraintName("plannedmajor_ibfk_1");

                    b.HasOne("Olympus.Models.plan", null)
                        .WithMany()
                        .HasForeignKey("plan_id")
                        .IsRequired()
                        .HasConstraintName("plannedmajor_ibfk_2");
                });

            modelBuilder.Entity("plannedminor", b =>
                {
                    b.HasOne("Olympus.Models.minor", null)
                        .WithMany()
                        .HasForeignKey("minor_id")
                        .IsRequired()
                        .HasConstraintName("plannedminor_ibfk_1");

                    b.HasOne("Olympus.Models.plan", null)
                        .WithMany()
                        .HasForeignKey("plan_id")
                        .IsRequired()
                        .HasConstraintName("plannedminor_ibfk_2");
                });

            modelBuilder.Entity("prereq", b =>
                {
                    b.HasOne("Olympus.Models.course", null)
                        .WithMany()
                        .HasForeignKey("course_id")
                        .IsRequired()
                        .HasConstraintName("prereq_ibfk_1");

                    b.HasOne("Olympus.Models.course", null)
                        .WithMany()
                        .HasForeignKey("prereq_id")
                        .IsRequired()
                        .HasConstraintName("prereq_ibfk_2");
                });

            modelBuilder.Entity("Olympus.Models.aspnetrole", b =>
                {
                    b.Navigation("aspnetroleclaims");
                });

            modelBuilder.Entity("Olympus.Models.aspnetuser", b =>
                {
                    b.Navigation("aspnetuserclaims");

                    b.Navigation("aspnetuserlogins");

                    b.Navigation("aspnetusertokens");

                    b.Navigation("user");
                });

            modelBuilder.Entity("Olympus.Models.catalog", b =>
                {
                    b.Navigation("geneds");

                    b.Navigation("majors");

                    b.Navigation("minors");

                    b.Navigation("plans");
                });

            modelBuilder.Entity("Olympus.Models.concentration", b =>
                {
                    b.Navigation("concentrationcourses");
                });

            modelBuilder.Entity("Olympus.Models.course", b =>
                {
                    b.Navigation("concentrationcourses");

                    b.Navigation("geneds");

                    b.Navigation("majorcourses");

                    b.Navigation("minorcourses");

                    b.Navigation("plannedcourses");
                });

            modelBuilder.Entity("Olympus.Models.major", b =>
                {
                    b.Navigation("concentrations");

                    b.Navigation("majorcourses");
                });

            modelBuilder.Entity("Olympus.Models.minor", b =>
                {
                    b.Navigation("minorcourses");
                });

            modelBuilder.Entity("Olympus.Models.plan", b =>
                {
                    b.Navigation("plannedcourses");
                });

            modelBuilder.Entity("Olympus.Models.user", b =>
                {
                    b.Navigation("plans");
                });
#pragma warning restore 612, 618
        }
    }
}