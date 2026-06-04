using travel_assistant_backend.DTOs.UserPreference;

public class QuizResultDTO
{
    public string ArchetypeName { get; set; } = string.Empty;
    public string ArchetypeDescription { get; set; } = string.Empty;
    public string ArchetypeEmoji { get; set; } = string.Empty;
    public UserPreferencesDTO InferredPreferences { get; set; } = new();
}