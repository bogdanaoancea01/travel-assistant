using System.Text.Json.Serialization;

namespace travel_assistant_backend.Services.Weather.ModelsForApiReq
{
    public class ConditionData
    {
        [JsonPropertyName("text")] 
        public string Text { get; set; }
    }
}