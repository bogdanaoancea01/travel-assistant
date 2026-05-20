using System.ComponentModel.DataAnnotations;

namespace travel_assistant_backend.DTOs.ChatHistory
{
    public class SaveUserMessageRequest
    {
        [Required]
        public string Content { get; set; }
    }
}
