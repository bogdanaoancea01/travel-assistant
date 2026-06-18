namespace travel_assistant_backend.Services.Photos
{
    public interface IPhotosService
    {
        /// <summary>
        /// Searches Unsplash and returns the image URLs of the matches.
        /// Returns an empty list on any failure
        /// </summary>
        Task<List<string>> SearchPhotosAsync(
            string query,
            int count,
            string? orientation = null,
            CancellationToken cancellationToken = default);
    }
}
