namespace travel_assistant_backend.DTOs.Explore
{
    public class RankedSuggestionsDTO
    {
        public List<RankedDestinationDTO> Destinations { get; set; } = new();
    }
}
