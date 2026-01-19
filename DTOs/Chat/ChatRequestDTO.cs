using OpenAI.Chat;
using System.ComponentModel.DataAnnotations;

namespace TravelAssistant.DTOs.Chat
{
    public class ChatRequestDTO
    {
        [Required]
        [MinLength(1, ErrorMessage = "At least one message is required.")]
        public List<ChatMessageDTO> Messages { get; set; } = [];
    }
}
