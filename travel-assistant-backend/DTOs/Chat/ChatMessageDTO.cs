namespace travel_assistant_backend.DTOs.Chat
{
    public class ChatMessageDTO
    {
        public int UserId { get; set; }
        public string Role { get; set; } = "user";
        public string Content { get; set; }
    }
}
