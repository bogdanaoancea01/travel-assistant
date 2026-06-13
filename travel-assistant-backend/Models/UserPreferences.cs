using System.ComponentModel.DataAnnotations;

namespace travel_assistant_backend.Models
{
    public class UserPreferences
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        [MaxLength(500)]
        public string? Bio { get; set; }

        [MaxLength(100)]
        public string? HomeCity { get; set; }
        public int? TripDurationMin { get; set; }
        public int? TripDurationMax { get; set; }

        [MaxLength(20)]
        public string? TripPace { get; set; }

        [MaxLength(200)]
        public string? TravelStyles { get; set; }

        [MaxLength(30)]
        public string? TravelCompanions { get; set; }

        [MaxLength(50)]
        public string? ClimatePreference { get; set; }

        [MaxLength(60)]
        public string? TripMotivation { get; set; }

        [MaxLength(60)]
        public string? Transport { get; set; }

        [MaxLength(100)]
        public string? PreferredSetting { get; set; }

        [MaxLength(60)]
        public string? PlanningStyle { get; set; }

        [MaxLength(300)]
        public string? PreferredRegions { get; set; }

        [MaxLength(50)]
        public string? TravelFrequency { get; set; }

        [MaxLength(100)]
        public string? ArchetypeName { get; set; }

        [MaxLength(500)]
        public string? ArchetypeDescription { get; set; }
    }
}
