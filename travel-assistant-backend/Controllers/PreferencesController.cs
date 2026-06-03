using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using travel_assistant_backend.DTOs.UserPreference;
using travel_assistant_backend.Services.Preferences;

namespace travel_assistant_backend.Controllers
{
    [ApiController]
    [Route("api/preferences")]
    [Authorize]
    public class PreferencesController : ControllerBase
    {
        private readonly IPreferencesService _preferencesService;

        public PreferencesController(IPreferencesService preferencesService)
        {
            _preferencesService = preferencesService;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue("userId")!);

        // GET api/preferences
        [HttpGet]
        public async Task<IActionResult> GetPreferences()
        {
            var prefs = await _preferencesService.GetPreferencesAsync(GetUserId());

            if (prefs == null)
                return NoContent();

            return Ok(prefs);
        }

        // PUT api/preferences
        [HttpPut]
        public async Task<IActionResult> UpsertPreferences([FromBody] UserPreferencesDTO dto)
        {
            if (dto == null)
                return BadRequest("Preferences body is required.");

            var saved = await _preferencesService.UpsertPreferencesAsync(GetUserId(), dto);
            return Ok(saved);
        }

        // DELETE api/preferences/field/HomeCity
        [HttpDelete("field/{fieldName}")]
        public async Task<IActionResult> DeleteField(string fieldName)
        {
            var updated = await _preferencesService.DeleteFieldAsync(GetUserId(), fieldName);

            if (updated == null)
                return NotFound("No preferences found for this user.");

            return Ok(updated);
        }
         
        // DELETE api/preferences
        // Resets all preferences for the current user
        [HttpDelete]
        public async Task<IActionResult> DeletePreferences()
        {
            await _preferencesService.DeletePreferencesAsync(GetUserId());
            return NoContent();
        }
    }
}
