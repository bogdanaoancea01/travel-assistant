using NJsonSchema;
using NJsonSchema.Generation;
using OpenAI.Chat;
using System.Text;
using System.Text.Json;
using travel_assistant_backend.DTOs.Explore;
using travel_assistant_backend.DTOs.UserPreference;

namespace travel_assistant_backend.Services.Explore
{
    public class ExploreService : IExploreService
    {
        private readonly ChatClient _chatClient;

        public ExploreService(ChatClient chatClient)
        {
            _chatClient = chatClient;
        }

        public async Task<ExploreSuggestionsDTO> GenerateCandidatesAsync(
            UserPreferencesDTO preferences,
            int count,
            IReadOnlyCollection<string> excludeNames,
            IReadOnlyCollection<string> likedNames,
            IReadOnlyCollection<string> dislikedNames,
            CancellationToken cancellationToken = default)
        {
            var schemaSettings = new SystemTextJsonSchemaGeneratorSettings
            {
                SerializerOptions = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                },
                SchemaType = SchemaType.OpenApi3,
                DefaultReferenceTypeNullHandling = ReferenceTypeNullHandling.NotNull
            };

            var schema = JsonSchema.FromType<ExploreSuggestionsDTO>(schemaSettings);
            ApplyStrictRequirements(schema);

            var options = new ChatCompletionOptions
            {
                // Higher temperature → more variety across regenerations.
                Temperature = 1.0f,
                ResponseFormat = ChatResponseFormat.CreateJsonSchemaFormat(
                    jsonSchemaFormatName: "explore_suggestions",
                    jsonSchema: BinaryData.FromString(schema.ToJson()),
                    jsonSchemaIsStrict: true)
            };

            var messages = new List<ChatMessage>
            {
                new SystemChatMessage(BuildSystemPrompt(preferences, count, excludeNames, likedNames, dislikedNames)),
                new UserChatMessage($"Generate {count} fresh candidate destination suggestions now.")
            };

            var completion = await _chatClient.CompleteChatAsync(messages, options, cancellationToken);
            var json = completion.Value.Content[0].Text;

            var result = JsonSerializer.Deserialize<ExploreSuggestionsDTO>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return result ?? new ExploreSuggestionsDTO();
        }

        private static string BuildSystemPrompt(
            UserPreferencesDTO p, int count,
            IReadOnlyCollection<string> excludeNames,
            IReadOnlyCollection<string> likedNames,
            IReadOnlyCollection<string> dislikedNames)
        {
            var prefLines = new[]
            {
                string.IsNullOrWhiteSpace(p.HomeCity)           ? null : $"- Home city: {p.HomeCity}",
                string.IsNullOrWhiteSpace(p.PreferredCurrency)  ? null : $"- Preferred currency: {p.PreferredCurrency}",
                string.IsNullOrWhiteSpace(p.PreferredAirportName) ? null : $"- Preferred airport: {p.PreferredAirportName}",
                string.IsNullOrWhiteSpace(p.AccommodationStyle) ? null : $"- Accommodation style: {p.AccommodationStyle}",
                string.IsNullOrWhiteSpace(p.MealPreference)     ? null : $"- Meal preference: {p.MealPreference}",
                p.TripDurationMin.HasValue && p.TripDurationMax.HasValue
                                                                 ? $"- Preferred trip duration: {p.TripDurationMin}–{p.TripDurationMax} days" : null,
                string.IsNullOrWhiteSpace(p.TripPace)           ? null : $"- Trip pace: {p.TripPace}",
                string.IsNullOrWhiteSpace(p.TravelStyles)       ? null : $"- Travel styles: {p.TravelStyles}",
                string.IsNullOrWhiteSpace(p.BudgetRange)        ? null : $"- Budget range: {p.BudgetRange}",
                string.IsNullOrWhiteSpace(p.TravelCompanions)   ? null : $"- Travelling with: {p.TravelCompanions}",
                string.IsNullOrWhiteSpace(p.TripMotivation)     ? null : $"- Trip motivation: {p.TripMotivation}",
                string.IsNullOrWhiteSpace(p.ClimatePreference)  ? null : $"- Preferred climate: {p.ClimatePreference}",
                string.IsNullOrWhiteSpace(p.Transport)          ? null : $"- Getting around: {p.Transport}",
                string.IsNullOrWhiteSpace(p.DietaryNeeds)       ? null : $"- Dietary needs: {p.DietaryNeeds}",
                string.IsNullOrWhiteSpace(p.Bio)                ? null : $"- Traveller bio: {p.Bio}",
            }
            .Where(l => l != null);

            var preferences = prefLines.Any()
                ? string.Join("\n", prefLines)
                : "No specific preferences set — suggest diverse, universally appealing destinations.";

            string likedBlock = likedNames.Any()
                ? $"\n\nThe traveller LIKED these destinations — propose new places with a similar character:\n- {string.Join("\n- ", likedNames)}"
                : "";
            string dislikedBlock = dislikedNames.Any()
                ? $"\n\nThe traveller DISLIKED these — avoid places with a similar character:\n- {string.Join("\n- ", dislikedNames)}"
                : "";
            string excludeBlock = excludeNames.Any()
                ? $"\n\nDo NOT suggest any of these (already seen): {string.Join("; ", excludeNames)}"
                : "";

            return $"""
                You are a travel recommendation engine generating a CANDIDATE POOL
                that will be re-ranked downstream by an embedding-based recommender.
                Generate exactly {count} distinct destination candidates.

                RULES:
                - Each reason must reference at least one of the user's preferences or liked destinations — make it feel personal.
                - If the user stated a climate or dietary preference, honour it; otherwise vary climates freely.
                - Give a broad, varied pool: mix short-haul and mid-haul, and span several categories. Avoid near-duplicates.
                - Strongly favour destinations resembling the LIKED list and steer away from the DISLIKED list.
                - Never repeat any destination in the exclusion list. Every candidate must be a NEW city.
                - Avoid Paris, Rome, and London.
                - Category must be exactly one of: Mediterranean, City break, Nature, Island, Desert,
                  Mountain, Cultural, Coastal, Warm escape.
                - Provide exactly 3 tags per destination, each chosen ONLY from this list:
                  Adventure, Cultural, Food & Drink, Nature, Nightlife, Wellness, Shopping, Beach,
                  Art & Architecture, Budget-friendly, Luxury, Romantic, Family-friendly, Off the beaten path.
                - Reason must be one sentence, maximum 25 words.

                USER PREFERENCES:
                {preferences}{likedBlock}{dislikedBlock}{excludeBlock}
                """;
        }

        private static void ApplyStrictRequirements(JsonSchema schema)
        {
            if (schema.Type.HasFlag(JsonObjectType.Object))
            {
                schema.AllowAdditionalProperties = false;
                foreach (var prop in schema.ActualProperties)
                {
                    if (!schema.RequiredProperties.Contains(prop.Key))
                        schema.RequiredProperties.Add(prop.Key);
                    ApplyStrictRequirements(prop.Value.ActualSchema);
                }
            }
            else if (schema.Type.HasFlag(JsonObjectType.Array) && schema.Item != null)
            {
                ApplyStrictRequirements(schema.Item.ActualSchema);
            }
        }
    }
}