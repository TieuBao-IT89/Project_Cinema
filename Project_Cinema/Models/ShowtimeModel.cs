using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_Cinema.Models
{
    [Table("SHOWTIMES")]
    public class ShowtimeModel
    {
        [Key]
        [Column("SHOWTIME_ID")]
        public long ShowtimeId { get; set; }   // SHOWTIME_ID (PK)

        [Required(ErrorMessage = "Vui lòng chọn phim")]
        [Column("MOVIE_ID")]
        public long MovieId { get; set; }      // FK -> MOVIES

        [Required(ErrorMessage = "Vui lòng chọn phòng chiếu")]
        [Column("ROOM_ID")]
        public long RoomId { get; set; }       // FK -> ROOMS

        [Required(ErrorMessage = "Vui lòng chọn thời gian bắt đầu")]
        [Column("STARTS_AT")]
        public DateTime StartsAt { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn thời gian kết thúc")]
        [Column("ENDS_AT")]
        public DateTime EndsAt { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập giá vé")]
        [Range(0, 10000000)]
        [Column("BASE_PRICE")]
        public decimal BasePrice { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập trạng thái suất chiếu")]
        [StringLength(20)]
        [Column("STATUS")]
        public string Status { get; set; } = null!;

        [Required]
        [Column("CREATE_AT")]
        public DateTime CreatedAt { get; set; }
    }
}
