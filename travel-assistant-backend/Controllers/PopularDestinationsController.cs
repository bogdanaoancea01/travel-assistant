using Microsoft.AspNetCore.Mvc;
using travel_assistant_backend.Services.PopularDestinations;

namespace travel_assistant_backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PopularDestinationsController : ControllerBase
    {
        private readonly IPopularDestinationsService _service;

        public PopularDestinationsController(IPopularDestinationsService service)
        {
            _service = service;
        }

        
        [HttpGet("generatedestinations")]
        public async Task<IActionResult> Get(CancellationToken cancellationToken)
        {
            var destinations = await _service.GetRandomAsync(cancellationToken);
            return Ok(destinations);
        }
    }
}
