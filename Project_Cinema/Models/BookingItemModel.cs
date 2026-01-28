using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_Cinema.Models
{
    [Table("BOOKING_ITEMS")]
    public class BookingItemModel
    {
        [Key]
        [Column("BOOKING_ITEM_ID")]
        public long BookingItemId { get; set; }

        [Column("BOOKING_ID")]
        public long BookingId { get; set; }

        [Column("SEAT_ID")]
        public long SeatId { get; set; }

        [Column("SHOWTIME_ID")]
        public long ShowtimeId { get; set; }

        [Column("PRICE")]
        public decimal Price { get; set; }

        [Column("TICKET_STATUS")]
        public string? TicketStatus { get; set; }
    }
}
