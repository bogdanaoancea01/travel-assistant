using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using OpenAI.Chat;
using System.Security.Claims;
using System.Text.Json;
using travel_assistant_backend.DTOs.Chat;
using travel_assistant_backend.Services.Interfaces.Chat;
using travel_assistant_backend.Services.Preferences;

namespace travel_assistant_backend.Controllers
{
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        private readonly IPreferencesService _preferencesService;

        private static readonly JsonSerializerOptions JsonOptions =
            new() { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

        public ChatController(IChatService chatService, IPreferencesService preferencesService)
        {
            _chatService = chatService;
            _preferencesService = preferencesService;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue("userId")!);

        [HttpPost("generatetrip")]
        public async Task GenerateTrip([FromBody] ChatRequestDTO request, CancellationToken cancellationToken)
        {
            Response.ContentType = "text/event-stream";
            Response.Headers.CacheControl = "no-cache";
            Response.Headers.Append("X-Accel-Buffering", "no");

            HttpContext.Features.Get<IHttpResponseBodyFeature>()?.DisableBuffering();

            async Task Send(string eventName, object payload)
            {
                var json = JsonSerializer.Serialize(payload, JsonOptions);
                await Response.WriteAsync($"event: {eventName}\n", cancellationToken);
                await Response.WriteAsync($"data: {json}\n\n", cancellationToken);
                await Response.Body.FlushAsync(cancellationToken);
            }

            if (request.Messages == null || !request.Messages.Any())
            {
                await Send("error", new { error = "No messages provided." });
                return;
            }

            var chatHistory = request.Messages
                .Where(m => m != null)
                .Select(m =>
                {
                    var role = (m.Role ?? "user").Trim().ToLowerInvariant();
                    var message = m.Content ?? string.Empty;
                    return role switch
                    {
                        "assistant" => (ChatMessage)new AssistantChatMessage(message),
                        "system" => new SystemChatMessage(message),
                        _ => new UserChatMessage(message)
                    };
                }).ToList();

            var preferences = await _preferencesService.GetPreferencesAsync(GetUserId());

            try
            {
                var result = await _chatService.GenerateTripAsync(
                    chatHistory,
                    preferences,
                    onProgress: (update, ct) => Send("status", update),
                    cancellationToken: cancellationToken);

                await Send("result", result);
            }
            catch (OperationCanceledException)
            {
                // Client navigated away / aborted — nothing to send.
            }
            catch (Exception ex)
            {
                await Send("error", new { error = ex.Message });
            }
        }
    }
}