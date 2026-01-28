using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Project_Cinema.Models
{
    [Table("USERS")]
    public class UserModel
    {
        [Key]
        [Column("USER_ID")]
        public long UserId { get; set; }

        [Column("FULL_NAME")]
        public string FullName { get; set; } = null!;

        [Column("EMAIL")]
        public string Email { get; set; } = null!;

        [Column("PHONE")]
        public string? Phone { get; set; }

        [Column("PASSWORD_HASH")]
        public string? PasswordHash { get; set; }

        [Column("ROLE")]
        public string? Role { get; set; }

        [Column("STATUS")]
        public string? Status { get; set; }

        [Column("AVATAR_URL")]
        public string? AvatarUrl { get; set; }

        [Column("CREATED_AT")]
        public DateTime CreatedAt { get; set; }

        [Column("UPDATED_AT")]
        public DateTime UpdatedAt { get; set; }
    }
}
