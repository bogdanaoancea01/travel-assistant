using System.Text.Json.Serialization;

namespace travel_assistant_backend.Services.Photos
{
    public class PhotoSearchResponse
    {
        [JsonPropertyName("results")]
        public List<Photo> Results { get; set; } = new();
    }
}
