namespace travel_assistant_backend.DTOs.UserPreference
{
    public class UserPreferencesDTO
    {
        public string? Bio { get; set; }
        public string? HomeCity { get; set; }
        public string? PreferredCurrency { get; set; }
        public string? PreferredAirportName { get; set; }
        public string? AccommodationStyle { get; set; }
        public string? MealPreference { get; set; }
        public int? TripDurationMin { get; set; }
        public int? TripDurationMax { get; set; }
        public string? TripPace { get; set; }
        public string? TravelStyles { get; set; }
        public string? BudgetRange { get; set; }
        public string? TravelCompanions { get; set; }
    }
}
