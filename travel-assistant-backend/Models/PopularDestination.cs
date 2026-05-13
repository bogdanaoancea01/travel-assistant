using System.ComponentModel.DataAnnotations;

namespace travel_assistant_backend.Models
{
    public class PopularDestination
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string City { get; set; }

        [Required]
        [MaxLength(100)]
        public string Country { get; set; }

        [Required]
        public int DurationDays { get; set; }

        [Required]
        [MaxLength(200)]
        public string Prompt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
