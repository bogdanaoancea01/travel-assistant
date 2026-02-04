using System.Text.Json;
using OpenAI;
using OpenAI.Chat;
using TravelAssistant.DTOs.Chat;
using TravelAssistant.DTOs.Trip;
using TravelAssistant.Services.Interfaces;

namespace TravelAssistant.Services
{
    public class TripService : ITripService
    {
        private readonly OpenAIClient _openAi;

        public TripService(OpenAIClient openAi)
        {
            _openAi = openAi;
        }

        public async Task<TripPlanResponseDTO> GenerateTripAsync(
            IReadOnlyList<ChatMessageDTO> messages,
            CancellationToken cancellationToken = default)
        {
            var chat = _openAi.GetChatClient("gpt-4o-mini");

            var chatMessages = new List<ChatMessage>
            {
                new SystemChatMessage(TripSystemPrompt)
            };

            foreach (var msg in messages)
            {
                chatMessages.Add(new UserChatMessage(msg.Content));
            }

            var response = await chat.CompleteChatAsync(
                chatMessages,
                cancellationToken: cancellationToken
            );

            var json = response.Value.Content[0].Text;

            var trip = JsonSerializer.Deserialize<TripPlanResponseDTO>(
                json,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

            if (trip == null)
                throw new Exception("Invalid trip response from AI.");

            return trip;
        }

        private const string TripSystemPrompt = """
        You are an AI travel assistant similar to Mindtrip.ai.

        You create realistic, well-paced, human-friendly travel itineraries.
        Assume the user wants a practical plan they could actually follow.

        Return ONLY valid JSON matching this schema.
        Do not include markdown, explanations, or extra text.

        Rules:
        - Always use real cities and real attractions.
        - Latitude and longitude must be realistic coordinates.
        - Balance days to avoid overloading.
        - Prefer geographic proximity when ordering activities.
        - Vary activity types (culture, food, nature, relaxation).
        - Use concise, friendly language.

        Schema:
        {
          "intent": "create_trip",
          "summary": "1–2 sentence overview of the trip in natural language.",
          "trip": {
            "destination": {
              "city": "",
              "country": "",
              "lat": 0,
              "lng": 0
            },
            "days": 0,
            "travelStyle": "relaxed | balanced | packed",
            "itinerary": [
              {
                "day": 1,
                "title": "Short descriptive theme for the day",
                "activities": [
                  {
                    "name": "",
                    "type": "attraction | food | nature | museum | shopping | transport | hotel",
                    "description": "Brief, helpful description",
                    "estimatedDurationHours": 0,
                    "lat": 0,
                    "lng": 0
                  }
                ]
              }
            ]
          },
          "followUpSuggestions": [
            "Add restaurants",
            "Make it more relaxed",
            "Add a day trip nearby"
          ]
        }
        """;
    }
}