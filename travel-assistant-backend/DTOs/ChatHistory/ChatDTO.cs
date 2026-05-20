namespace travel_assistant_backend.DTOs.ChatHistory
{
    public class ChatDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<UserMessageDTO> UserMessages { get; set; } = new();
        public List<AssistantResponseDTO> AssistantResponses { get; set; } = new();
    }
}
