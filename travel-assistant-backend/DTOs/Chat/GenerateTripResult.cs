using travel_assistant_backend.DTOs.Trip;

namespace travel_assistant_backend.DTOs.Chat
{
    public class GenerateTripResult
    {
        public bool IsPlanComplete { get; set; }

        public string AssistantMessage { get; set; }

        public TripPlan TripDetails { get; set; }
    }
}
