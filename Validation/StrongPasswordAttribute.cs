using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace TravelAssistant.Validation
{
    public class StrongPasswordAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(
            object? value,
            ValidationContext validationContext)
        {
            if (value is not string password)
                return new ValidationResult("Password is required");

            var regex = new Regex(
                @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$");

            return regex.IsMatch(password)
                ? ValidationResult.Success
                : new ValidationResult(
                    "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
        }
    }
}
