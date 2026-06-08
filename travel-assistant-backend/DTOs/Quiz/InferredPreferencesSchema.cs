namespace travel_assistant_backend.DTOs.Quiz
{
    public class InferredPreferencesSchema
    {
        public string Bio { get; set; } = string.Empty;
        public string AccommodationStyle { get; set; } = string.Empty;
        public string MealPreference { get; set; } = string.Empty;
        public int TripDurationMin { get; set; }
        public int TripDurationMax { get; set; }
        public string TripPace { get; set; } = string.Empty;
        public string TravelStyles { get; set; } = string.Empty;
        public string BudgetRange { get; set; } = string.Empty;
        public string TravelCompanions { get; set; } = string.Empty;
        public string DietaryNeeds { get; set; } = string.Empty;
        public string ClimatePreference { get; set; } = string.Empty;
        public string TripMotivation { get; set; } = string.Empty;
        public string Transport { get; set; } = string.Empty;
        public string HomeCity { get; set; } = string.Empty;
    }
}
