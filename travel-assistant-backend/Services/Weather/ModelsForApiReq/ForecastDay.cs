using System.Text.Json.Serialization;

namespace travel_assistant_backend.Services.Weather.ModelsForApiReq
{
    public class ForecastDay
    {
        [JsonPropertyName("date")] 
        public string Date { get; set; }

        [JsonPropertyName("day")] 
        public DayData Day { get; set; }
    }
}
