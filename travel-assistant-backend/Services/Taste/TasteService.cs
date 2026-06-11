using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using travel_assistant_backend.DTOs.Explore;
using travel_assistant_backend.Models;
using travel_assistant_backend.Services.Embeddings;

namespace travel_assistant_backend.Services.Taste
{
    public class TasteService : ITasteService
    {
        private readonly AppDbContext _db;
        private readonly IEmbeddingService _embeddings;

        private const double PrefsWeight = 0.3;   // weight of the quiz-preferences anchor vs. liked destinations
        private const double LikedWeight = 0.7;   // weight of the liked-destinations anchor
        private const double DislikePenalty = 0.5;// how strongly disliked similarity subtracts from the score
        private const double MmrLambda = 0.7;     // MMR: relevance (λ) vs. diversity (1-λ)
        private const double SimilarToThreshold = 0.15; // min cosine to claim "similar to <liked>"

        public TasteService(AppDbContext db, IEmbeddingService embeddings)
        {
            _db = db;
            _embeddings = embeddings;
        }

        private static string Key(string city, string country) =>
            $"{(city ?? "").Trim().ToLowerInvariant()}|{(country ?? "").Trim().ToLowerInvariant()}";


        /// <summary> 
        /// Key + display name for every destination the user has interacted with (any signal).
        /// </summary>
        public async Task<List<(string Key, string Name)>> GetExclusionsAsync(int userId, CancellationToken ct = default)
        {
            var rows = await _db.DestinationInteractions
                .Where(i => i.UserId == userId)
                .Select(i => new { i.City, i.Country })
                .ToListAsync(ct);
            return rows.Select(r => (Key(r.City, r.Country), $"{r.City}, {r.Country}")).ToList();
        }

        /// <summary>
        /// Liked/saved (positive) and disliked (negative) anchor destinations, with cached embeddings.
        /// </summary>
        public async Task<(List<(string Name, float[] Vec)> Liked, List<(string Name, float[] Vec)> Disliked)>
            GetAnchorsAsync(int userId, CancellationToken ct = default)
        {
            var rows = await _db.DestinationInteractions
                .Where(i => i.UserId == userId)
                .ToListAsync(ct);

            var liked = new List<(string, float[])>();
            var disliked = new List<(string, float[])>();

            foreach (var r in rows)
            {
                var vec = Deserialize(r.EmbeddingJson);
                if (vec.Length == 0) continue;
                var name = $"{r.City}, {r.Country}";
                // Likes and saves are both positive signals.
                if (r.Signal == "Dislike") disliked.Add((name, vec));
                else liked.Add((name, vec));
            }

            return (liked, disliked);
        }

