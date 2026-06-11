namespace travel_assistant_backend.DTOs.Explore
{
    /// <summary>
    /// Body for the suggestions endpoint: destinations already shown this session.
    /// </summary>
    public class ExploreRequestDTO
    {
        public List<DestinationRefDTO> Seen { get; set; } = new();
    }
}
