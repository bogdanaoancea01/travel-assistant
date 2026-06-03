using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using travel_assistant_backend.Services.Explore;
using travel_assistant_backend.Services.Preferences;

namespace travel_assistant_backend.Controllers
{
    [ApiController]
    [Route("api/explore")]
    [Authorize]
    public class ExploreController : ControllerBase
    {
        private readonly IExploreService _exploreService;
        private readonly IPreferencesService _preferencesService;

        public ExploreController(IExploreService exploreService, IPreferencesService preferencesService)
        {
            _exploreService = exploreService;
            _preferencesService = preferencesService;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue("userId")!);

        [HttpGet("suggestions")]
        public async Task<IActionResult> GetSuggestions(CancellationToken cancellationToken)
        {
            var preferences = await _preferencesService.GetPreferencesAsync(GetUserId());
            preferences ??= new();

            var suggestions = await _exploreService.GenerateSuggestionsAsync(preferences, cancellationToken);
            return Ok(suggestions);
        }
    }
}