        /// <summary>
        /// Record like/dislike/save; embeds and caches the destination vector.
        /// </summary>
        public async Task ApplyFeedbackAsync(int userId, DestinationFeedbackDTO fb, CancellationToken ct = default)
        {
            var signal = Normalise(fb.Signal);
            var existing = await _db.DestinationInteractions
                .FirstOrDefaultAsync(i => i.UserId == userId
                    && i.City == fb.City && i.Country == fb.Country, ct);

            if (existing == null)
            {
                var descriptor = ITasteService.Descriptor(fb.City, fb.Country, fb.Category, fb.Tags);
                var vec = await _embeddings.EmbedAsync(descriptor, ct);

                _db.DestinationInteractions.Add(new DestinationInteraction
                {
                    UserId = userId,
                    City = fb.City,
                    Country = fb.Country,
                    Category = fb.Category,
                    Tags = string.Join(", ", fb.Tags ?? new()),
                    Reason = fb.Reason ?? "",
                    Signal = signal,
                    EmbeddingJson = JsonSerializer.Serialize(vec),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
            }
            else
            {
                existing.Signal = signal;
                existing.Category = fb.Category;
                existing.Tags = string.Join(", ", fb.Tags ?? new());
                if (!string.IsNullOrWhiteSpace(fb.Reason)) existing.Reason = fb.Reason;
                existing.UpdatedAt = DateTime.UtcNow;

                // Re-embed only if we don't already have a vector cached.
                if (Deserialize(existing.EmbeddingJson).Length == 0)
                {
                    var descriptor = ITasteService.Descriptor(fb.City, fb.Country, fb.Category, fb.Tags);
                    existing.EmbeddingJson = JsonSerializer.Serialize(await _embeddings.EmbedAsync(descriptor, ct));
                }
            }

            await _db.SaveChangesAsync(ct);
        }

        /// <summary>
        /// Remove an interaction (toggle-off a like/dislike, or unsave).
        /// </summary>
        public async Task RemoveInteractionAsync(int userId, string city, string country, CancellationToken ct = default)
        {
            var row = await _db.DestinationInteractions
                .FirstOrDefaultAsync(i => i.UserId == userId && i.City == city && i.Country == country, ct);
            if (row != null)
            {
                _db.DestinationInteractions.Remove(row);
                await _db.SaveChangesAsync(ct);
            }
        }

        public async Task<List<SavedDestinationDTO>> GetSavedAsync(int userId, CancellationToken ct = default)
        {
            return await _db.DestinationInteractions
                .Where(i => i.UserId == userId && i.Signal == "Save")
                .OrderByDescending(i => i.UpdatedAt)
                .Select(i => new SavedDestinationDTO
                {
                    City = i.City,
                    Country = i.Country,
                    Category = i.Category,
                    Tags = i.Tags == "" ? new List<string>() : i.Tags.Split(", ", StringSplitOptions.RemoveEmptyEntries).ToList(),
                    Reason = i.Reason
                })
                .ToListAsync(ct);
        }

        /// <summary>
        /// Score candidates by cosine similarity to a positive anchor (liked + preferences)
        /// minus similarity to a negative anchor (disliked), then diversify with MMR.
        /// </summary>
        public RankedSuggestionsDTO Rerank(
            IReadOnlyList<ExploreDestinationDTO> candidates,
            IReadOnlyList<float[]> candidateEmbeddings,
            List<(string Name, float[] Vec)> liked,
            List<(string Name, float[] Vec)> disliked,
            float[]? prefsEmbedding,
            int topK)
        {
            var n = Math.Min(candidates.Count, candidateEmbeddings.Count);
            if (n == 0) return new RankedSuggestionsDTO();

            // Build the positive anchor: blend liked-destinations centroid with the
            // preference embedding; fall back to whichever exists.
            float[]? likedCentroid = liked.Count > 0 ? Centroid(liked.Select(l => l.Vec)) : null;
            float[]? prefs = (prefsEmbedding != null && prefsEmbedding.Length > 0) ? Normalize(prefsEmbedding) : null;

            float[]? pos =
                (likedCentroid != null && prefs != null) ? Normalize(Add(Scale(likedCentroid, LikedWeight), Scale(prefs, PrefsWeight)))
                : likedCentroid ?? prefs;

            float[]? neg = disliked.Count > 0 ? Centroid(disliked.Select(d => d.Vec)) : null;

            var scored = new List<(int idx, double score, float[] vec)>();
            for (int i = 0; i < n; i++)
            {
                var e = Normalize(candidateEmbeddings[i]);
                double s = 0;
                if (pos != null) s += Cosine(e, pos);
                if (neg != null) s -= DislikePenalty * Cosine(e, neg);
                scored.Add((i, s, e));
            }

            // No anchors at all → keep the LLM's order.
            if (pos == null && neg == null)
            {
                return new RankedSuggestionsDTO
                {
                    Destinations = scored.Take(topK).Select(s => ToDto(candidates[s.idx], s.score, liked, s.vec)).ToList()
                };
            }

            // Min-max normalise relevance for MMR.
            double min = scored.Min(s => s.score), max = scored.Max(s => s.score);
            double range = Math.Abs(max - min) < 1e-9 ? 1.0 : max - min;
            double Rel(double sc) => (sc - min) / range;

            var remaining = scored.ToList();
            var selected = new List<(int idx, double score, float[] vec)>();
            while (selected.Count < topK && remaining.Count > 0)
            {
                var best = remaining.OrderByDescending(s =>
                {
                    double maxSim = selected.Count == 0 ? 0 : selected.Max(sel => Cosine(s.vec, sel.vec));
                    return MmrLambda * Rel(s.score) - (1 - MmrLambda) * maxSim;
                }).First();
                selected.Add(best);
                remaining.Remove(best);
            }

            return new RankedSuggestionsDTO
            {
                Destinations = selected.Select(s => ToDto(candidates[s.idx], s.score, liked, s.vec)).ToList()
            };
        }

        // ---- mapping & vector helpers ----
        private static RankedDestinationDTO ToDto(
            ExploreDestinationDTO c, double score, List<(string Name, float[] Vec)> liked, float[] candidateVec)
        {
            string similarTo = "";
            if (liked.Count > 0)
            {
                var nearest = liked
                    .Select(l => (l.Name, sim: Cosine(candidateVec, Normalize(l.Vec))))
                    .OrderByDescending(x => x.sim)
                    .First();
                if (nearest.sim >= SimilarToThreshold) similarTo = nearest.Name;
            }

            return new RankedDestinationDTO
            {
                City = c.City,
                Country = c.Country,
                Category = c.Category,
                Tags = c.Tags,
                Reason = c.Reason,
                Score = Math.Round(score, 4),
                SimilarTo = similarTo
            };
        }

        private static float[] Centroid(IEnumerable<float[]> vecs)
        {
            var normed = vecs.Select(Normalize).ToList();
            int dim = normed[0].Length;
            var sum = new float[dim];
            foreach (var v in normed)
                for (int i = 0; i < dim; i++) sum[i] += v[i];
            for (int i = 0; i < dim; i++) sum[i] /= normed.Count;
            return Normalize(sum);
        }

        private static float[] Add(float[] a, float[] b)
        {
            var r = new float[a.Length];
            for (int i = 0; i < a.Length; i++) r[i] = a[i] + b[i];
            return r;
        }

        private static float[] Scale(float[] a, double k)
        {
            var r = new float[a.Length];
            for (int i = 0; i < a.Length; i++) r[i] = (float)(a[i] * k);
            return r;
        }

        private static float[] Normalize(float[] v)
        {
            double mag = Math.Sqrt(v.Sum(x => (double)x * x));
            if (mag < 1e-12) return v;
            var r = new float[v.Length];
            for (int i = 0; i < v.Length; i++) r[i] = (float)(v[i] / mag);
            return r;
        }

        private static double Cosine(float[] a, float[] b)
        {
            int len = Math.Min(a.Length, b.Length);
            double dot = 0;
            for (int i = 0; i < len; i++) dot += (double)a[i] * b[i];
            return dot; // inputs are normalised
        }

        private static float[] Deserialize(string json)
        {
            try { return JsonSerializer.Deserialize<float[]>(json) ?? Array.Empty<float>(); }
            catch { return Array.Empty<float>(); }
        }

        private static string Normalise(string signal) => (signal ?? "").Trim().ToLowerInvariant() switch
        {
            "save" => "Save",
            "dislike" => "Dislike",
            _ => "Like",
        };
    }
}
