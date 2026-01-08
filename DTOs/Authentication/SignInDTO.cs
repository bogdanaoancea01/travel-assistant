using System.ComponentModel.DataAnnotations;

namespace TravelAssistant.DTOs.Authentication
{
    public class SignInDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;  
    }
}
