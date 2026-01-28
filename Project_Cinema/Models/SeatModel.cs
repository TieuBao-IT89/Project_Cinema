using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_Cinema.Models
{
    [Table("SEATS")]
    public class SeatModel
    {
        [Key]
        [Column("SEAT_ID")]
        public long SeatId { get; set; }

        [Column("ROOM_ID")]
        public long RoomId { get; set; }

        [Column("SEAT_ROW")]
        public string SeatRow { get; set; } = null!;

        [Column("SEAT_NUMBER")]
        public int SeatNumber { get; set; }

        [Column("SEAT_TYPE")]
        public string? SeatType { get; set; }

        [Column("STATUS")]
        public string? Status { get; set; }
    }
}
