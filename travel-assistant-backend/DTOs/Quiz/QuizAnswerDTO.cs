namespace travel_assistant_backend.DTOs.Quiz
{
    public class QuizAnswersDTO
    {
        // Each answer is a question ID → selected option
        public Dictionary<string, string> Answers { get; set; } = new();
    }
}