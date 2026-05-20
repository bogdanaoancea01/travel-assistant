using System.ComponentModel.DataAnnotations;

namespace travel_assistant_backend.DTOs.ChatHistory
{
    public class RenameChatRequest
    {
        [Required]
        [MaxLength(200)]
        public string Name { get; set; }
    }
}
