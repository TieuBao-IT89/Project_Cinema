using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_Cinema.Models
{
    [Table("ROOMS")]
    public class RoomModel
    {
        [Key]
        [Column("ROOM_ID")]
        public long RoomId { get; set; }

        [Column("CINEMA_ID")]
        public long CinemaId { get; set; }

        [Column("ROOM_NAME")]
        public string RoomName { get; set; } = null!;

        [Column("ROOM_TYPE")]
        public string? RoomType { get; set; }

        [Column("STATUS")]
        public string? Status { get; set; }
    }
}
