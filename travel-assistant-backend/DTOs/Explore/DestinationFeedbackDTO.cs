namespace travel_assistant_backend.DTOs.Explore
{
    /// <summary>
    /// What the client sends when a user reacts to a suggested destination.
    /// </summary>
    public class DestinationFeedbackDTO
    {
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new();
        public string Reason { get; set; } = string.Empty;

        // Like / Dislike / Save
        public string Signal { get; set; } = string.Empty;
    }
}
