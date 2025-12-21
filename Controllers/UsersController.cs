using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelAssistant.Models;

namespace TravelAssistant.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]  //POST /api/users
        public async Task<IActionResult> AddUser(User user)
        {
            try
            {
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                return CreatedAtRoute("GetUser", new { id = user.Id }, user); // 201 Created status code + location of the resource (http://localhost:3000/api/user/id) + user object
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // 500 internal server err + message
            }
        }


        [HttpGet]   //GET /api/users
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await _context.Users.ToListAsync();
                return Ok(users); // 200 ok status + person object
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // 500 internal server err + message
            }
        }

        [HttpGet("{id:int}", Name = "GetUser")]   //GET /api/users
        public async Task<IActionResult> GetUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user is null)
                {
                    return NotFound();
                }

                return Ok(user); // 200 ok status + user object
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // 500 internal server err + message
            }
        }

        [HttpPut("{id:int}")]  //PUT /api/users

        public async Task<IActionResult> UpdatePerson(int id, [FromBody] User user)
        {
            try
            {
                if (id != user.Id)
                {
                    return BadRequest("Id in url and body missmatches");    //400 + message
                }
                if (!await _context.Users.AnyAsync(u => u.Id == id))
                {
                    return NotFound();  //404 not found
                }
                _context.Users.Update(user);
                await _context.SaveChangesAsync();
                return NoContent();     //204 status code
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // 500 internal server err + message
            }
        }

        [HttpDelete("{id:int}")]  //DELETE /api/users

        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);

                if (user is null)
                {
                    return NotFound();  //404 not found status
                }

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return NoContent();     //204 status code
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex.Message); // 500 internal server err + message
            }
        }

    }
}
