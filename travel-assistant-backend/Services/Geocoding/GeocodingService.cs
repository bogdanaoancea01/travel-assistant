using System.Globalization;

namespace travel_assistant_backend.Services.Geocoding
{
    public class GeocodingService : IGeocodingService
    {
        private readonly HttpClient _httpClient;

        public GeocodingService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "TravelAssistant/1.0");
        }

        public async Task<(double Lat, double Lng)?> GeocodeAsync(string name, string address)
        {
            // Prefer full address, fall back to name only
            var query = !string.IsNullOrWhiteSpace(address) ? address : name;

            var url = $"https://nominatim.openstreetmap.org/search?q={Uri.EscapeDataString(query)}&format=json&limit=1";

            try
            {
                var results = await _httpClient.GetFromJsonAsync<List<GeocodingModel>>(url);
                var first = results?.FirstOrDefault();

                if (first == null)
                {
                    Console.WriteLine($"[Geocoding] No results for: {query}");
                    return null;
                }

                return (
                    double.Parse(first.Latitude, CultureInfo.InvariantCulture),
                    double.Parse(first.Longitude, CultureInfo.InvariantCulture)
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Geocoding] Error for '{query}': {ex.Message}");
                return null;
            }
        }
    }
}
