using travel_assistant_backend.DTOs.Weather;

namespace travel_assistant_backend.Services.Weather
{
    public class WeatherService : IWeatherService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly string _apiKeyVisualCrossing;

        public WeatherService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _apiKey = configuration["WeatherApi:ApiKey"]
                      ?? throw new Exception("Weather API Key is missing in configuration.");
            _apiKeyVisualCrossing = configuration["VisualCrossingApi:ApiKey"]
                      ?? throw new Exception("Visual Crossing API Key is missing in configuration.");
        }

        public async Task<WeatherDTO?> GetWeatherAsync(string location, int days)
        {
            try
            {
                var response = await _httpClient.GetFromJsonAsync<WeatherApiResponse>(
                    $"forecast.json?key={_apiKey}&q={Uri.EscapeDataString(location)}&days={days}&aqi=no");

                var firstDay = response?.Forecast?.ForecastDays?.FirstOrDefault();

                if (firstDay != null)
                {
                    return new WeatherDTO(
                        firstDay.Day.MaxTempC,
                        firstDay.Day.AvgTempC,
                        firstDay.Day.MinTempC,
                        firstDay.Day.ChanceOfRain,
                        firstDay.Day.WillItRain,
                        firstDay.Day.Uv,
                        firstDay.Day.Condition.Text
                    );
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Weather API Error: {ex.Message}");
            }

            return null;
        }

        public async Task<HistoricalWeatherDTO?> GetHistoricalClimateAsync(string location, string startDate, string endDate)
        {
            try
            {
                var response = await _httpClient.GetFromJsonAsync<VisualCrossingApiResponse>(
                    $"https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{Uri.EscapeDataString(location)}/{startDate}/{endDate}?unitGroup=metric&include=stats&key={_apiKeyVisualCrossing}");

                if (response?.Days != null && response.Days.Count > 0)
                {
                    return new HistoricalWeatherDTO(
                        Math.Round(response.Days.Average(d => d.MaxTemp), 1),
                        Math.Round(response.Days.Average(d => d.AvgTemp), 1),
                        Math.Round(response.Days.Average(d => d.MinTemp), 1),
                        Math.Round(response.Days.Average(d => d.RainChance), 1)
                    );
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Visual Crossing API Error: {ex.Message}");
            }

            return null;
        }
    }
}
