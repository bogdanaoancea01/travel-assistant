namespace travel_assistant_backend.Services.Embeddings
{
    public interface IEmbeddingService
    {
        Task<float[]> EmbedAsync(string text, CancellationToken ct = default);
        Task<List<float[]>> EmbedBatchAsync(IReadOnlyList<string> texts, CancellationToken ct = default);
    }
}
