using System.Net.Http.Headers;

namespace travel_assistant_backend.Services.Photos
{
    public class PhotosService : IPhotosService
    {
        private readonly HttpClient _httpClient;
        private readonly string _accessKey;

        public PhotosService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _accessKey = configuration["Unsplash:AccessKey"]
                         ?? throw new Exception("Unsplash AccessKey is missing");
        }

        public async Task<List<string>> SearchPhotosAsync(
            string query,
            int count,
            string? orientation = null,
            CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(query))
                return new List<string>();

            count = Math.Clamp(count, 1, 10);

            var url = $"search/photos?query={Uri.EscapeDataString(query)}&per_page={count}";
            if (!string.IsNullOrWhiteSpace(orientation))
                url += $"&orientation={Uri.EscapeDataString(orientation)}";

            try
            {
                using var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Authorization = new AuthenticationHeaderValue("Client-ID", _accessKey);

                using var response = await _httpClient.SendAsync(request, cancellationToken);
                response.EnsureSuccessStatusCode();

                var data = await response.Content.ReadFromJsonAsync<PhotoSearchResponse>(
                    cancellationToken: cancellationToken);

                return data?.Results
                           .Select(r => r.Urls.Regular)
                           .Where(u => !string.IsNullOrEmpty(u))
                           .ToList()
                       ?? new List<string>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Unsplash] Error for '{query}': {ex.Message}");
                return new List<string>();
            }
        }
    }
}
