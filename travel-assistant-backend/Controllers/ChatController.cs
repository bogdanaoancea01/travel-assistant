using Microsoft.AspNetCore.Mvc;
using OpenAI.Chat;
using travel_assistant_backend.DTOs.Chat;
using travel_assistant_backend.Services.Interfaces.Chat;

namespace travel_assistant_backend.Controllers
{
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatServcie;


        public ChatController(IChatService chatServcie)
        {
            _chatServcie = chatServcie;
        }

        [HttpPost("generatetrip")]
        public async Task<IActionResult> GenerateTrip([FromBody] ChatRequestDTO request, CancellationToken cancellationToken)
        {
            if (request.Messages == null || !request.Messages.Any())
                return BadRequest("No messages provided.");

            var chatHistory = request.Messages.Where(m => m != null).Select(m => { 
                var role = (m.Role ?? "user").Trim().ToLowerInvariant(); 
                var message = m.Content ?? string.Empty; 
                return role switch 
                { 
                    "assistant" => (ChatMessage)new AssistantChatMessage(message), 
                    "system" => new SystemChatMessage(message), 
                    _ => new UserChatMessage(message) };
            }).ToList();


            try
            {
                var result = await _chatServcie.GenerateTripAsync(chatHistory, cancellationToken);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}
