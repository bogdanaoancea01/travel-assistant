namespace travel_assistant_backend.DTOs.Quiz
{
    public class QuizStructuredResult
    {
        public string ArchetypeName { get; set; } = string.Empty;
        public string ArchetypeDescription { get; set; } = string.Empty;
        public InferredPreferencesSchema InferredPreferences { get; set; } = new();
    }
}
