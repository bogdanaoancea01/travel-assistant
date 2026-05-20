using System.ComponentModel.DataAnnotations;

namespace travel_assistant_backend.Models
{
    public class Chat
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(200)]
        public string Name { get; set; } = "New Chat";

        public User User { get; set; }
        public List<UserMessage> UserMessages { get; set; } = new List<UserMessage>();
        public List<AssistantResponse> AssistantResponses { get; set; } = new List<AssistantResponse>();

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
