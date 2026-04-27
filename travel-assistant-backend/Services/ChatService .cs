using OpenAI.Chat;
using System.Text.Json;
using travel_assistant_backend.DTOs.Chat;
using travel_assistant_backend.Services.Interfaces;

namespace travel_assistant_backend.Services
{
    public class ChatService : IChatService
    {
        private readonly ChatClient _chatClient;

        private const string TripSystemPrompt = """
            You are a professional travel planner.
    
            CRITICAL RULES:
            1. A valid trip requires BOTH a specific Destination AND a specific Number of Days.
            2. If the destination is a country, and not a specific city in that country plan a circuit with places from the whole country.
            3. If the user provides a destination (e.g., "Paris") but NO number of days:
               - Set 'isPlanComplete' to false.
               - Set 'assistantMessage' to "Please tell me how many days you would like to stay in [Destination]."
               - Leave 'tripDetails' as an empty object/null.
            4. ONLY when you have both Destination and Number of Days:
               - Set 'isPlanComplete' to true.
               - Generate the full 'tripDetails' JSON.
            5. Do not provide "sample" itineraries in the chat text. Only use the structured JSON for itineraries.
            """;

        public ChatService(ChatClient chatClient)
        {
            _chatClient = chatClient;
        }

        public async Task<GenerateTripResult> GenerateTripAsync(IReadOnlyList<ChatMessage> messages, CancellationToken cancellationToken = default)
        {
            var settings = new NJsonSchema.Generation.SystemTextJsonSchemaGeneratorSettings
            {
                SerializerOptions = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                },
                SchemaType = NJsonSchema.SchemaType.OpenApi3,
                DefaultReferenceTypeNullHandling = NJsonSchema.Generation.ReferenceTypeNullHandling.NotNull
            };

            var schema = NJsonSchema.JsonSchema.FromType(typeof(GenerateTripResult), settings);

            ApplyOpenAIStrictRequirements(schema);

            string schemaJson = schema.ToJson();

            ChatCompletionOptions options = new()
            {
                ResponseFormat = ChatResponseFormat.CreateJsonSchemaFormat(
                jsonSchemaFormatName: "trip_planning_result",
                jsonSchema: BinaryData.FromString(schemaJson),
                jsonSchemaIsStrict: true)
            };

            var messageHistory = new List<ChatMessage>
            {
                new SystemChatMessage(TripSystemPrompt)
            };
            messageHistory.AddRange(messages);

            try
            {

                ChatCompletion completion = await _chatClient.CompleteChatAsync(messageHistory, options, cancellationToken);

                string jsonResponse = completion.Content[0].Text; 

                Console.WriteLine($"AI Raw Response: {jsonResponse}");

                var result = JsonSerializer.Deserialize<GenerateTripResult>(jsonResponse, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return result ?? throw new Exception("AI returned a null trip plan.");
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to generate trip: {ex.Message}", ex);
            }

        }

        private void ApplyOpenAIStrictRequirements(NJsonSchema.JsonSchema schema)
        {
            if (schema.Type.HasFlag(NJsonSchema.JsonObjectType.Object))
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
            else if (schema.Type.HasFlag(NJsonSchema.JsonObjectType.Array) && schema.Item != null)
            {
                ApplyOpenAIStrictRequirements(schema.Item.ActualSchema);
            }
        }
    }
}
