namespace TravelAssistant.Services
{
    public interface IEmailService
    {
        Task SendAsync(string to, string subject, string body);
    }

    public class EmailService : IEmailService
    {
        public Task SendAsync(string to, string subject, string body)
        {
            // TEMP
            Console.WriteLine($"EMAIL TO: {to}");
            Console.WriteLine(subject);
            Console.WriteLine(body);

            return Task.CompletedTask;
        }
    }
}
