using System.ComponentModel.DataAnnotations;

namespace travel_assistant_backend.DTOs.ChatHistory
{
    public class SaveAssistantResponseRequest
    {
        [Required]
        public string JsonContent { get; set; }
    }
}
