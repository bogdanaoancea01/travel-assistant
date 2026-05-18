using System.Text.Json.Serialization;

namespace travel_assistant_backend.Services.Geocoding
{
    public class GeocodingModel
    {
        [JsonPropertyName("lat")] 
        public string Latitude { set; get; }

        [JsonPropertyName("lon")] 
        public string Longitude { set; get; }

        [JsonPropertyName("display_name")] 
        public string DisplayName { set; get; }
    }
}
