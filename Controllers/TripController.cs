using Microsoft.AspNetCore.Mvc;
using TravelAssistant.DTOs.Trip;
using TravelAssistant.Services.Interfaces;

namespace TravelAssistant.Controllers
{
    [ApiController]
    [Route("api/trips")]
    public class TripController : ControllerBase
    {
        private readonly ITripService _tripService;

        public TripController(ITripService tripService)
        {
            _tripService = tripService;
        }

        [HttpPost("plan")]
        public async Task<ActionResult<TripPlanResponseDTO>> PlanTrip(
            [FromBody] TripPlanRequestDTO request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _tripService.GenerateTripAsync(request.Messages);
            return Ok(result);
        }
    }
}
