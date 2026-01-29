using System;
using System.Collections.Generic;

namespace Project_Cinema.ViewModels
{
    public class PromotionIndexViewModel
    {
        public string TypeFilter { get; set; } = "all";   // all|percent|amount
        public string StatusFilter { get; set; } = "all"; // all|active|upcoming|ended
        public string Query { get; set; } = string.Empty;

        public List<PromotionListItemViewModel> Promotions { get; set; } = new();
    }

    public class PromotionListItemViewModel
    {
        public long PromotionId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Code { get; set; }
        public string? Description { get; set; }
        public string DiscountType { get; set; } = string.Empty;
        public decimal DiscountValue { get; set; }
        public decimal MinOrderValue { get; set; }
        public decimal? MaxDiscount { get; set; }
        public int? UsageLimit { get; set; }
        public int? UsedCount { get; set; }
        public DateTime StartAt { get; set; }
        public DateTime EndAt { get; set; }

        public string BadgeClass { get; set; } = "discount"; // discount|voucher|member|combo
        public string BadgeText { get; set; } = "Khuyến mãi";
        public string StatusClass { get; set; } = "active";  // active|upcoming|ended
        public string StatusText { get; set; } = "Đang diễn ra";

        public string DiscountBadge { get; set; } = string.Empty;
        public string DiscountText { get; set; } = string.Empty;

        public string DateRangeText => $"{StartAt:dd/MM/yyyy} - {EndAt:dd/MM/yyyy}";
    }
}

