namespace TravelAssistant.DTOs.Trip
{
    public class TripPlanResponseDTO
    {
        public string Intent { get; set; } = "create_trip";
        public string Summary { get; set; } = string.Empty;
        public TripDTO Trip { get; set; } = new();
        public List<string> FollowUpSuggestions { get; set; } = [];
    }
}