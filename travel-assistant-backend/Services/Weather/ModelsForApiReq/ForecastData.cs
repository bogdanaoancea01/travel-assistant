using System.Text.Json.Serialization;

namespace travel_assistant_backend.Services.Weather.ModelsForApiReq
{
    public class ForecastData
    {
        [JsonPropertyName("forecastday")]
        public List<ForecastDay> ForecastDays { get; set; }
    }
}