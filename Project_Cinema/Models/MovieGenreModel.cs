using System.ComponentModel.DataAnnotations.Schema;

namespace Project_Cinema.Models
{
    [Table("MOVIE_GENRES")]
    public class MovieGenreModel
    {
        [Column("MOVIE_ID")]
        public long MovieId { get; set; }

        [Column("GENRE_ID")]
        public long GenreId { get; set; }
    }
}
