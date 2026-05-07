using System.Text.Json.Serialization;
using travel_assistant_backend.Services.Weather.ModelsForApiReq;

namespace travel_assistant_backend.Services.Weather
{
    public class VisualCrossingApiResponse
    {
        [JsonPropertyName("days")]
        public List<HistoricalDayData> Days { get; set; }
    }
}
