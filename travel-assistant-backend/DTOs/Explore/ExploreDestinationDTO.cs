namespace travel_assistant_backend.DTOs.Explore
{
    public class ExploreDestinationDTO
    {
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new();
        public string Reason { get; set; } = string.Empty;
    }

    public class ExploreSuggestionsDTO
    {
        public List<ExploreDestinationDTO> Destinations { get; set; } = new();
    }
}