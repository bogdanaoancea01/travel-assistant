namespace travel_assistant_backend.DTOs.Trip
{
    public class TripPlan
    {
        public TripDestination Destination { get; set; }
        public int NumberOfDays { get; set; }
        public string Summary { get; set; }
        public List<TripDay> Itinerary { get; set; }
    }
}
