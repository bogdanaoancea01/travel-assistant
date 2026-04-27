using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NuGet.Common;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using travel_assistant_backend.DTOs.Authentication;
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

        [HttpPost("signin")]
        public IActionResult SignIn([FromBody] SignInDTO signInDTO)
        {
            if (signInDTO == null) return BadRequest("Invalid request");

            var user = _context.Users.FirstOrDefault(u => u.Email == signInDTO.Email);

            if (user == null) return Unauthorized("Invalid credentials");

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, signInDTO.PasswordHash);

            if (result == PasswordVerificationResult.Failed)
                return Unauthorized("Invalid credentials");

            var claims = new[]
            {
                new Claim("email", user.Email),
                new Claim("firstName", user.FirstName),
                new Claim("lastName", user.LastName),
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "yourIssuer",
                audience: "yourAudience",
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token)
            });
        }

        [HttpPost("signup")]
        public IActionResult SignUp([FromBody] SignUpDTO signUpDTO)
        {
            if (string.IsNullOrWhiteSpace(signUpDTO.Email) ||
                string.IsNullOrWhiteSpace(signUpDTO.PasswordHash))
            {
                return BadRequest("Email and password are required");
            }

            var existingUser = _context.Users
                .FirstOrDefault(u => u.Email == signUpDTO.Email);

            if (existingUser != null)
                return BadRequest("User already exists");

            var user = new User
            {
                FirstName = signUpDTO.FirstName,
                LastName = signUpDTO.LastName,
                Email = signUpDTO.Email
            };

            var claims = new[]
            {
                new Claim("email", user.Email),
                new Claim("firstName", user.FirstName),
                new Claim("lastName", user.LastName),
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, signUpDTO.PasswordHash);

            _context.Users.Add(user);
            _context.SaveChanges();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(120),
                signingCredentials: creds);

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new
            {
                message = "User registered successfully",
                token = tokenString
            });
        }
    }
}
