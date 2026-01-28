using System.ComponentModel.DataAnnotations.Schema;

namespace Project_Cinema.Models
{
    [Table("BOOKING_PROMOTIONS")]
    public class BookingPromotionModel
    {
        [Column("BOOKING_ID")]
        public long BookingId { get; set; }

        [Column("PROMOTION_ID")]
        public long PromotionId { get; set; }

        [Column("DISCOUNT_APPLIED")]
        public decimal DiscountApplied { get; set; }
    }
}
