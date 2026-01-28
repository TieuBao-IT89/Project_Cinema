using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_Cinema.Models
{
    [Table("BOOKINGS")]
    public class BookingModel
    {
        [Key]
        [Column("BOOKING_ID")]
        public long BookingId { get; set; }

        [Column("BOOKING_CODE")]
        public string? BookingCode { get; set; }

        [Column("USER_ID")]
        public long? UserId { get; set; }

        [Column("SHOWTIME_ID")]
        public long ShowtimeId { get; set; }

        [Column("STATUS")]
        public string? Status { get; set; }

        [Column("SUBTOTAL")]
        public decimal Subtotal { get; set; }

        [Column("DISCOUNT_AMOUNT")]
        public decimal DiscountAmount { get; set; }

        [Column("TOTAL_AMOUNT")]
        public decimal TotalAmount { get; set; }

        [Column("EXPIRES_AT")]
        public DateTime? ExpiresAt { get; set; }

        [Column("CREATE_AT")]
        public DateTime CreatedAt { get; set; }
    }
}
