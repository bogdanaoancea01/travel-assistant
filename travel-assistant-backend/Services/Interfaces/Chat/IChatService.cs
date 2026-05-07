using OpenAI.Chat;
using travel_assistant_backend.DTOs.Chat;

namespace travel_assistant_backend.Services.Interfaces.Chat
{
    public interface IChatService
    {
        Task<GenerateTripResult> GenerateTripAsync(IReadOnlyList<ChatMessage> messages, CancellationToken cancellationToken = default);
    }
}
