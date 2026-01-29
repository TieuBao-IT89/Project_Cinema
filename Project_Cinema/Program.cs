using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Project_Cinema.Models;
using Project_Cinema.Repository;

var builder = WebApplication.CreateBuilder(args);

// Connection db
builder.Services.AddDbContext<DataContext>(options =>
{
    // Use a conservative SQL Server compatibility level to avoid OPENJSON issues
    // on older SQL Server / lower database compatibility settings.
    options.UseSqlServer(
        builder.Configuration["ConnectionStrings:ConnectedDb"],
        sqlOptions => sqlOptions.UseCompatibilityLevel(120));
});

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddScoped<IPasswordHasher<UserModel>, PasswordHasher<UserModel>>();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/Login";
        options.Cookie.Name = "CinemaAuth";
    });

var app = builder.Build();

// Seed sample data for quick UI testing
await SeedData.EnsureSeededAsync(app.Services);

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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "areas",
    pattern: "{area:exists}/{controller=Dashboard}/{action=Index}/{id?}");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
