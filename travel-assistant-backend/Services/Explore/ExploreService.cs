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

        public async Task<ExploreSuggestionsDTO> GenerateSuggestionsAsync(
            UserPreferencesDTO preferences,
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
                ResponseFormat = ChatResponseFormat.CreateJsonSchemaFormat(
                    jsonSchemaFormatName: "explore_suggestions",
                    jsonSchema: BinaryData.FromString(schema.ToJson()),
                    jsonSchemaIsStrict: true)
            };

            var messages = new List<ChatMessage>
            {
                new SystemChatMessage(BuildSystemPrompt(preferences)),
                new UserChatMessage("Generate 6 destination suggestions based on the user preferences above.")
            };

            var completion = await _chatClient.CompleteChatAsync(messages, options, cancellationToken);
            var json = completion.Value.Content[0].Text;

            var result = JsonSerializer.Deserialize<ExploreSuggestionsDTO>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return result ?? new ExploreSuggestionsDTO();
        }

        private static string BuildSystemPrompt(UserPreferencesDTO p)
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

            return $"""
                You are a travel recommendation engine.
                Generate exactly 6 personalised destination suggestions.
 
                RULES:
                - Each reason must reference at least one of the user's preferences — make it feel personal.
                - If the user stated a climate or dietary preference, honour it; otherwise vary climates freely.
                - Vary the results: mix short-haul and mid-haul, different styles.
                - Avoid Paris, Rome, and London.
                - Category must be one of: Mediterranean, City break, Nature, Island, Desert, Mountain, Cultural, Coastal, Warm escape.
                - Provide exactly 3 tags per destination.
                - Reason must be one sentence, maximum 25 words.
 
                USER PREFERENCES:
                {preferences}
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