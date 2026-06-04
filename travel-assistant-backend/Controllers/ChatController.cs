using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OpenAI.Chat;
using System.Security.Claims;
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

        public ChatController(IChatService chatService, IPreferencesService preferencesService)
        {
            _chatService = chatService;
            _preferencesService = preferencesService;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue("userId")!);

        [HttpPost("generatetrip")]
        public async Task<IActionResult> GenerateTrip([FromBody] ChatRequestDTO request, CancellationToken cancellationToken)
        {
            if (request.Messages == null || !request.Messages.Any())
                return BadRequest("No messages provided.");

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
                var result = await _chatService.GenerateTripAsync(chatHistory, preferences, cancellationToken);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}