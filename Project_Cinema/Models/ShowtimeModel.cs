using System.ComponentModel.DataAnnotations;

namespace Project_Cinema.Models
{
    public class ShowtimeModel
    {
        public long ShowtimeId { get; set; }   // SHOWTIME_ID (PK)

        [Required(ErrorMessage = "Vui lòng chọn phim")]
        public long MovieId { get; set; }      // FK -> MOVIES

        [Required(ErrorMessage = "Vui lòng chọn phòng chiếu")]
        public long RoomId { get; set; }       // FK -> ROOMS

        [Required(ErrorMessage = "Vui lòng chọn thời gian bắt đầu")]
        public DateTime StartsAt { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn thời gian kết thúc")]
        public DateTime EndsAt { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập giá vé")]
        [Range(0, 10000000)]
        public decimal BasePrice { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập trạng thái suất chiếu")]
        [StringLength(20)]
        public string Status { get; set; } = null!;

        [Required]
        public DateTime CreatedAt { get; set; }
    }
}
