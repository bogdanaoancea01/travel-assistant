using System.ComponentModel.DataAnnotations;

namespace TravelAssistant.DTOs.Chat
{
    public class ChatMessageDTO
    {
        [Required]
        [RegularExpression("system|user|assistant")]
        public string Role { get; set; } = string.Empty;

        [Required]
        [MaxLength(4000)]
        public string Message { get; set; } = string.Empty;
    }
}
