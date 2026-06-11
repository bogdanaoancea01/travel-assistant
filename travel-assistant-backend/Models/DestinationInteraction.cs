using System.ComponentModel.DataAnnotations;

namespace travel_assistant_backend.Models
{
    /// <summary>
    /// A user's relationship to a specific destination: liked, disliked, or saved.
    /// One row per (user, destination). The destination's embedding is computed
    /// once (via the OpenAI embeddings API) and saved here so the recommender
    /// can score new candidates against it without re-embedding.
    /// </summary>
    public class DestinationInteraction
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }
        public User User { get; set; } = null!;

        [MaxLength(100)]
        public string City { get; set; } = string.Empty;

        [MaxLength(100)]
        public string Country { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Category { get; set; } = string.Empty;

        [MaxLength(300)]
        public string Tags { get; set; } = string.Empty;

        [MaxLength(500)]
        public string Reason { get; set; } = string.Empty;

        // Like / Dislike / Save
        [MaxLength(20)]
        public string Signal { get; set; } = string.Empty;

        // JSON-serialised float[] embedding of the destination descriptor.
        public string EmbeddingJson { get; set; } = "[]";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
