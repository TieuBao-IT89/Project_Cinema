using System.ComponentModel.DataAnnotations;

namespace Project_Cinema.Models
{
    public class MovieModel
    {
        public long MovieId { get; set; }              

        [Required(ErrorMessage = "Vui lòng nhập tiêu đề phim")]
        public string Title { get; set; } = null!;     

        public string? Slug { get; set; }              

        public string? Description { get; set; }       

        [Required(ErrorMessage = "Vui lòng nhập thời lượng phim")]
        public int DurationMin { get; set; }           

        public DateTime? ReleaseDate { get; set; }     

        public string? Language { get; set; }          

        public string? AgeRating { get; set; }         

        public string? PosterUrl { get; set; }         

        public string? TrailerUrl { get; set; }        

        [Required(ErrorMessage = "Vui lòng nhập trạng thái phim")]
        public string Status { get; set; } = null!;    

        [Required]
        public DateTime CreatedAt { get; set; }        

        [Required]
        public DateTime UpdatedAt { get; set; }        
    }
}
