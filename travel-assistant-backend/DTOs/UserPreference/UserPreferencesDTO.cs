using System.ComponentModel.DataAnnotations;

namespace travel_assistant_backend.DTOs.UserPreference
{
    public class UserPreferencesDTO
    {
        public string? Bio { get; set; }
        public string? HomeCity { get; set; }
        public int? TripDurationMin { get; set; }
        public int? TripDurationMax { get; set; }
        public string? TripPace { get; set; }
        public string? TravelStyles { get; set; }
        public string? TravelCompanions { get; set; }
        public string? ClimatePreference { get; set; }
        public string? TripMotivation { get; set; }
        public string? Transport { get; set; }
        public string? PreferredSetting { get; set; }
        public string? PlanningStyle { get; set; }
        public string? PreferredRegions { get; set; }
        public string? TravelFrequency { get; set; }
        public string? ArchetypeName { get; set; }
        public string? ArchetypeDescription { get; set; }
    }
}
