using System.Text.Json.Serialization;

namespace travel_assistant_backend.Services.Photos
{
    public class PhotoUrls
    {
        [JsonPropertyName("regular")]
        public string Regular { get; set; } = "";

        [JsonPropertyName("small")]
        public string Small { get; set; } = "";

        [JsonPropertyName("full")]
        public string Full { get; set; } = "";
    }
}
