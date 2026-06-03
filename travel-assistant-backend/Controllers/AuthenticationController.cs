using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using travel_assistant_backend.DTOs.Authentication;
using travel_assistant_backend.DTOs.UserPreference;
using travel_assistant_backend.Models;

namespace travel_assistant_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly PasswordHasher<User> _passwordHasher = new();

        public AuthenticationController(AppDbContext context, PasswordHasher<User> passwordHasher, IConfiguration configuration)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _configuration = configuration;
        }

        private int GetUserId() =>
            int.Parse(User.FindFirstValue("userId")!);

        [HttpPost("signin")]
        public IActionResult SignIn([FromBody] SignInDTO signInDTO)
        {
            if (signInDTO == null) return BadRequest("Invalid request");

            var user = _context.Users.FirstOrDefault(u => u.Email == signInDTO.Email);
            if (user == null) return Unauthorized("Invalid credentials");

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, signInDTO.PasswordHash);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid credentials");

            var token = GenerateToken(user);
            return Ok(new { token });
        }

        [HttpPost("signup")]
        public IActionResult SignUp([FromBody] SignUpDTO signUpDTO)
        {
            if (string.IsNullOrWhiteSpace(signUpDTO.Email) ||
                string.IsNullOrWhiteSpace(signUpDTO.PasswordHash))
                return BadRequest("Email and password are required");

            if (_context.Users.Any(u => u.Email == signUpDTO.Email))
                return BadRequest("User already exists");

            var user = new User
            {
                FirstName = signUpDTO.FirstName,
                LastName = signUpDTO.LastName,
                Email = signUpDTO.Email
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, signUpDTO.PasswordHash);

            _context.Users.Add(user);
            _context.SaveChanges();

            var token = GenerateToken(user);
            return Ok(new { message = "User registered successfully", token });
        }

        // PUT api/authentication/change-password
        [HttpPut("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.CurrentPassword) || string.IsNullOrWhiteSpace(dto.NewPassword))
                return BadRequest("Current and new password are required.");

            var user = await _context.Users.FindAsync(GetUserId());
            if (user == null) return NotFound("User not found.");

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.CurrentPassword);
            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Current password is incorrect.");

            user.PasswordHash = _passwordHasher.HashPassword(user, dto.NewPassword);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password updated successfully." });
        }

        // DELETE api/authentication/delete-account
        [HttpDelete("delete-account")]
        [Authorize]
        public async Task<IActionResult> DeleteAccount()
        {
            var user = await _context.Users.FindAsync(GetUserId());
            if (user == null) return NotFound("User not found.");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private string GenerateToken(User user)
        {
            var claims = new[]
            {
                new Claim("userId", user.Id.ToString()),
                new Claim("email", user.Email),
                new Claim("firstName", user.FirstName),
                new Claim("lastName", user.LastName),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}