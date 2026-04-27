namespace travel_assistant_backend.DTOs.Authentication
{
    public class SignInDTO
    {
        public string Email { get; set; }
        public string PasswordHash { get; set; }
    }
}
