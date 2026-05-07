using System.Text.Json.Serialization;
using travel_assistant_backend.DTOs.Weather;
using travel_assistant_backend.Services.Weather.ModelsForApiReq;

namespace travel_assistant_backend.Services.Weather
{
    public class WeatherApiResponse
    {
        [JsonPropertyName("forecast")]
        public ForecastData Forecast { get; set; }
    }
}
