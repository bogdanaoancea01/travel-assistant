using System.ComponentModel.DataAnnotations;

namespace travel_assistant_backend.Models
{
    public class UserPreferences
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        [MaxLength(500)]
        public string? Bio { get; set; }

        [MaxLength(100)]
        public string? HomeCity { get; set; }

        [MaxLength(10)]
        public string? PreferredCurrency { get; set; }

        [MaxLength(100)]
        public string? PreferredAirportName { get; set; }

        [MaxLength(100)]
        public string? AccommodationStyle { get; set; }

        [MaxLength(100)]
        public string? MealPreference { get; set; }

    }
}
