namespace travel_assistant_backend.DTOs.ChatHistory
{
    public class AssistantResponseDTO
    {
        public int Id { get; set; }
        public string JsonContent { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
