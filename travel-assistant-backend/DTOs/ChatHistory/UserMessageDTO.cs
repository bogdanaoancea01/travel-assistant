namespace travel_assistant_backend.DTOs.ChatHistory
{
    public class UserMessageDTO
    {
        public int Id { get; set; }
        public string Content { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
