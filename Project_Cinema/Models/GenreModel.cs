using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_Cinema.Models
{
    [Table("GENRES")]
    public class GenreModel
    {
        [Key]
        [Column("GENRE_ID")]
        public long GenreId { get; set; }

        [Column("GENRE_NAME")]
        public string GenreName { get; set; } = null!;
    }
}
