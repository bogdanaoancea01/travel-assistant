using OpenAI.Chat;
using travel_assistant_backend.DTOs.PopularDestinations;
using travel_assistant_backend.Models;

namespace travel_assistant_backend.Services.PopularDestinations
{
    public interface IPopularDestinationsService
    {
        Task<List<PopularDestination>> GenerateFromAIAsync(CancellationToken cancellationToken);
        Task SeedAsync(CancellationToken cancellationToken = default);
        Task<List<PopularDestinationDTO>> GetRandomAsync(CancellationToken cancellationToken = default);
    }
}
