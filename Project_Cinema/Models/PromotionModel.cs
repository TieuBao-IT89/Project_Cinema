using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_Cinema.Models
{
    [Table("PROMOTIONS")]
    public class PromotionModel
    {
        [Key]
        [Column("PROMOTION_ID")]
        public long PromotionId { get; set; }

        [Column("CODE")]
        public string? Code { get; set; }

        [Column("NAME")]
        public string Name { get; set; } = null!;

        [Column("DESCRIPTION")]
        public string? Description { get; set; }

        [Column("DISCOUNT_TYPE")]
        public string? DiscountType { get; set; }

        [Column("DISCOUNT_VALUE")]
        public decimal DiscountValue { get; set; }

        [Column("MIN_ORDER_VALUE")]
        public decimal MinOrderValue { get; set; }

        [Column("MAX_DISCOUNT")]
        public decimal? MaxDiscount { get; set; }

        [Column("START_AT")]
        public DateTime StartAt { get; set; }

        [Column("END_AT")]
        public DateTime EndAt { get; set; }

        [Column("USAGE_LIMIT")]
        public int? UsageLimit { get; set; }

        [Column("USED_COUNT")]
        public int? UsedCount { get; set; }

        [Column("STATUS")]
        public string? Status { get; set; }
    }
}
