using System.ComponentModel.DataAnnotations;

namespace travel_assistant_backend.Models
{
    public class AssistantResponse
    {
        public int Id { get; set; }

        [Required]
        public int ChatId { get; set; }

        [Required]
        public string JsonContent { get; set; } // AI response -> JSON

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Chat Chat { get; set; }
    }
}
