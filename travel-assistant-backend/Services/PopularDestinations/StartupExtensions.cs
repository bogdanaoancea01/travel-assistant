namespace travel_assistant_backend.Services.PopularDestinations
{
    public static class StartupExtensions
    {
        public static async Task SeedPopularDestinationsAsync(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var service = scope.ServiceProvider.GetRequiredService<IPopularDestinationsService>();

            try
            {
                await service.SeedAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Startup] Destination seeding failed: {ex.Message}");
            }
        }
    }
}
