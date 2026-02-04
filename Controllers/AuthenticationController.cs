using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TravelAssistant.DTOs.Authentication;
using TravelAssistant.Models;
using TravelAssistant.Services;
using TravelAssistant.Services.Interfaces;

namespace TravelAssistant.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthenticationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<User> _passwordHasher;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public AuthenticationController(AppDbContext context, PasswordHasher<User> passwordHasher, IEmailService emailService, IConfiguration configuration)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _emailService = emailService;
            _configuration = configuration;
        }


        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] SignUpDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var emailExists = await _context.Users
                .AnyAsync(u => u.Email == dto.Email);

            if (emailExists)
                return BadRequest("Email already in use");

            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
            };

            user.PasswordHash =
                _passwordHasher.HashPassword(user, dto.Password);

            user.EmailConfirmationToken = TokenService.GenerateToken();

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var confirmationLink =
                $"{_configuration["FrontendUrl"]}/confirm-email" +
                $"?token={user.EmailConfirmationToken}&email={user.Email}";

            await _emailService.SendAsync(
                user.Email,
                "Confirm your email",
                confirmationLink
            );

            return Ok(new { message = "User created successfully" });
        }


        [HttpPost("signin")]
        public async Task<IActionResult> SignIn([FromBody] SignInDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null)
                return Unauthorized("Invalid credentials");

            var result = _passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                dto.Password
            );

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid credentials");

            return Ok(new
            {
                message = "Login successful",
                user = new
                {
                    user.Id,
                    user.FirstName,
                    user.LastName,
                    user.Email
                }
            });
        }
    }
}
