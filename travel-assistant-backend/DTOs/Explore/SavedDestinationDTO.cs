namespace travel_assistant_backend.DTOs.Explore
{
    /// <summary>
    /// A saved destination, for the Saved page.
    /// </summary>
    public class SavedDestinationDTO
    {
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new();
        public string Reason { get; set; } = string.Empty;
    }
}
