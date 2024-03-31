using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Olympus.Areas.Identity.Data;
using Olympus.Data;
var builder = WebApplication.CreateBuilder(args);
var connectionString = builder.Configuration.GetConnectionString("OlympusContextConnection") ?? throw new InvalidOperationException("Connection string 'OlympusContextConnection' not found.");

builder.Services.AddDbContext<OlympusContext>(options => options.UseMySql(connectionString, new MySqlServerVersion(new Version(10,4,32))));

builder.Services.AddDefaultIdentity<OlympusUser>(options => options.SignIn.RequireConfirmedAccount = true).AddEntityFrameworkStores<OlympusContext>();

// Add services to the container.
builder.Services.AddControllersWithViews();

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

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapRazorPages();

app.Run();
