namespace travel_assistant_backend.Services.Geocoding
{
    public interface IGeocodingService
    {
        Task<(double Lat, double Lng)?> GeocodeAsync(string name, string address);
    }
}
