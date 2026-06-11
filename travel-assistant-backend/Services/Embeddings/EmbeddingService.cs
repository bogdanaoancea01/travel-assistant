using OpenAI.Embeddings;

namespace travel_assistant_backend.Services.Embeddings
{
    /// <summary>
    /// Wrapper over the OpenAI embeddings API (text-embedding-3-small).
    /// Returns plain float[] vectors
    /// </summary>
    public class EmbeddingService : IEmbeddingService
    {
        private readonly EmbeddingClient _client;

        public EmbeddingService(EmbeddingClient client)
        {
            _client = client;
        }

        public async Task<float[]> EmbedAsync(string text, CancellationToken ct = default)
        {
            var input = string.IsNullOrWhiteSpace(text) ? " " : text;
            var result = await _client.GenerateEmbeddingAsync(input, cancellationToken: ct);
            return result.Value.ToFloats().ToArray();
        }

        public async Task<List<float[]>> EmbedBatchAsync(IReadOnlyList<string> texts, CancellationToken ct = default)
        {
            if (texts == null || texts.Count == 0) return new();
            var safe = texts.Select(t => string.IsNullOrWhiteSpace(t) ? " " : t).ToList();
            var result = await _client.GenerateEmbeddingsAsync(safe, cancellationToken: ct);
            // The collection preserves input order.
            return result.Value.Select(e => e.ToFloats().ToArray()).ToList();
        }
    }
}
