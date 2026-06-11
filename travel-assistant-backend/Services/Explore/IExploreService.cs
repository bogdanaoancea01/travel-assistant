using travel_assistant_backend.DTOs.Explore;
using travel_assistant_backend.DTOs.UserPreference;

namespace travel_assistant_backend.Services.Explore
{
    public interface IExploreService
    {
        Task<ExploreSuggestionsDTO> GenerateCandidatesAsync(
            UserPreferencesDTO preferences,
            int count,
            IReadOnlyCollection<string> excludeNames,
            IReadOnlyCollection<string> likedNames,
            IReadOnlyCollection<string> dislikedNames,
            CancellationToken cancellationToken = default);
    }
}
