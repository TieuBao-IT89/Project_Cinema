using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Project_Cinema.Models;
using Project_Cinema.Repository;
using Project_Cinema.Services.Email;
using Project_Cinema.Services.Security;
using Project_Cinema.ViewModels;
using System;
using System.Text;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Project_Cinema.Controllers
{
    public class AccountController : Controller
    {
        private readonly DataContext _dataContext;
        private readonly IPasswordHasher<UserModel> _passwordHasher;
        private readonly IEmailQueue _emailQueue;
        private readonly ILogger<AccountController> _logger;
        private readonly IDataProtector _resetProtector;
        private readonly PasswordResetRateLimiter _rateLimiter;

        public AccountController(
            DataContext dataContext,
            IPasswordHasher<UserModel> passwordHasher,
            IEmailQueue emailQueue,
            ILogger<AccountController> logger,
            IDataProtectionProvider dataProtectionProvider,
            PasswordResetRateLimiter rateLimiter)
        {
            _dataContext = dataContext;
            _passwordHasher = passwordHasher;
            _emailQueue = emailQueue;
            _logger = logger;
            _resetProtector = dataProtectionProvider.CreateProtector("Project_Cinema.PasswordReset.v1");
            _rateLimiter = rateLimiter;
        }

        [HttpGet]
        public IActionResult Login(string? returnUrl = null, bool registered = false, bool reset = false)
        {
            ViewData["ReturnUrl"] = returnUrl;
            ViewData["Registered"] = registered;
            ViewData["Reset"] = reset;
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

        [HttpGet]
        public IActionResult ForgotPassword()
        {
            ViewData["BodyClass"] = "login-page";
            var model = new ForgotPasswordViewModel
            {
                Identifier = TempData["ForgotPasswordIdentifier"] as string ?? ""
            };
            ViewData["CooldownSeconds"] = TempData["ForgotPasswordCooldownSeconds"];
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            ViewData["BodyClass"] = "login-page";

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            // Always show the same message (avoid user enumeration)
            TempData["ForgotPasswordSent"] = true;
            TempData["ForgotPasswordIdentifier"] = (model.Identifier ?? "").Trim();

            var identifier = (model.Identifier ?? "").Trim();
            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";

            var rate = _rateLimiter.Check(identifier, ip);
            if (!rate.IsAllowed)
            {
                TempData["ForgotPasswordCooldownSeconds"] = rate.RetryAfterSeconds;
                _logger.LogWarning("ForgotPassword rate-limited. ip={Ip}, identifier={Identifier}, retryAfter={RetryAfter}s", ip, identifier, rate.RetryAfterSeconds);
                return RedirectToAction(nameof(ForgotPassword));
            }

            var user = await _dataContext.Users.AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == identifier || u.Phone == identifier);

            if (user == null)
            {
                _logger.LogInformation("ForgotPassword requested for non-existing identifier: {Identifier}", identifier);
                return RedirectToAction(nameof(ForgotPassword));
            }

            if (string.IsNullOrWhiteSpace(user.Email))
            {
                _logger.LogWarning("ForgotPassword: user has no email. userId={UserId}", user.UserId);
                return RedirectToAction(nameof(ForgotPassword));
            }

            var token = CreateResetToken(user, TimeSpan.FromMinutes(30));
            var url = Url.Action(nameof(ResetPassword), "Account", new { uid = user.UserId, token }, protocol: Request.Scheme) ?? "";

            try
            {
                var ua = Request.Headers.UserAgent.ToString();
                await _emailQueue.QueueAsync(ResetPasswordEmailTemplate.Build(user.Email, user.FullName, url, ttlMinutes: 30, ip: ip, userAgent: ua));
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "ForgotPassword: failed to queue reset email. userId={UserId}", user.UserId);
            }

            return RedirectToAction(nameof(ForgotPassword));
        }

        [HttpGet]
        public async Task<IActionResult> ResetPassword(long uid, string token)
        {
            ViewData["BodyClass"] = "login-page";

            var (ok, error) = await ValidateResetTokenAsync(uid, token);
            if (!ok)
            {
                ModelState.AddModelError(string.Empty, error ?? "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
            }

            return View(new ResetPasswordViewModel
            {
                UserId = uid,
                Token = token
            });
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            ViewData["BodyClass"] = "login-page";

            if (!ModelState.IsValid)
            {
                return View(model);
            }

            var (ok, error) = await ValidateResetTokenAsync(model.UserId, model.Token);
            if (!ok)
            {
                ModelState.AddModelError(string.Empty, error ?? "Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.");
                return View(model);
            }

            var user = await _dataContext.Users.FirstOrDefaultAsync(u => u.UserId == model.UserId);
            if (user == null)
            {
                ModelState.AddModelError(string.Empty, "Tài khoản không tồn tại.");
                return View(model);
            }

            user.PasswordHash = _passwordHasher.HashPassword(user, model.Password);
            user.UpdatedAt = DateTime.Now;
            await _dataContext.SaveChangesAsync();

            return RedirectToAction(nameof(Login), new { reset = true });
        }

        private string CreateResetToken(UserModel user, TimeSpan ttl)
        {
            var expiresUtcTicks = DateTime.UtcNow.Add(ttl).Ticks;
            var pwdHash = user.PasswordHash ?? string.Empty;
            var pwdHashB64 = Convert.ToBase64String(Encoding.UTF8.GetBytes(pwdHash));
            var payload = $"{user.UserId}|{expiresUtcTicks}|{pwdHashB64}";
            return _resetProtector.Protect(payload);
        }

        private async Task<(bool ok, string? error)> ValidateResetTokenAsync(long uid, string token)
        {
            if (uid <= 0 || string.IsNullOrWhiteSpace(token))
            {
                return (false, "Link đặt lại mật khẩu không hợp lệ.");
            }

            string payload;
            try
            {
                payload = _resetProtector.Unprotect(token);
            }
            catch
            {
                return (false, "Link đặt lại mật khẩu không hợp lệ.");
            }

            var parts = payload.Split('|');
            if (parts.Length != 3)
            {
                return (false, "Link đặt lại mật khẩu không hợp lệ.");
            }

            if (!long.TryParse(parts[0], out var tokenUid) || tokenUid != uid)
            {
                return (false, "Link đặt lại mật khẩu không hợp lệ.");
            }

            if (!long.TryParse(parts[1], out var expiresUtcTicks))
            {
                return (false, "Link đặt lại mật khẩu không hợp lệ.");
            }

            var expiresUtc = new DateTime(expiresUtcTicks, DateTimeKind.Utc);
            if (DateTime.UtcNow > expiresUtc)
            {
                return (false, "Link đặt lại mật khẩu đã hết hạn. Vui lòng yêu cầu lại.");
            }

            var user = await _dataContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == uid);
            if (user == null)
            {
                return (false, "Tài khoản không tồn tại.");
            }

            var tokenPwdHash = Encoding.UTF8.GetString(Convert.FromBase64String(parts[2]));
            var currentPwdHash = user.PasswordHash ?? string.Empty;
            if (!string.Equals(tokenPwdHash, currentPwdHash, StringComparison.Ordinal))
            {
                return (false, "Link đặt lại mật khẩu đã được sử dụng hoặc không còn hợp lệ.");
            }

            return (true, null);
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Profile(string? tab = null, string? status = null)
        {
            await BookingMaintenance.ExpireHoldsAsync(_dataContext);

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdClaim, out var userId))
            {
                return Forbid();
            }

            var user = await _dataContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
            {
                return NotFound();
            }

            var bookingCounts = await _dataContext.Bookings.AsNoTracking()
                .Where(b => b.UserId == userId)
                .GroupBy(b => b.Status ?? "")
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .ToListAsync();

            var paidBookingsCount = bookingCounts.FirstOrDefault(x => x.Status == "paid")?.Count ?? 0;
            var expiredBookingsCount = bookingCounts.FirstOrDefault(x => x.Status == "expired")?.Count ?? 0;
            var cancelledBookingsCount = bookingCounts.FirstOrDefault(x => x.Status == "cancelled")?.Count ?? 0;

            var safeStatus = (status ?? "").Trim().ToLowerInvariant();
            if (safeStatus is not ("paid" or "expired" or "cancelled" or "all"))
            {
                safeStatus = "all";
            }

            var safeTab = (tab ?? "").Trim().ToLowerInvariant();
            if (safeTab is not ("personal-info" or "booking-history" or "security" or "notifications" or "settings"))
            {
                safeTab = "personal-info";
            }
            // If user is filtering tickets, jump to booking history tab
            if (!string.IsNullOrWhiteSpace(status) && safeTab == "personal-info")
            {
                safeTab = "booking-history";
            }

            var bookingsQuery = _dataContext.Bookings.AsNoTracking()
                .Where(b => b.UserId == userId && (b.Status == "paid" || b.Status == "expired" || b.Status == "cancelled"));

            if (safeStatus != "all")
            {
                bookingsQuery = bookingsQuery.Where(b => b.Status == safeStatus);
            }

            var bookings = await (from b in bookingsQuery
                                  join s in _dataContext.Showtimes.AsNoTracking() on b.ShowtimeId equals s.ShowtimeId
                                  join m in _dataContext.Movies.AsNoTracking() on s.MovieId equals m.MovieId
                                  join r in _dataContext.Rooms.AsNoTracking() on s.RoomId equals r.RoomId
                                  join c in _dataContext.Cinemas.AsNoTracking() on r.CinemaId equals c.CinemaId
                                  orderby b.CreatedAt descending
                                  select new
                                  {
                                      b.BookingId,
                                      b.BookingCode,
                                      Status = b.Status ?? "",
                                      b.TotalAmount,
                                      s.StartsAt,
                                      MovieTitle = m.Title,
                                      CinemaName = c.CinemaName,
                                      RoomName = r.RoomName
                                  }).ToListAsync();

            var bookingIds = bookings.Select(x => x.BookingId).ToList();
            var seatRows = await (from bi in _dataContext.BookingItems.AsNoTracking()
                                  join seat in _dataContext.Seats.AsNoTracking() on bi.SeatId equals seat.SeatId
                                  where bookingIds.Contains(bi.BookingId)
                                  orderby seat.SeatRow, seat.SeatNumber
                                  select new { bi.BookingId, Code = seat.SeatRow + seat.SeatNumber })
                .ToListAsync();

            var seatsByBooking = seatRows
                .GroupBy(x => x.BookingId)
                .ToDictionary(g => g.Key, g => g.Select(x => x.Code).ToList());

            ViewData["BodyClass"] = "profile-page";

            return View(new ProfileViewModel
            {
                FullName = user.FullName,
                Email = user.Email,
                Phone = user.Phone,
                AvatarUrl = user.AvatarUrl,
                CreatedAt = user.CreatedAt,
                PaidBookingsCount = paidBookingsCount,
                ExpiredBookingsCount = expiredBookingsCount,
                CancelledBookingsCount = cancelledBookingsCount,
                ActiveTab = safeTab,
                StatusFilter = safeStatus,
                Bookings = bookings.Select(b =>
                {
                    var normalizedStatus = b.Status;
                    var label = normalizedStatus switch
                    {
                        "paid" => "Đã thanh toán",
                        "expired" => "Hết hạn",
                        "cancelled" => "Đã hủy",
                        _ => normalizedStatus
                    };
                    var css = normalizedStatus switch
                    {
                        "paid" => "completed",
                        "expired" => "expired",
                        "cancelled" => "cancelled",
                        _ => "cancelled"
                    };

                    return new BookingHistoryItemViewModel
                    {
                        BookingId = b.BookingId,
                        BookingCode = b.BookingCode ?? $"BK-{b.BookingId}",
                        Status = normalizedStatus,
                        StatusLabel = label,
                        StatusCssClass = css,
                        MovieTitle = b.MovieTitle,
                        CinemaName = b.CinemaName,
                        RoomName = b.RoomName,
                        StartsAt = b.StartsAt,
                        SeatCodes = seatsByBooking.TryGetValue(b.BookingId, out var codes) ? codes : new List<string>(),
                        TotalAmount = b.TotalAmount
                    };
                }).ToList()
            });
        }

        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ChangePassword([Bind(Prefix = "Security")] ProfileSecurityViewModel model)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdClaim, out var userId))
            {
                return Forbid();
            }

            // Build the full profile model so we can return to the same page with errors.
            // We force ActiveTab=security
            var profileVmResult = await Profile(tab: "security", status: "all") as ViewResult;
            var vm = profileVmResult?.Model as ProfileViewModel ?? new ProfileViewModel { ActiveTab = "security" };

            vm.ActiveTab = "security";
            vm.Security = model;

            if (!ModelState.IsValid)
            {
                return View("Profile", vm);
            }

            var user = await _dataContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
            {
                ModelState.AddModelError(string.Empty, "Tài khoản không tồn tại.");
                return View("Profile", vm);
            }

            var verify = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash ?? string.Empty, model.CurrentPassword);
            if (verify == PasswordVerificationResult.Failed)
            {
                ModelState.AddModelError("Security.CurrentPassword", "Mật khẩu hiện tại không chính xác.");
                return View("Profile", vm);
            }

            user.PasswordHash = _passwordHasher.HashPassword(user, model.NewPassword);
            user.UpdatedAt = DateTime.Now;
            await _dataContext.SaveChangesAsync();

            TempData["ProfileSecuritySuccess"] = "Đã đổi mật khẩu thành công!";
            return RedirectToAction(nameof(Profile), new { tab = "security" });
        }

        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Profile(ProfileViewModel model)
        {
            await BookingMaintenance.ExpireHoldsAsync(_dataContext);

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdClaim, out var userId))
            {
                return Forbid();
            }

            ViewData["BodyClass"] = "profile-page";

            if (!ModelState.IsValid)
            {
                // Rehydrate read-only fields
                var existing = await _dataContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == userId);
                if (existing != null)
                {
                    model.CreatedAt = existing.CreatedAt;
                    var bookingCounts = await _dataContext.Bookings.AsNoTracking()
                        .Where(b => b.UserId == userId)
                        .GroupBy(b => b.Status ?? "")
                        .Select(g => new { Status = g.Key, Count = g.Count() })
                        .ToListAsync();

                    model.PaidBookingsCount = bookingCounts.FirstOrDefault(x => x.Status == "paid")?.Count ?? 0;
                    model.ExpiredBookingsCount = bookingCounts.FirstOrDefault(x => x.Status == "expired")?.Count ?? 0;
                    model.CancelledBookingsCount = bookingCounts.FirstOrDefault(x => x.Status == "cancelled")?.Count ?? 0;
                }
                model.ActiveTab = "personal-info";
                model.StatusFilter = "all";
                model.Bookings = new List<BookingHistoryItemViewModel>();
                return View(model);
            }

            var user = await _dataContext.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
            {
                return NotFound();
            }

            var email = (model.Email ?? "").Trim();
            var phone = string.IsNullOrWhiteSpace(model.Phone) ? null : model.Phone.Trim();

            var exists = await _dataContext.Users.AsNoTracking()
                .AnyAsync(u => u.UserId != userId
                              && (u.Email == email || (phone != null && u.Phone == phone)));

            if (exists)
            {
                ModelState.AddModelError(string.Empty, "Email hoặc số điện thoại đã được sử dụng.");
                model.CreatedAt = user.CreatedAt;
                var bookingCounts = await _dataContext.Bookings.AsNoTracking()
                    .Where(b => b.UserId == userId)
                    .GroupBy(b => b.Status ?? "")
                    .Select(g => new { Status = g.Key, Count = g.Count() })
                    .ToListAsync();

                model.PaidBookingsCount = bookingCounts.FirstOrDefault(x => x.Status == "paid")?.Count ?? 0;
                model.ExpiredBookingsCount = bookingCounts.FirstOrDefault(x => x.Status == "expired")?.Count ?? 0;
                model.CancelledBookingsCount = bookingCounts.FirstOrDefault(x => x.Status == "cancelled")?.Count ?? 0;
                model.ActiveTab = "personal-info";
                model.StatusFilter = "all";
                model.Bookings = new List<BookingHistoryItemViewModel>();
                return View(model);
            }

            user.FullName = model.FullName.Trim();
            user.Email = email;
            user.Phone = phone;
            user.AvatarUrl = string.IsNullOrWhiteSpace(model.AvatarUrl) ? null : model.AvatarUrl.Trim();
            user.UpdatedAt = DateTime.Now;

            await _dataContext.SaveChangesAsync();

            // Refresh auth cookie claims so header shows new name/email
            var authResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            var authProperties = authResult.Properties ?? new AuthenticationProperties();

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Name, user.FullName),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(ClaimTypes.Role, user.Role ?? "customer")
            };
            var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);

            TempData["ProfileSuccess"] = "Đã cập nhật thông tin thành công!";
            return RedirectToAction(nameof(Profile));
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Ticket(long bookingId)
        {
            await BookingMaintenance.ExpireHoldsAsync(_dataContext);

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!long.TryParse(userIdClaim, out var userId))
            {
                return Forbid();
            }

            var booking = await _dataContext.Bookings.AsNoTracking()
                .FirstOrDefaultAsync(b => b.BookingId == bookingId);
            if (booking == null)
            {
                return NotFound();
            }
            if (booking.UserId != userId)
            {
                return Forbid();
            }

            var status = (booking.Status ?? "").Trim().ToLowerInvariant();
            if (status is not ("paid" or "expired" or "cancelled"))
            {
                // For now, treat other states as expired-like in ticket page
                status = status == "confirmed" ? "paid" : "expired";
            }

            var info = await (from s in _dataContext.Showtimes.AsNoTracking()
                              join m in _dataContext.Movies.AsNoTracking() on s.MovieId equals m.MovieId
                              join r in _dataContext.Rooms.AsNoTracking() on s.RoomId equals r.RoomId
                              join c in _dataContext.Cinemas.AsNoTracking() on r.CinemaId equals c.CinemaId
                              where s.ShowtimeId == booking.ShowtimeId
                              select new
                              {
                                  MovieId = m.MovieId,
                                  MovieTitle = m.Title,
                                  CinemaName = c.CinemaName,
                                  CinemaAddress = c.Address,
                                  RoomName = r.RoomName,
                                  s.StartsAt
                              }).FirstOrDefaultAsync();

            if (info == null)
            {
                return NotFound();
            }

            var seatCodes = await (from bi in _dataContext.BookingItems.AsNoTracking()
                                   join seat in _dataContext.Seats.AsNoTracking() on bi.SeatId equals seat.SeatId
                                   where bi.BookingId == bookingId
                                   orderby seat.SeatRow, seat.SeatNumber
                                   select seat.SeatRow + seat.SeatNumber)
                .ToListAsync();

            var user = await _dataContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == userId);
            var payment = await _dataContext.Payments.AsNoTracking()
                .Where(p => p.BookingId == bookingId)
                .OrderByDescending(p => p.PaidAt ?? p.CreatedAt)
                .FirstOrDefaultAsync();

            return View(new TicketDetailsViewModel
            {
                BookingId = booking.BookingId,
                BookingCode = booking.BookingCode ?? $"BK-{booking.BookingId}",
                Status = status,
                CustomerEmail = user?.Email ?? "",
                CustomerName = user?.FullName ?? User.Identity?.Name ?? "",
                MovieId = info.MovieId,
                MovieTitle = info.MovieTitle,
                CinemaName = info.CinemaName,
                CinemaAddress = info.CinemaAddress,
                RoomName = info.RoomName,
                StartsAt = info.StartsAt,
                SeatCodes = seatCodes,
                TotalAmount = booking.TotalAmount,
                PaymentMethod = payment?.Method ?? "mock",
                ProviderTxn = payment?.ProviderTxn ?? ""
            });
        }
    }
}
