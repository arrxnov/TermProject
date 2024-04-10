using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.EntityFrameworkCore;
using Olympus.Areas.Identity.Data;
using Olympus.Data;
using Olympus.Models;
var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("OlympusContextConnection") ?? throw new InvalidOperationException("Connection string 'OlympusContextConnection' not found.");

builder.Services.AddDbContext<OlympusContext>(options => options.UseMySql(connectionString, new MySqlServerVersion(new Version(10,4,32))));
builder.Services.AddDbContext<zeusContext>(options => options.UseMySql(connectionString, new MySqlServerVersion(new Version(10, 4, 32))));

builder.Services.AddIdentity<OlympusUser, IdentityRole>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddDefaultUI()
    .AddEntityFrameworkStores<OlympusContext>()
    .AddDefaultTokenProviders();

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();
builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromSeconds(10);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();
app.UseSession();
//app.MapControllerRoute(
//    name: "student",
//    pattern: "Student/Index/{id}",
//    defaults: new { controller = "Student", action = "Index" });
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();
app.Run();
