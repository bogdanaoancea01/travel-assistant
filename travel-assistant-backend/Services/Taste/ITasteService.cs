using travel_assistant_backend.DTOs.Explore;

namespace travel_assistant_backend.Services.Taste
{
    public interface ITasteService
    {
        Task<List<(string Key, string Name)>> GetExclusionsAsync(int userId, CancellationToken ct = default);
        Task<(List<(string Name, float[] Vec)> Liked, List<(string Name, float[] Vec)> Disliked)>
            GetAnchorsAsync(int userId, CancellationToken ct = default);
        Task ApplyFeedbackAsync(int userId, DestinationFeedbackDTO feedback, CancellationToken ct = default);
        Task RemoveInteractionAsync(int userId, string city, string country, CancellationToken ct = default);
        Task<List<SavedDestinationDTO>> GetSavedAsync(int userId, CancellationToken ct = default);
        RankedSuggestionsDTO Rerank(
            IReadOnlyList<ExploreDestinationDTO> candidates,
            IReadOnlyList<float[]> candidateEmbeddings,
            List<(string Name, float[] Vec)> liked,
            List<(string Name, float[] Vec)> disliked,
            float[]? prefsEmbedding,
            int topK);


        /// <summary> text used to embed a destination.</summary>
        static string Descriptor(string city, string country, string category, IEnumerable<string> tags)
            => $"{city}, {country}. Category: {category}. Themes: {string.Join(", ", tags ?? Enumerable.Empty<string>())}.";
    }
}
