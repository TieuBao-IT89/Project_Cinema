using System.ComponentModel.DataAnnotations;

namespace Project_Cinema.Models
{
    public class CinemaModel
    {
        public long CinemaId { get; set; }  

        [Required(ErrorMessage = "Vui lòng nhập tên rạp")]
        [StringLength(255)]
        public string CinemaName { get; set; } = null!;

        [Required(ErrorMessage = "Vui lòng nhập địa chỉ rạp")]
        public string Address { get; set; } = null!;

        public string? City { get; set; }

        public decimal? Latitude { get; set; }

        public decimal? Longitude { get; set; }

        public string? Phone { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập trạng thái rạp")]
        [StringLength(20)]
        public string Status { get; set; } = null!;

        [Required]
        public DateTime CreatedAt { get; set; }
    }
}
