using Microsoft.AspNetCore.WebUtilities;
using System.Security.Cryptography;

namespace TravelAssistant.Services
{
    public class TokenService
    {
        public static string GenerateToken(int size = 32)
        {
            return WebEncoders.Base64UrlEncode(
                RandomNumberGenerator.GetBytes(size)
            );
        }
    }
}
