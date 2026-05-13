using travel_assistant_backend.DTOs.Weather;

namespace travel_assistant_backend.Services.Weather
{
    public interface IWeatherService
    {
        Task<WeatherDTO?> GetWeatherAsync(string location, int days = 1);
        Task<HistoricalWeatherDTO?> GetHistoricalClimateAsync(string location, string startDate, string endDate);
    }
}
