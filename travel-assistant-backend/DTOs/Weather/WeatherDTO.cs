namespace travel_assistant_backend.DTOs.Weather
{
    public class WeatherDTO
    {
        public double HighestTemperatureC { get; set; }
        public double AverageTemperatureC { get; set; }
        public double LowestTemperatureC { get; set; }
        public int ChanceOfRain { get; set; }
        public int WillItRain { get; set; }
        public double UvIndex { get; set; }
        public string WeatherCondition { get; set; }

        public WeatherDTO(double highestTemperatureC, double averageTemperatureC, double lowestTemperatureC, int chanceOfRain, int willItRain, double uvIndex, string weatherCondition)
        {
            HighestTemperatureC = highestTemperatureC;
            AverageTemperatureC = averageTemperatureC;
            LowestTemperatureC = lowestTemperatureC;
            ChanceOfRain = chanceOfRain;
            WillItRain = willItRain;
            UvIndex = uvIndex;
            WeatherCondition = weatherCondition;
        }
    }
}
