using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Cinema.Models;
using Project_Cinema.Repository;
using Project_Cinema.ViewModels;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Project_Cinema.Controllers
{
    public class AccountController : Controller
    {
        private readonly DataContext _dataContext;
        private readonly IPasswordHasher<UserModel> _passwordHasher;

        public AccountController(DataContext dataContext, IPasswordHasher<UserModel> passwordHasher)
        {
            _dataContext = dataContext;
            _passwordHasher = passwordHasher;
        }

        [HttpGet]
        public IActionResult Login(string? returnUrl = null, bool registered = false)
        {
            ViewData["ReturnUrl"] = returnUrl;
            ViewData["Registered"] = registered;
            ViewData["BodyClass"] = "login-page";
            return View(new LoginViewModel());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Login(LoginViewModel model, string? returnUrl = null)
        {
            ViewData["ReturnUrl"] = returnUrl;
            ViewData["BodyClass"] = "login-page";

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var user = await _dataContext.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == model.Identifier || u.Phone == model.Identifier);

            if (user == null)
            {
                ModelState.AddModelError(string.Empty, "Email/số điện thoại hoặc mật khẩu không chính xác");
                return View(model);
            }

            var verifyResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash ?? string.Empty, model.Password);
            if (verifyResult == PasswordVerificationResult.Failed)
            {
                ModelState.AddModelError(string.Empty, "Email/số điện thoại hoặc mật khẩu không chính xác");
                return View(model);
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Role, user.Role ?? "customer")
            };

            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = new AuthenticationProperties
            {
                IsPersistent = model.RememberMe
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);

            if (!string.IsNullOrWhiteSpace(returnUrl) && Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }

            return RedirectToAction("Index", "Home");
        }

        [HttpGet]
        public IActionResult Register()
        {
            ViewData["BodyClass"] = "login-page";
            return View(new RegisterViewModel());
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            ViewData["BodyClass"] = "login-page";
            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var exists = await _dataContext.Users
                .AnyAsync(u => u.Email == model.Email || u.Phone == model.Phone);

            if (exists)
            {
                ModelState.AddModelError(string.Empty, "Email hoặc số điện thoại đã được sử dụng");
                return View(model);
            }

            var user = new UserModel
            {
                FullName = model.FullName,
                Email = model.Email,
                Phone = model.Phone,
                Role = "customer",
                Status = "active",
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, model.Password);

            _dataContext.Users.Add(user);
            await _dataContext.SaveChangesAsync();

            return RedirectToAction("Login", new { registered = true });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction("Index", "Home");
        }
    }
}
