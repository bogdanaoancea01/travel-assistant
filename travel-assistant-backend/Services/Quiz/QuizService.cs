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
                    You are a travel personality analyst for an AI travel assistant.
                    From the user's quiz answers you must (1) build a complete, structured travel
                    preference profile and (2) name and describe their traveller archetype.

                    GROUNDING — THE MOST IMPORTANT RULE:
                    Use ONLY what the answers actually state. Never invent facts about the user.
                    - Map each answer to the closest allowed value below. Do not add preferences
                      the answers do not support.
                    - If an answer for a field is missing, return an empty string for that field
                      (or 0 for the duration numbers). Do NOT guess.
                    - dietaryNeeds is safety-critical: copy ONLY what the user selected. If they
                      chose "No restrictions" or said nothing, return "No restrictions". Never
                      invent allergies or restrictions.
                    - homeCity: copy the user's stated home/departure city verbatim if present,
                      otherwise return an empty string. Never invent a city.

                    ALLOWED VALUES (normalise the user's wording to exactly one of these):
                    - tripPace: Relaxed | Balanced | Intensive
                    - budgetRange: Budget | Mid-range | Comfort | Luxury
                    - travelCompanions: Solo | Couple | Family | Friends
                    - climatePreference: Warm & sunny | Mild & temperate | Cool & crisp | Cold & snowy | No preference
                    - tripMotivation: Recharge & relax | Adventure & adrenaline | Discover & learn | Connect & celebrate
                    - transport: Rental car / road trip | Public transport | Walkable & compact | No preference
                    - travelStyles: comma-separated subset of:
                      Adventure, Cultural, Food & Drink, Nature, Nightlife, Wellness, Shopping, Beach, Art & Architecture
                    - accommodationStyle: a short phrase grounded in their lodging answer
                      (e.g. "Hostels & guesthouses", "Comfortable mid-range hotels",
                      "Boutique & character stays", "Luxury resorts", "Apartments & local rentals").
                    - mealPreference: a short phrase grounded in their food answer
                      (e.g. "Street food & local spots", "Mix of casual and nice meals",
                      "Fine dining & reservations", "Mostly self-catering").
                    - tripDurationMin / tripDurationMax: integer day range parsed from the duration answer.

                    FREE-TEXT FIELDS:
                    - archetypeName: short, evocative title, e.g. "The Slow Wanderer",
                      "The Culture Seeker", "The Budget Adventurer", "The Luxury Epicurean".
                    - archetypeDescription: 2-3 sentences written directly to the user ("you").
                      Personal and insightful; reflect their actual answers.
                    - bio: 1-2 sentence first-person travel bio, grounded in their answers.
                    """),
                new UserChatMessage($"Quiz answers:\n{answersText}")
            };

            var completion = await _chatClient.CompleteChatAsync(messages, options, cancellationToken);
            var json = completion.Value.Content[0].Text;

            var structured = JsonSerializer.Deserialize<QuizStructuredResult>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }) ?? new QuizStructuredResult();

            var inferred = structured.InferredPreferences;

            return new QuizResultDTO
            {
                ArchetypeName = structured.ArchetypeName,
                ArchetypeDescription = structured.ArchetypeDescription,
                InferredPreferences = new UserPreferencesDTO
                {
                    Bio = inferred.Bio,
                    AccommodationStyle = inferred.AccommodationStyle,
                    MealPreference = inferred.MealPreference,
                    TripDurationMin = inferred.TripDurationMin,
                    TripDurationMax = inferred.TripDurationMax,
                    TripPace = inferred.TripPace,
                    TravelStyles = inferred.TravelStyles,
                    BudgetRange = inferred.BudgetRange,
                    TravelCompanions = inferred.TravelCompanions,
                    DietaryNeeds = inferred.DietaryNeeds,
                    ClimatePreference = inferred.ClimatePreference,
                    TripMotivation = inferred.TripMotivation,
                    Transport = inferred.Transport,
                    HomeCity = string.IsNullOrWhiteSpace(inferred.HomeCity) ? null : inferred.HomeCity,
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
