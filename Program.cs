using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OpenAI;
using TravelAssistant.Models;
using TravelAssistant.Services;


var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddSingleton(_ =>
{
    var apiKey = builder.Configuration["OPENAI_API_KEY"];
    return new OpenAIClient(apiKey);
});

builder.Services.AddControllers();

builder.Services.AddScoped<PasswordHasher<User>>();

builder.Services.AddScoped<IEmailService, EmailService>();


string connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException("ConnectionString is null");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:5173")
                          .AllowAnyMethod()
                          .AllowAnyHeader();    //X-pagination
                      });
});

var app = builder.Build();

app.UseCors(MyAllowSpecificOrigins);

app.MapControllers();

app.Run();
