using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_Cinema.Models
{
    [Table("BLOG_POSTS")]
    public class BlogPostModel
    {
        [Key]
        [Column("POST_ID")]
        public long PostId { get; set; }

        [Column("TITLE")]
        public string Title { get; set; } = null!;

        [Column("SLUG")]
        public string? Slug { get; set; }

        [Column("CONTENT")]
        public string Content { get; set; } = null!;

        [Column("COVER_URL")]
        public string? CoverUrl { get; set; }

        [Column("AUTHOR_ID")]
        public long? AuthorId { get; set; }

        [Column("STATUS")]
        public string? Status { get; set; }

        [Column("CREATED_AT")]
        public DateTime CreatedAt { get; set; }

        [Column("UPDATED_AT")]
        public DateTime UpdatedAt { get; set; }
    }
}
