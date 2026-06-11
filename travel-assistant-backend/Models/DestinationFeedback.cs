using System.ComponentModel.DataAnnotations;

namespace travel_assistant_backend.Models
{
    /// <summary>
    /// One row per feedback action a user takes on a suggested destination.
    /// </summary>
    public class DestinationFeedback
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        [MaxLength(100)]
        public string City { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Country { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Category { get; set; } = string.Empty;

        // Comma-separated feature tags as shown on the card.
        [MaxLength(300)]
        public string Tags { get; set; } = string.Empty;

        // Like / Dislike / Save
        [MaxLength(20)]
        public string Signal { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
