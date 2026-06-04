using NJsonSchema;
using NJsonSchema.Generation;
using OpenAI.Chat;
using System.Text.Json;
using travel_assistant_backend.DTOs.Quiz;
using travel_assistant_backend.DTOs.UserPreference;

namespace travel_assistant_backend.Services.Quiz
{
    public class QuizService : IQuizService
    {
        private readonly ChatClient _chatClient;

        public QuizService(ChatClient chatClient)
        {
            _chatClient = chatClient;
        }

        public async Task<QuizResultDTO> ProcessQuizAsync(
            QuizAnswersDTO answers,
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

            var schema = JsonSchema.FromType<QuizStructuredResult>(schemaSettings);
            ApplyStrictRequirements(schema);

            var options = new ChatCompletionOptions
            {
                ResponseFormat = ChatResponseFormat.CreateJsonSchemaFormat(
                    jsonSchemaFormatName: "quiz_result",
                    jsonSchema: BinaryData.FromString(schema.ToJson()),
                    jsonSchemaIsStrict: true)
            };

            var answersText = string.Join("\n", answers.Answers.Select(kv => $"- {kv.Key}: {kv.Value}"));

            var messages = new List<ChatMessage>
            {
                new SystemChatMessage("""
                    You are a travel personality analyst.
                    Based on the user's quiz answers, infer their traveler archetype and full travel preferences.

                    RULES:
                    - archetypeName: short evocative name e.g. 'The Luxury Explorer', 'The Solo Wanderer', 'The Budget Adventurer'
                    - archetypeDescription: 2-3 sentences written directly to the user (use 'you'). Make it feel personal and insightful.
                    - archetypeEmoji: single emoji that best represents this archetype
                    - bio: 1-2 sentence travel bio written in first person, inferred from their answers
                    - tripPace must be exactly one of: Relaxed, Balanced, Intensive
                    - budgetRange must be exactly one of: Budget, Mid-range, Comfort, Luxury
                    - travelCompanions must be exactly one of: Solo, Couple, Family, Friends
                    - travelStyles: comma-separated subset of: Adventure, Cultural, Food & Drink, Nature, Nightlife, Wellness, Shopping
                    - tripDurationMin and tripDurationMax: infer a realistic range in days based on the duration answer
                    """),
                new UserChatMessage($"Quiz answers:\n{answersText}")
            };

            var completion = await _chatClient.CompleteChatAsync(messages, options, cancellationToken);
            var json = completion.Value.Content[0].Text;

            var structured = JsonSerializer.Deserialize<QuizStructuredResult>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? new QuizStructuredResult();

            return new QuizResultDTO
            {
                ArchetypeName = structured.ArchetypeName,
                ArchetypeDescription = structured.ArchetypeDescription,
                InferredPreferences = new UserPreferencesDTO
                {
                    Bio = structured.InferredPreferences.Bio,
                    AccommodationStyle = structured.InferredPreferences.AccommodationStyle,
                    MealPreference = structured.InferredPreferences.MealPreference,
                    TripDurationMin = structured.InferredPreferences.TripDurationMin,
                    TripDurationMax = structured.InferredPreferences.TripDurationMax,
                    TripPace = structured.InferredPreferences.TripPace,
                    TravelStyles = structured.InferredPreferences.TravelStyles,
                    BudgetRange = structured.InferredPreferences.BudgetRange,
                    TravelCompanions = structured.InferredPreferences.TravelCompanions,
                }
            };
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