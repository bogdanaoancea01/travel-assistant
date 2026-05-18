using NJsonSchema;
using NJsonSchema.Generation;
using OpenAI.Chat;
using System.Text.Json;
using travel_assistant_backend.DTOs.Chat;
using travel_assistant_backend.Services.Geocoding;
using travel_assistant_backend.Services.Weather;

namespace travel_assistant_backend.Services.Interfaces.Chat
{
    public class ChatService : IChatService
    {
        private readonly ChatClient _chatClient;
        private readonly IWeatherService _weatherService;
        private readonly IGeocodingService _geocodingService;

        private const string TripSystemPrompt = """
            ROLE: You are a high-end AI Travel Concierge. Generate structured JSON travel plans that are geographically logical and culturally immersive.

            EXECUTION ORDER (mandatory):
            1. Validate input → 2. Call weather tool → 3. Generate itinerary → 4. Populate all schema fields.

            RULES:

            1. VALIDATION
               - Required: destination + number of days. If either is missing, set isPlanComplete: false, tripDetails: null, and ask professionally. Pace/budget/interests are optional; default to "Balanced/Moderate" if absent.

            2. GEOGRAPHY
               - Country trips: design a logical circuit to minimize travel time.
               - City trips: group activities by neighborhood.

            3. TONE & TIPS
               - Sophisticated, accessible. No exclamation marks, no generic filler.
               - local_tips must reflect genuine resident knowledge.

            4. SCHEMA
               - assistantMessage is a brief confirmation only when isPlanComplete: true.
               - Coordinates must be precise. If uncertain, use the nearest district center and flag it.
               - Never omit schema fields.
               - Activity names must be short and concise — maximum 4 words (e.g. "Fontana di Trevi", "Vatican Museums", "Trastevere dinner"). Never include descriptions, conditions, or parentheticals in the name field.
               - For each activity, provide a full address in the format "Street, Postal Code, City, Country". This is used for geocoding — be as precise as possible.
               - For every activity, call GeocodeActivity with the attraction name and its full address (street, postal code, city, country) to obtain exact coordinates.
               - Use the returned lat/lng directly in the activity's location field.
               - If GeocodeActivity returns an error, omit the location rather than inventing coordinates.
               - Call GeocodeActivity before finalizing the itinerary — never hardcode or estimate coordinates.
               - Set weatherDependent: true for any activity that is significantly impacted by rain or high UV.

            5. LIVE WEATHER (startDate within 7 days of today)
               - Call GetDestinationWeather first. Pass location and number of trip days.
               - On success: translate UV, rain, humidity into concierge advice; include temp highs/lows. Pivot outdoor activities indoors if rain or UV > 6.
               - On failure: give general seasonal guidance, clearly framed as such. Never invent data.

            6. HISTORICAL WEATHER (startDate more than 7 days from today)
               - Call GetHistoricalWeather first. Pass location, startDate, endDate (yyyy-MM-dd).
               - Vague dates: "in June" → yyyy-06-01 / yyyy-06-30. "This summer" → yyyy-06-01 / yyyy-08-31. Always use the next upcoming occurrence.
               - On success: frame output as historical averages, not a forecast.
               - On failure: same fallback as Rule 5.

            7. SUMMARY
               - One elegant sentence. Experience and theme only — no logistics, no travel times.
            """;

        public ChatService(ChatClient chatClient, IWeatherService weatherService, IGeocodingService geocodingService)
        {
            _chatClient = chatClient;
            _weatherService = weatherService;
            _geocodingService = geocodingService;
        }

        public async Task<GenerateTripResult> GenerateTripAsync(IReadOnlyList<ChatMessage> messages, CancellationToken cancellationToken = default)
        {
            bool requiresAction = true;
            string jsonResponse = "";
            string weatherJson = "";
            string historicalWeatherJson = "";

            var settings = new SystemTextJsonSchemaGeneratorSettings
            {
                SerializerOptions = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                },
                SchemaType = SchemaType.OpenApi3,
                DefaultReferenceTypeNullHandling = ReferenceTypeNullHandling.NotNull
            };

            var schema = JsonSchema.FromType(typeof(GenerateTripResult), settings);
            ApplyOpenAIStrictRequirements(schema);
            string schemaJson = schema.ToJson();

            ChatTool weatherTool = ChatTool.CreateFunctionTool(
                functionName: "GetDestinationWeather",
                functionDescription: "Get the weather forecast for a destination. Use 'days' to look ahead for future trips. Provide accurate packing and activity or logistical advice for the proposed itinerary.",
                functionParameters: BinaryData.FromString("""
                {
                    "type": "object",
                    "properties": {
                        "location": { "type": "string", "description": "The city and country" },
                        "days": { "type": "integer", "description": "Number of days in the future" }
                    },
                    "required": ["location", "days"]
                }   
                """)
            );

