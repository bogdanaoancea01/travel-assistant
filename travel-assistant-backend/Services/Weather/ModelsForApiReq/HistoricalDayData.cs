using System.Text.Json.Serialization;

namespace travel_assistant_backend.Services.Weather.ModelsForApiReq
{
    public class HistoricalDayData
    {
        [JsonPropertyName("datetime")] 
        public string DateTime { get; set; }

        [JsonPropertyName("tempmax")] 
        public double MaxTemp { get; set; }

        [JsonPropertyName("temp")]
        public double AvgTemp { get; set; }

        [JsonPropertyName("tempmin")] 
        public double MinTemp { get; set; }

        [JsonPropertyName("precipprob")] 
        public double RainChance { get; set; }
    }
}
