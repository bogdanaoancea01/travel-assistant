using TravelAssistant.DTOs.Chat;
using TravelAssistant.DTOs.Trip;

namespace TravelAssistant.Services.Interfaces
{
    public interface ITripService
    {
        Task<TripPlanResponseDTO> GenerateTripAsync(
            IReadOnlyList<ChatMessageDTO> messages,
            CancellationToken cancellationToken = default
        );
    }
}