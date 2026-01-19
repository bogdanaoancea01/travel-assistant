using Microsoft.AspNetCore.Mvc;
using OpenAI;
using OpenAI.Chat;
using TravelAssistant.DTOs.Chat;

namespace TravelAssistant.Controllers
{
    [ApiController]
    [Route("api/chat")]
    public class ChatController : ControllerBase
    {
        private readonly OpenAIClient _openAi;

        public ChatController(OpenAIClient openAi)
        {
            _openAi = openAi;
        }

        [HttpPost]
        public async Task<IActionResult> Chat([FromBody] ChatRequestDTO request)
        {
            try
            {
                var chat = _openAi.GetChatClient("gpt-4o-mini");

                var messages = new List<ChatMessage>
                {
                    new SystemChatMessage("You are a helpful assistant.")
                };

                foreach (var msg in request.Messages)
                {
                    switch (msg.Role.ToLower())
                    {
                        case "user":
                            messages.Add(new UserChatMessage(msg.Content));
                            break;

                        case "assistant":
                            messages.Add(new AssistantChatMessage(msg.Content));
                            break;

                        case "system":
                            messages.Add(new SystemChatMessage(msg.Content));
                            break;
                    }
                }

                var response = await chat.CompleteChatAsync(messages);

                return Ok(new
                {
                    reply = response.Value.Content[0].Text
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, ex.Message);
            }
        }
    }
}
