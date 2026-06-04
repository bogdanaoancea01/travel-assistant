using travel_assistant_backend.DTOs.Quiz;

namespace travel_assistant_backend.Services.Quiz
{
    public interface IQuizService
    {
        Task<QuizResultDTO> ProcessQuizAsync(QuizAnswersDTO answers, CancellationToken cancellationToken = default);
    }
}