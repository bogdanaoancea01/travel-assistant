using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using travel_assistant_backend.DTOs.Explore;
using travel_assistant_backend.DTOs.UserPreference;
using travel_assistant_backend.Services.Embeddings;
using travel_assistant_backend.Services.Explore;
using travel_assistant_backend.Services.Preferences;
using travel_assistant_backend.Services.Taste;

namespace travel_assistant_backend.Controllers
{
    [ApiController]
    [Route("api/explore")]
    [Authorize]
    public class ExploreController : ControllerBase
    {
        private readonly IExploreService _exploreService;
        private readonly IPreferencesService _preferencesService;
        private readonly ITasteService _tasteService;
        private readonly IEmbeddingService _embeddingService;

        private const int CandidatePoolSize = 16; // generate wide, show few
        private const int DisplayCount = 6;
        private const int MaxAvoidNames = 40;       // cap the prompt avoid-list

        public ExploreController(
            IExploreService exploreService,
            IPreferencesService preferencesService,
            ITasteService tasteService,
            IEmbeddingService embeddingService)
        {
            _exploreService = exploreService;
            _preferencesService = preferencesService;
            _tasteService = tasteService;
            _embeddingService = embeddingService;
        }

        private int GetUserId() => int.Parse(User.FindFirstValue("userId")!);

        private static string Key(string city, string country) =>
            $"{(city ?? "").Trim().ToLowerInvariant()}|{(country ?? "").Trim().ToLowerInvariant()}";

        /// <summary>
        /// Pipeline: preferences + liked/disliked anchors -> LLM candidate pool (taste-aware,
        /// excluding everything already acted on or seen) -> embedding re-rank + MMR -> top N.
        /// </summary>
        [HttpPost("suggestions")]
        public async Task<IActionResult> GetSuggestions([FromBody] ExploreRequestDTO? request, CancellationToken ct)
        {
            var userId = GetUserId();
            var preferences = await _preferencesService.GetPreferencesAsync(userId) ?? new UserPreferencesDTO();

            // Exclusions = everything interacted with (DB) + everything seen this session (client).
            var dbExclusions = await _tasteService.GetExclusionsAsync(userId, ct);
            var excludeKeys = dbExclusions.Select(e => e.Key).ToHashSet();
            var excludeNames = dbExclusions.Select(e => e.Name).ToList();

            foreach (var s in request?.Seen ?? new())
            {
                var key = Key(s.City, s.Country);
                if (excludeKeys.Add(key)) excludeNames.Add($"{s.City}, {s.Country}");
            }

            var (liked, disliked) = await _tasteService.GetAnchorsAsync(userId, ct);
            var likedNames = liked.Select(l => l.Name).ToList();
            var dislikedNames = disliked.Select(d => d.Name).ToList();

            // Generate a fresh, taste-aware candidate pool.
            var pool = await _exploreService.GenerateCandidatesAsync(
                preferences, CandidatePoolSize,
                excludeNames.Take(MaxAvoidNames).ToList(), likedNames, dislikedNames, ct);

            // Belt-and-suspenders: drop anything that slipped through the exclusion.
            var candidates = pool.Destinations
                .Where(d => !excludeKeys.Contains(Key(d.City, d.Country)))
                .GroupBy(d => Key(d.City, d.Country))
                .Select(g => g.First())
                .ToList();

            if (candidates.Count == 0)
                return Ok(new RankedSuggestionsDTO());

            // Embed candidates + the preference profile.
            var descriptors = candidates
                .Select(c => ITasteService.Descriptor(c.City, c.Country, c.Category, c.Tags))
                .ToList();
            var candidateEmbeddings = await _embeddingService.EmbedBatchAsync(descriptors, ct);

            var prefsText = BuildPreferenceText(preferences);
            float[]? prefsEmbedding = string.IsNullOrWhiteSpace(prefsText)
                ? null
                : await _embeddingService.EmbedAsync(prefsText, ct);

            var ranked = _tasteService.Rerank(candidates, candidateEmbeddings, liked, disliked, prefsEmbedding, DisplayCount);
            return Ok(ranked);
        }

        [HttpPost("feedback")]
        public async Task<IActionResult> SubmitFeedback([FromBody] DestinationFeedbackDTO feedback, CancellationToken ct)
        {
            if (feedback == null || string.IsNullOrWhiteSpace(feedback.City))
                return BadRequest("Feedback with a destination is required.");

            await _tasteService.ApplyFeedbackAsync(GetUserId(), feedback, ct);
            return Ok();
        }

        [HttpDelete("interaction")]
        public async Task<IActionResult> RemoveInteraction([FromQuery] string city, [FromQuery] string country, CancellationToken ct)
        {
            if (string.IsNullOrWhiteSpace(city)) return BadRequest("city is required.");
            await _tasteService.RemoveInteractionAsync(GetUserId(), city, country ?? "", ct);
            return Ok();
        }

        [HttpGet("saved")]
        public async Task<IActionResult> GetSaved(CancellationToken ct)
        {
            var saved = await _tasteService.GetSavedAsync(GetUserId(), ct);
            return Ok(saved);
        }

        // Compact natural-language description of the user's profile, used as the
        // cold-start positive anchor for the embedding recommender.
        private static string BuildPreferenceText(UserPreferencesDTO p)
        {
            var parts = new[]
            {
                p.TravelStyles, p.ClimatePreference, p.TripMotivation, p.TravelCompanions,
                p.PreferredSetting, p.PlanningStyle, p.PreferredRegions, p.Transport, p.Bio
            }.Where(s => !string.IsNullOrWhiteSpace(s));
            return parts.Any() ? $"A traveller who enjoys: {string.Join("; ", parts)}." : "";
        }
    }
}
