using System.Text.Json.Serialization;

namespace travel_assistant_backend.Services.Photos
{
    public class Photo
    {
        [JsonPropertyName("urls")]
        public PhotoUrls Urls { get; set; } = new();
    }
}
