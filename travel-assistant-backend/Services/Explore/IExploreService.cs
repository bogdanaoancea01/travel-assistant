using travel_assistant_backend.DTOs.Explore;
using travel_assistant_backend.DTOs.UserPreference;

namespace travel_assistant_backend.Services.Explore
{
    public interface IExploreService
    {
        Task<ExploreSuggestionsDTO> GenerateSuggestionsAsync(
            UserPreferencesDTO preferences,
            CancellationToken cancellationToken = default);
    }
}