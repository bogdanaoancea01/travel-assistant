namespace TravelAssistant.DTOs.Trip
{
    public class TripDTO
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public DestinationDTO Destination { get; set; } = new();
        public int Days { get; set; }
        public List<DayPlanDTO> Itinerary { get; set; } = [];
    }
}