            ChatTool historicalWeatherTool = ChatTool.CreateFunctionTool(
                functionName: "GetHistoricalWeather",
                functionDescription: "Provides climate averages for long-range planning (trips > 7 days away). Returns the typical mean temperature, highs, and lows based on 30-year data.",
                functionParameters: BinaryData.FromString("""
                {
                    "type": "object",
                    "properties": {
                        "location": { "type": "string", "description": "City and Country" },
                        "startDate": { "type": "string", "description": "First day of the month (yyyy-MM-01)" },
                        "endDate": { "type": "string", "description": "Last day of the month (yyyy-MM-30/31)" }
                    },
                    "required": ["location", "startDate", "endDate"]
                }
                """)
            );

            ChatTool geocodeTool = ChatTool.CreateFunctionTool(
                functionName: "GeocodeActivity",
                functionDescription: "Get the exact latitude and longitude for a specific attraction or place. Call this for every activity in the itinerary before finalizing the response.",
                functionParameters: BinaryData.FromString("""
                {
                    "type": "object",
                    "properties": {
                        "name":    { "type": "string", "description": "Name of the attraction or place" },
                        "address": { "type": "string", "description": "Full address: street, postal code, city, country" }
                    },
                    "required": ["name", "address"]
                }
                """)
            );

            ChatCompletionOptions options = new()
            {
                ResponseFormat = ChatResponseFormat.CreateJsonSchemaFormat(
                    jsonSchemaFormatName: "trip_planning_result",
                    jsonSchema: BinaryData.FromString(schemaJson),
                    jsonSchemaIsStrict: true),
                Tools = { weatherTool, historicalWeatherTool, geocodeTool }
            };

            var messageHistory = new List<ChatMessage>
            {
                new SystemChatMessage(TripSystemPrompt)
            };
            messageHistory.AddRange(messages);

            try
            {
                do
                {
                    requiresAction = false;
                    ChatCompletion completion = await _chatClient.CompleteChatAsync(messageHistory, options, cancellationToken);

                    if (completion.FinishReason == ChatFinishReason.ToolCalls)
                    {
                        messageHistory.Add(new AssistantChatMessage(completion));

                        foreach (var toolCall in completion.ToolCalls)
                        {
                            if (toolCall.FunctionName == "GetDestinationWeather")
                            {
                                using var args = JsonDocument.Parse(toolCall.FunctionArguments);
                                string location = args.RootElement.GetProperty("location").GetString();
                                int days = args.RootElement.GetProperty("days").GetInt32();

                                var weatherData = await _weatherService.GetWeatherAsync(location, days);

                                if (weatherData != null)
                                {
                                    weatherJson = JsonSerializer.Serialize(weatherData);
                                }
                                else
                                {
                                    weatherJson = "Weather forecast unavailable for those dates.";
                                }

                                messageHistory.Add(new ToolChatMessage(toolCall.Id, weatherJson));
                                requiresAction = true;

                                Console.WriteLine($"AI requested forecast for: {location} for {days} days.");
                            }

                            if (toolCall.FunctionName == "GetHistoricalWeather")
                            {
                                using var args = JsonDocument.Parse(toolCall.FunctionArguments);
                                string location = args.RootElement.GetProperty("location").GetString();
                                string startDate = args.RootElement.GetProperty("startDate").GetString();
                                string endDate = args.RootElement.GetProperty("endDate").GetString();

                                var historicalWeatherData = await _weatherService.GetHistoricalClimateAsync(location, startDate, endDate);

                                if (historicalWeatherData != null)
                                {
                                    historicalWeatherJson = JsonSerializer.Serialize(historicalWeatherData);
                                }
                                else
                                {
                                    historicalWeatherJson = "Weather forecast unavailable for those dates.";
                                }

                                messageHistory.Add(new ToolChatMessage(toolCall.Id, historicalWeatherJson));
                                requiresAction = true;
                            }

                            if (toolCall.FunctionName == "GeocodeActivity")
                            {
                                using var args = JsonDocument.Parse(toolCall.FunctionArguments);

                                string name = args.RootElement.GetProperty("name").GetString() ?? "";
                                string address = args.RootElement.TryGetProperty("address", out var addrEl)
                                                     ? addrEl.GetString() ?? ""
                                                     : "";

                                Console.WriteLine($"[Geocode] Requested: {name} | {address}");

                                // Nominatim rate limit: 1 request per second
                                await Task.Delay(1000, cancellationToken);

                                var coords = await _geocodingService.GeocodeAsync(name, address);

                                string geocodeResult = coords != null
                                    ? JsonSerializer.Serialize(new { lat = coords.Value.Lat, lng = coords.Value.Lng })
                                    : JsonSerializer.Serialize(new { error = "Coordinates not found for this location." });

                                Console.WriteLine($"[Geocode] Result for '{name}': {geocodeResult}");

                                messageHistory.Add(new ToolChatMessage(toolCall.Id, geocodeResult));
                                requiresAction = true;
                            }
                        }
                    }
                    else
                    {
                        jsonResponse = completion.Content[0].Text;
                    }

                } while (requiresAction);

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
