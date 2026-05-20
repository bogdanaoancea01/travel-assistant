using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using travel_assistant_backend.DTOs.ChatHistory;
using travel_assistant_backend.Models;

namespace travel_assistant_backend.Controllers
{
    [ApiController]
    [Route("api/chatshistory")]
    public class ChatsHistoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChatsHistoryController(AppDbContext context)
        {
            _context = context;
        }

        private int GetUserId()
        {
            var claim = User.FindFirstValue("userId");
            return int.Parse(claim);
        }

        [HttpGet]
        public async Task<IActionResult> GetChats()
        {
            var userId = GetUserId();
            var chats = await _context.Chats
                .Where(c => c.UserId == userId)
                .OrderByDescending(c => c.UpdatedAt)
                .Select(c => new ChatSummaryDTO
                {
                    Id = c.Id,
                    Name = c.Name,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt,
                })
                .ToListAsync();

            return Ok(chats);
        }

        // GET /api/chats/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetChatById(int id)
        {
            var userId = GetUserId();
            var chat = await _context.Chats
                .Include(c => c.UserMessages)
                .Include(c => c.AssistantResponses)
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

            if (chat == null) return NotFound();

            return Ok(new ChatDTO
            {
                Id = chat.Id,
                Name = chat.Name,
                CreatedAt = chat.CreatedAt,
                UpdatedAt = chat.UpdatedAt,
                UserMessages = chat.UserMessages
                    .OrderBy(m => m.CreatedAt)
                    .Select(m => new UserMessageDTO
                    {
                        Id = m.Id,
                        Content = m.Content,
                        CreatedAt = m.CreatedAt,
                    }).ToList(),
                AssistantResponses = chat.AssistantResponses
                    .OrderBy(r => r.CreatedAt)
                    .Select(r => new AssistantResponseDTO
                    {
                        Id = r.Id,
                        JsonContent = r.JsonContent,
                        CreatedAt = r.CreatedAt,
                    }).ToList(),
            });
        }

        // POST /api/chats
        [HttpPost]
        public async Task<IActionResult> CreateChat([FromBody] CreateChatRequest request)
        {
            var chat = new Chat
            {
                UserId = GetUserId(),
                Name = request.Name ?? "New Chat",
            };

            _context.Chats.Add(chat);
            await _context.SaveChangesAsync();

            return Ok(new ChatDTO { Id = chat.Id, Name = chat.Name, CreatedAt = chat.CreatedAt });
        }

        // POST /api/chats/{id}/user-messages
        [HttpPost("{id}/user-messages")]
        public async Task<IActionResult> SaveUserMessage(int id, [FromBody] SaveUserMessageRequest request)
        {
            var chat = await _context.Chats
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == GetUserId());
            if (chat == null) return NotFound();

            var message = new UserMessage { ChatId = id, Content = request.Content };
            chat.UpdatedAt = DateTime.UtcNow;
            _context.UserMessages.Add(message);
            await _context.SaveChangesAsync();

            return Ok(new UserMessageDTO
            {
                Id = message.Id,
                Content = message.Content,
                CreatedAt = message.CreatedAt
            });
        }

        // POST /api/chats/{id}/assistant-responses
        [HttpPost("{id}/assistant-responses")]
        public async Task<IActionResult> SaveAssistantResponse(int id, [FromBody] SaveAssistantResponseRequest request)
        {
            var chat = await _context.Chats
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == GetUserId());
            if (chat == null) return NotFound();

            var response = new AssistantResponse { ChatId = id, JsonContent = request.JsonContent };
            chat.UpdatedAt = DateTime.UtcNow;
            _context.AssistantResponses.Add(response);
            await _context.SaveChangesAsync();

            return Ok(new AssistantResponseDTO
            {
                Id = response.Id,
                JsonContent = response.JsonContent,
                CreatedAt = response.CreatedAt
            });
        }

        // PUT /api/chats/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> RenameChat(int id, [FromBody] RenameChatRequest request)
        {
            var chat = await _context.Chats
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == GetUserId());
            if (chat == null) return NotFound();

            chat.Name = request.Name;
            chat.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok();
        }

        // DELETE /api/chats/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChat(int id)
        {
            var chat = await _context.Chats
                .FirstOrDefaultAsync(c => c.Id == id && c.UserId == GetUserId());
            if (chat == null) return NotFound();

            _context.Chats.Remove(chat);
            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
