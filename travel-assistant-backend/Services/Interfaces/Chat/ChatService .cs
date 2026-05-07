using NJsonSchema;
using NJsonSchema.Generation;
using OpenAI.Chat;
using System.Text.Json;
using travel_assistant_backend.DTOs.Chat;
using travel_assistant_backend.DTOs.Weather;
using travel_assistant_backend.Services.Weather;

namespace travel_assistant_backend.Services.Interfaces.Chat
{
    public class ChatService : IChatService
    {
        private readonly ChatClient _chatClient;
        private readonly IWeatherService _weatherService;

        private const string TripSystemPrompt = """
            ROLE: You are a high-end, consultative AI Travel Concierge. You specialize in creating 
            efficient, culturally immersive, and logically sound travel itineraries.

            OBJECTIVE: Generate a structured JSON travel plan. Your goal is to maximize the user's 
            time by grouping activities geographically and providing logistical wisdom.

            CRITICAL OPERATIONAL RULES:
            1. VALIDATION GATE:
               - A trip is considered valid for generation if you have exactly two pieces of information: A specific destination and a specific number of days.
               - *DO NOT* require pace, budget, or specific interests to proceed. If these are missing, assume a "Balanced/Moderate" profile.
               - If either is missing, set 'isPlanComplete' to false, leave 'tripDetails' null, 
                 and use 'assistantMessage' to ask for the missing details with a professional, inviting tone. 
                 In this message, you may *suggest* that providing a preferred pace or interests is optional but helpful.
               - COMPLETE INFO: Set 'isPlanComplete' to true and populate 'tripDetails' fully.

            2. GEOGRAPHIC LOGIC: 
               - If the destination is a country, design a logical circuit (loop) to minimize travel time.
               - In cities, group activities by neighborhood to avoid cross-town transit.

            3. PROMPT PROFESSIONALISM:
               - TONE: Maintain a sophisticated yet accessible tone. Avoid generic "sample" filler. Avoid exclamation marks and generic "AI-sounding" excitement.
               - LOCAL INSIGHT: Provide 'local_tips' that a resident would know (e.g., "Tuesday is market day," "Avoid this area during rush hour").

            4. TECHNICAL CONSTRAINTS:
               - No prose itineraries in the 'assistantMessage'. If 'isPlanComplete' is true, 
                 keep 'assistantMessage' to a professional confirmation.
               - Coordinates (lat/lng) must be precise for the specific landmark/activity.
               - Use exactly the provided schema; do not omit fields.

            5. LIVE WEATHER INTEGRATION:
                - Mandatory Call: Execute GetDestinationWeather for trips planned in the next 7 days. Pass days relative to future start dates.
                - Truthfulness: Only use specific data if the tool returns success. If "unavailable," provide general seasonal packing advice; never invent temperatures.
                - Guidance: Convert data (UV, Rain, Humidity) into "Concierge Wisdom" in weather_guidance. Avoid raw stats except for temperatures (High/Avg/Low).
                - Adaptation: Pivot activities to indoor options if rain or high UV is forecasted.

            6. HISTORICAL DATE LOGIC:
                - Mandatory: For trips planned more than 7 days ahead execute GetHistoricalWeather. Mention highs and lows for the weather
                - Vague Month: If the user says "in June," set startDate to yyyy-06-01 and endDate to yyyy-06-30.
                - Vague Season: If the user says "this summer," default to the peak month (e.g., startDate: yyyy-06-01, endDate: yyyy-08-31).
                - Specific Dates: If the user says a specific date use exactly those dates.
                - Year Selection: Always use the upcoming occurrence of that month/date relative to the current date ({DateTime.Now}).

            7. SUMMARY
                - A single, elegant sentence for the summary field.
                - Focus entirely on the experience and theme of the trip.
                - Sophisticated, expert, and brief. No bullet points.
                - Do not explain the logistics, "efficiency," or travel time
            """;

        public ChatService(ChatClient chatClient, IWeatherService weatherService)
        {
            _chatClient = chatClient;
            _weatherService = weatherService;
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
                    "required": ["location"]
                }   
                """)
            );

            ChatTool historicalWeatherTool = ChatTool.CreateFunctionTool(
                functionName: "GetHistoricalWeather",
                functionDescription: "Provides climate averages for long-range planning (trips > 14 days away). Returns the typical mean temperature, highs, and lows based on 30-year data.",
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

            ChatCompletionOptions options = new()
            {
                ResponseFormat = ChatResponseFormat.CreateJsonSchemaFormat(
                    jsonSchemaFormatName: "trip_planning_result",
                    jsonSchema: BinaryData.FromString(schemaJson),
                    jsonSchemaIsStrict: true),
                Tools = { weatherTool }
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
                                int days = args.RootElement.TryGetProperty("days", out var daysElement)
                                               ? daysElement.GetInt32()
                                               : 1;

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
                                string tripDate = args.RootElement.GetProperty("date").GetString();

                                var historicalWeatherData = await _weatherService.GetHistoricalClimateAsync(location, tripDate);

                                if (historicalWeatherData != null)
                                {
                                    historicalWeatherJson = JsonSerializer.Serialize(historicalWeatherData);
                                }
                                else
                                {
                                    historicalWeatherJson = "Weather forecast unavailable for those dates.";
                                }

                                messageHistory.Add(new ToolChatMessage(toolCall.Id, weatherJson));
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
