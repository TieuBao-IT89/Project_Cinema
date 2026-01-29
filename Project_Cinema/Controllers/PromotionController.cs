using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project_Cinema.Repository;
using Project_Cinema.ViewModels;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Project_Cinema.Controllers
{
    public class PromotionController : Controller
    {
        private readonly DataContext _dataContext;

        public PromotionController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet]
        public async Task<IActionResult> Index(string? type = "all", string? status = "all", string? q = null)
        {
            var now = DateTime.Now;

            var safeType = (type ?? "all").Trim().ToLowerInvariant();
            if (safeType is not ("all" or "percent" or "amount"))
            {
                safeType = "all";
            }

            var safeStatus = (status ?? "all").Trim().ToLowerInvariant();
            if (safeStatus is not ("all" or "active" or "upcoming" or "ended"))
            {
                safeStatus = "all";
            }

            var safeQuery = (q ?? "").Trim();

            var query = _dataContext.Promotions.AsNoTracking().AsQueryable();

            // Optional DB-level status filter (if column exists)
            // Keep soft-filter: only "active" promotions by default if DB uses status
            // We'll not enforce here; status filter is computed from dates below.

            if (safeType != "all")
            {
                query = query.Where(p => (p.DiscountType ?? "").ToLower() == safeType);
            }

            if (!string.IsNullOrWhiteSpace(safeQuery))
            {
                query = query.Where(p =>
                    p.Name.Contains(safeQuery) ||
                    (p.Code != null && p.Code.Contains(safeQuery)) ||
                    (p.Description != null && p.Description.Contains(safeQuery)));
            }

            // Load first, then compute active/upcoming/ended based on date range
            var promotions = await query
                .OrderByDescending(p => p.StartAt)
                .ToListAsync();

            var items = promotions.Select(p =>
            {
                var discountType = (p.DiscountType ?? "").Trim().ToLowerInvariant();
                var computedStatus = now < p.StartAt ? "upcoming" : (now > p.EndAt ? "ended" : "active");

                var badgeClass = discountType switch
                {
                    "percent" => "discount",
                    "amount" => "voucher",
                    _ => "discount"
                };

                var badgeText = discountType switch
                {
                    "percent" => "Giảm %",
                    "amount" => "Voucher",
                    _ => "Khuyến mãi"
                };

                var statusText = computedStatus switch
                {
                    "upcoming" => "Sắp diễn ra",
                    "ended" => "Đã kết thúc",
                    _ => "Đang diễn ra"
                };

                var discountBadge = discountType switch
                {
                    "percent" => $"{p.DiscountValue:0.#}%",
                    "amount" => $"{p.DiscountValue:N0}đ",
                    _ => $"{p.DiscountValue:N0}"
                };

                var discountText = discountType switch
                {
                    "percent" => $"Giảm {p.DiscountValue:0.#}% cho đơn từ {p.MinOrderValue:N0}đ",
                    "amount" => $"Giảm {p.DiscountValue:N0}đ cho đơn từ {p.MinOrderValue:N0}đ",
                    _ => p.Description ?? ""
                };

                if (p.MaxDiscount != null && p.MaxDiscount > 0)
                {
                    discountText += $" (tối đa {p.MaxDiscount.Value:N0}đ)";
                }

                return new PromotionListItemViewModel
                {
                    PromotionId = p.PromotionId,
                    Name = p.Name,
                    Code = p.Code,
                    Description = p.Description,
                    DiscountType = discountType,
                    DiscountValue = p.DiscountValue,
                    MinOrderValue = p.MinOrderValue,
                    MaxDiscount = p.MaxDiscount,
                    UsageLimit = p.UsageLimit,
                    UsedCount = p.UsedCount,
                    StartAt = p.StartAt,
                    EndAt = p.EndAt,
                    BadgeClass = badgeClass,
                    BadgeText = badgeText,
                    StatusClass = computedStatus,
                    StatusText = statusText,
                    DiscountBadge = discountBadge,
                    DiscountText = discountText
                };
            }).ToList();

            if (safeStatus != "all")
            {
                items = items.Where(i => i.StatusClass == safeStatus).ToList();
            }

            // Sort: active -> upcoming -> ended (and then by start desc)
            int Rank(string s) => s switch { "active" => 0, "upcoming" => 1, "ended" => 2, _ => 3 };
            items = items
                .OrderBy(i => Rank(i.StatusClass))
                .ThenByDescending(i => i.StartAt)
                .ToList();

            return View(new PromotionIndexViewModel
            {
                TypeFilter = safeType,
                StatusFilter = safeStatus,
                Query = safeQuery,
                Promotions = items
            });
        }
    }
}

