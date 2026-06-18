using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using travel_assistant_backend.Services.Photos;

namespace travel_assistant_backend.Controllers
{
    [ApiController]
    [Authorize]
    public class PhotosController : ControllerBase
    {
        private readonly IPhotosService _photosService;

        public PhotosController(IPhotosService photosService)
        {
            _photosService = photosService;
        }

        // GET
        // Returns a JSON array of image URLs
        [HttpGet("photos")]
        public async Task<IActionResult> Search(
            [FromQuery] string query,
            [FromQuery] int count = 1,
            [FromQuery] string? orientation = null,
            CancellationToken cancellationToken = default)
        {
            var urls = await _photosService.SearchPhotosAsync(query, count, orientation, cancellationToken);
            return Ok(urls);
        }
    }
}
