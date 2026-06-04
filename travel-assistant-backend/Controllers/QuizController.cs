using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using travel_assistant_backend.DTOs.Quiz;
using travel_assistant_backend.Services.Preferences;
using travel_assistant_backend.Services.Quiz;

namespace travel_assistant_backend.Controllers
{
    [ApiController]
    [Route("api/quiz")]
    [Authorize]
    public class QuizController : ControllerBase
    {
        private readonly IQuizService _quizService;
        private readonly IPreferencesService _preferencesService;

        public QuizController(IQuizService quizService, IPreferencesService preferencesService)
        {
            _quizService = quizService;
            _preferencesService = preferencesService;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue("userId")!);

        /// <summary>
        /// Processes quiz answers, infers traveler archetype + preferences via AI,
        /// saves preferences to DB, and returns the archetype result.
        /// </summary>
        [HttpPost("submit")]
        public async Task<IActionResult> SubmitQuiz(
            [FromBody] QuizAnswersDTO dto,
            CancellationToken cancellationToken)
        {
            if (dto?.Answers == null || !dto.Answers.Any())
                return BadRequest("Quiz answers are required.");

            var result = await _quizService.ProcessQuizAsync(dto, cancellationToken);

            var existing = await _preferencesService.GetPreferencesAsync(GetUserId()) ?? new();

            var merged = result.InferredPreferences;
            merged.HomeCity = existing.HomeCity ?? result.InferredPreferences.HomeCity;
            merged.PreferredCurrency = existing.PreferredCurrency ?? result.InferredPreferences.PreferredCurrency;
            merged.PreferredAirportName = existing.PreferredAirportName ?? result.InferredPreferences.PreferredAirportName;
            merged.ArchetypeName = result.ArchetypeName;
            merged.ArchetypeDescription = result.ArchetypeDescription;

            await _preferencesService.UpsertPreferencesAsync(GetUserId(), merged);

            return Ok(result);
        }
    }
}