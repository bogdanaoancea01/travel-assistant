using System.Text.Json.Serialization;

namespace travel_assistant_backend.Services.Weather.ModelsForApiReq
{
    public class DayData
    {
        [JsonPropertyName("maxtemp_c")] 
        public double MaxTempC { get; set; }

        [JsonPropertyName("avgtemp_c")]
        public double AvgTempC { get; set; }

        [JsonPropertyName("mintemp_c")] 
        public double MinTempC { get; set; }

        [JsonPropertyName("daily_chance_of_rain")] 
        public int ChanceOfRain { get; set; }

        [JsonPropertyName("daily_will_it_rain")]
        public int WillItRain { get; set; }

        [JsonPropertyName("uv")]
        public double Uv { get; set; }

        [JsonPropertyName("condition")] 
        public ConditionData Condition { get; set; }
    }
}
