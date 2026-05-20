using System.ComponentModel.DataAnnotations;

namespace travel_assistant_backend.Models
{
    public class UserMessage
    {
        public int Id { get; set; }

        [Required]
        public int ChatId { get; set; }

        [Required]
        public string Content { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Chat Chat { get; set; }
    }
}
