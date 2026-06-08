namespace travel_assistant_backend.DTOs.Trip
{
    public class TripPlan
    {
        public TripDestination Destination { get; set; }
        public int NumberOfDays { get; set; }
        public string Summary { get; set; }
        public string WeatherGuidance { get; set; }
        public double WeatherHighC { get; set; }
        public double WeatherLowC { get; set; }
        public int WeatherRainChancePct { get; set; }
        public double WeatherUvIndex { get; set; }
        public string WeatherCondition { get; set; }
        public string WeatherDateRange { get; set; }
        public string Currency { get; set; }
        public double EstimatedTotalCost { get; set; }
        public string BudgetSummary { get; set; }
        public List<string> PackingList { get; set; }
        public List<string> TripTags { get; set; }
        public List<TripDay> Itinerary { get; set; }
    }
}
