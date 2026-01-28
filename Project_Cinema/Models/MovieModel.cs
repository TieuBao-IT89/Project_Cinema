using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_Cinema.Models
{
    [Table("MOVIES")]
    public class MovieModel
    {
        [Key]
        [Column("MOVIE_ID")]
        public long MovieId { get; set; }              

        [Required(ErrorMessage = "Vui lòng nhập tiêu đề phim")]
        [Column("TITLE")]
        public string Title { get; set; } = null!;     

        [Column("SLUG")]
        public string? Slug { get; set; }              

        [Column("DESCRIPTION")]
        public string? Description { get; set; }       

        [Required(ErrorMessage = "Vui lòng nhập thời lượng phim")]
        [Column("DURATION_MIN")]
        public int DurationMin { get; set; }           

        [Column("RELEASE_DATE")]
        public DateTime? ReleaseDate { get; set; }     

        [Column("LANGUAGE")]
        public string? Language { get; set; }          

        [Column("AGE_RATING")]
        public string? AgeRating { get; set; }         

        [Column("POSTER_URL")]
        public string? PosterUrl { get; set; }         

        [Column("TRAILER_URL")]
        public string? TrailerUrl { get; set; }        

        [Required(ErrorMessage = "Vui lòng nhập trạng thái phim")]
        [Column("STATUS")]
        public string Status { get; set; } = null!;    

        [Required]
        [Column("CREATED_AT")]
        public DateTime CreatedAt { get; set; }        

        [Required]
        [Column("UPDATED_AT")]
        public DateTime UpdatedAt { get; set; }        
    }
}
