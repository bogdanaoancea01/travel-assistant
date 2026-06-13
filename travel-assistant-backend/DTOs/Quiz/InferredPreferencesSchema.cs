namespace travel_assistant_backend.DTOs.Quiz
{
    public class InferredPreferencesSchema
    {
        public string Bio { get; set; } = string.Empty;
        public int TripDurationMin { get; set; }
        public int TripDurationMax { get; set; }
        public string TripPace { get; set; } = string.Empty;
        public string TravelStyles { get; set; } = string.Empty;
        public string TravelCompanions { get; set; } = string.Empty;
        public string ClimatePreference { get; set; } = string.Empty;
        public string TripMotivation { get; set; } = string.Empty;
        public string Transport { get; set; } = string.Empty;
        public string PreferredSetting { get; set; } = string.Empty;
        public string PlanningStyle { get; set; } = string.Empty;
        public string PreferredRegions { get; set; } = string.Empty;
        public string TravelFrequency { get; set; } = string.Empty;
        public string HomeCity { get; set; } = string.Empty;
    }
}
