using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_Cinema.Models
{
    [Table("CINEMAS")]
    public class CinemaModel
    {
        [Key]
        [Column("CINEMA_ID")]
        public long CinemaId { get; set; }  

        [Required(ErrorMessage = "Vui lòng nhập tên rạp")]
        [StringLength(255)]
        [Column("CINEMA_NAME")]
        public string CinemaName { get; set; } = null!;

        [Required(ErrorMessage = "Vui lòng nhập địa chỉ rạp")]
        [Column("ADDRESS")]
        public string Address { get; set; } = null!;

        [Column("CITY")]
        public string? City { get; set; }

        [Column("LATITUDE")]
        public decimal? Latitude { get; set; }

        [Column("LONGITUDE")]
        public decimal? Longitude { get; set; }

        [Column("PHONE")]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập trạng thái rạp")]
        [StringLength(20)]
        [Column("STATUS")]
        public string Status { get; set; } = null!;

        [Required]
        [Column("CREATED_AT")]
        public DateTime CreatedAt { get; set; }
    }
}
