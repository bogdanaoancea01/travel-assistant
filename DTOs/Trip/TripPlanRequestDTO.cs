using System.ComponentModel.DataAnnotations;
using TravelAssistant.DTOs.Chat;

namespace TravelAssistant.DTOs.Trip
{
    public class TripPlanRequestDTO
    {
        [Required]
        [MinLength(1, ErrorMessage = "At least one message is required.")]
        public List<ChatMessageDTO> Messages { get; set; } = [];
    }
}