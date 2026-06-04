using OpenAI.Chat;
using travel_assistant_backend.DTOs.Chat;
using travel_assistant_backend.DTOs.UserPreference;

namespace travel_assistant_backend.Services.Interfaces.Chat
{
    public interface IChatService
    {
        Task<GenerateTripResult> GenerateTripAsync(
            IReadOnlyList<ChatMessage> messages,
            UserPreferencesDTO? preferences = null,
            CancellationToken cancellationToken = default);
    }
}