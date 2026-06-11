namespace travel_assistant_backend.DTOs.Explore
{
    /// <summary>
    /// A candidate destination after embedding-based re-ranking.
    /// </summary>
    public class RankedDestinationDTO
    {
        public string City { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public List<string> Tags { get; set; } = new();
        public string Reason { get; set; } = string.Empty;

        // Cosine-based recommender score (higher = better match).
        public double Score { get; set; }

        // The liked destination this candidate most resembles, e.g. "Lisbon, Portugal".
        // Empty when the user has no likes yet (new user / user did not like any destinations).
        public string SimilarTo { get; set; } = string.Empty;
    }
}
