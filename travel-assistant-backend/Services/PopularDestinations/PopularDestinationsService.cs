using NJsonSchema;
using NJsonSchema.Generation;
using OpenAI.Chat;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using travel_assistant_backend.DTOs.PopularDestinations;
using travel_assistant_backend.Models;

namespace travel_assistant_backend.Services.PopularDestinations
{
    public class PopularDestinationsService : IPopularDestinationsService
    {
        private readonly AppDbContext _context;
        private readonly ChatClient _chatClient;

        private const string SystemPrompt = """
            You are a travel expert. Return 5 popular travel destinations around the world.
            For each destination provide:
            - city: the city name
            - country: the country name
            - durationDays: the recommended number of days to visit (integer)
            - prompt: a ready-to-use trip planning prompt in the format "Plan a {durationDays}-day trip to {city}, {country}"
            """;

        public PopularDestinationsService(AppDbContext context, ChatClient chatClient)
        {
            _context = context;
            _chatClient = chatClient;
        }

        public async Task<List<PopularDestination>> GenerateFromAIAsync(CancellationToken cancellationToken)
        {
            var settings = new SystemTextJsonSchemaGeneratorSettings
            {
                SerializerOptions = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                },
                SchemaType = SchemaType.OpenApi3,
                DefaultReferenceTypeNullHandling = ReferenceTypeNullHandling.NotNull
            };

            var schema = JsonSchema.FromType(typeof(PopularDestinationsResponse), settings);
            ApplyOpenAIStrictRequirements(schema);

            ChatCompletionOptions options = new()
            {
                ResponseFormat = ChatResponseFormat.CreateJsonSchemaFormat(
                    jsonSchemaFormatName: "popular_destinations",
                    jsonSchema: BinaryData.FromString(schema.ToJson()),
                    jsonSchemaIsStrict: true)
            };

            var messageHistory = new List<ChatMessage>
            {
                new SystemChatMessage(SystemPrompt)
            };

            try
            {
                ChatCompletion completion = await _chatClient.CompleteChatAsync(
                    messageHistory, options, cancellationToken);

                string jsonResponse = completion.Content[0].Text;
                Console.WriteLine($"[PopularDestinations] AI raw response: {jsonResponse}");

                var result = JsonSerializer.Deserialize<PopularDestinationsResponse>(
                    jsonResponse,
                    new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                if (result?.Destinations == null || result.Destinations.Count == 0)
                    throw new Exception("AI returned no destinations.");

                return result.Destinations.Select(d => new PopularDestination
                {
                    City = d.City,
                    Country = d.Country,
                    DurationDays = d.DurationDays,
                    Prompt = d.Prompt,
                    CreatedAt = DateTime.UtcNow
                }).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to generate destinations: {ex.Message}", ex);
            }
        }

        // Called on startup — generates via AI and saves to DB
        public async Task SeedAsync(CancellationToken cancellationToken = default)
        {
            var destinations = await GenerateFromAIAsync(cancellationToken);
            await SaveToDbAsync(destinations, cancellationToken);
            Console.WriteLine($"[PopularDestinations] Seeded {destinations.Count} destinations.");
        }

        // Returns 5 random destinations from DB
        public async Task<List<PopularDestinationDTO>> GetRandomAsync(CancellationToken cancellationToken = default)
        {
            var destinations = await _context.PopularDestinations
                .ToListAsync(cancellationToken);

            return destinations
                .GroupBy(d => d.City)
                .Select(g => g.First())
                .OrderBy(_ => Guid.NewGuid())
                .Take(5)
                .Select(MapToDTO)
                .ToList();
        }

        private async Task SaveToDbAsync(List<PopularDestination> destinations, CancellationToken cancellationToken)
        {
            var existingCities = _context.PopularDestinations
                .Select(d => d.City)
                .ToHashSet();

            var newDestinations = destinations
                .Where(d => !existingCities.Contains(d.City))
                .ToList();

            if (newDestinations.Count == 0) return;

            await _context.PopularDestinations.AddRangeAsync(newDestinations, cancellationToken);
            await _context.SaveChangesAsync(cancellationToken);
        }

        private static PopularDestinationDTO MapToDTO(PopularDestination d) => new()
        {
            City = d.City,
            Country = d.Country,
            DurationDays = d.DurationDays,
            Prompt = d.Prompt
        };

        private void ApplyOpenAIStrictRequirements(JsonSchema schema)
        {
            if (schema.Type.HasFlag(JsonObjectType.Object))
            {
                schema.AllowAdditionalProperties = false;

                foreach (var prop in schema.ActualProperties)
                {
                    if (!schema.RequiredProperties.Contains(prop.Key))
                    {
                        schema.RequiredProperties.Add(prop.Key);
                    }

                    ApplyOpenAIStrictRequirements(prop.Value.ActualSchema);
                }
            }
            else if (schema.Type.HasFlag(JsonObjectType.Array) && schema.Item != null)
            {
                ApplyOpenAIStrictRequirements(schema.Item.ActualSchema);
            }
        }
    }
}
