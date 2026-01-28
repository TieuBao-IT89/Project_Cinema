using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_Cinema.Models
{
    [Table("PAYMENTS")]
    public class PaymentModel
    {
        [Key]
        [Column("PAYMENT_ID")]
        public long PaymentId { get; set; }

        [Column("BOOKING_ID")]
        public long BookingId { get; set; }

        [Column("METHOD")]
        public string Method { get; set; } = null!;

        [Column("PROVIDER")]
        public string? Provider { get; set; }

        [Column("PROVIDER_TXN")]
        public string? ProviderTxn { get; set; }

        [Column("AMOUNT")]
        public decimal Amount { get; set; }

        [Column("CURRENCY")]
        public string? Currency { get; set; }

        [Column("STATUS")]
        public string? Status { get; set; }

        [Column("PAID_AT")]
        public DateTime? PaidAt { get; set; }

        [Column("CREATED_AT")]
        public DateTime CreatedAt { get; set; }
    }
}
