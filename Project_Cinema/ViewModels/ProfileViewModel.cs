using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Project_Cinema.ViewModels
{
    public class ProfileViewModel
    {
        [Required(ErrorMessage = "Vui lòng nhập họ và tên.")]
        [StringLength(120, ErrorMessage = "Họ và tên quá dài.")]
        public string FullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng nhập email.")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ.")]
        [StringLength(150)]
        public string Email { get; set; } = string.Empty;

        [Phone(ErrorMessage = "Số điện thoại không hợp lệ.")]
        [StringLength(30)]
        public string? Phone { get; set; }

        [Url(ErrorMessage = "Avatar URL không hợp lệ.")]
        [StringLength(500)]
        public string? AvatarUrl { get; set; }

        public DateTime CreatedAt { get; set; }
        public int PaidBookingsCount { get; set; }

        // Booking history (My tickets)
        public int ExpiredBookingsCount { get; set; }
        public int CancelledBookingsCount { get; set; }
        public string ActiveTab { get; set; } = "personal-info"; // personal-info|booking-history|...
        public string StatusFilter { get; set; } = "all"; // all|paid|expired|cancelled
        public List<BookingHistoryItemViewModel> Bookings { get; set; } = new();

        // Security tab
        public ProfileSecurityViewModel Security { get; set; } = new();

        public string JoinedMonthYear => CreatedAt == default ? "--/----" : CreatedAt.ToString("MM/yyyy");
    }

    public class ProfileSecurityViewModel
    {
        [Required(ErrorMessage = "Vui lòng nhập mật khẩu hiện tại.")]
        [DataType(DataType.Password)]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng nhập mật khẩu mới.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự.")]
        [DataType(DataType.Password)]
        public string NewPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vui lòng nhập lại mật khẩu mới.")]
        [DataType(DataType.Password)]
        [Compare(nameof(NewPassword), ErrorMessage = "Mật khẩu xác nhận không khớp.")]
        public string ConfirmNewPassword { get; set; } = string.Empty;
    }

    public class BookingHistoryItemViewModel
    {
        public long BookingId { get; set; }
        public string BookingCode { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty; // paid|expired|cancelled
        public string StatusLabel { get; set; } = string.Empty;
        public string StatusCssClass { get; set; } = string.Empty;

        public string MovieTitle { get; set; } = string.Empty;
        public string CinemaName { get; set; } = string.Empty;
        public string RoomName { get; set; } = string.Empty;
        public DateTime StartsAt { get; set; }
        public List<string> SeatCodes { get; set; } = new();
        public decimal TotalAmount { get; set; }

        public string StartsAtDisplay => StartsAt == default ? "--" : $"{StartsAt:dd/MM/yyyy}, {StartsAt:HH:mm}";
        public string PriceDisplay => $"{TotalAmount:N0}đ";
        public bool CanDownload => Status == "paid";
    }
}

