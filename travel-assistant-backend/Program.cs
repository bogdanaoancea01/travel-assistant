using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OpenAI;
using System.Text;
using travel_assistant_backend.Models;
using travel_assistant_backend.Services;
using travel_assistant_backend.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

//JWT key + settings
var jwtSettings = builder.Configuration.GetSection("Jwt");
var jwtKey = builder.Configuration["Jwt:Key"]
          ?? throw new Exception("JWT Key is missing");

var myAllowSpecificOrigins = "ReactApp";

//OpenAI key + model
var openAiKey = builder.Configuration["OpenAI:ApiKey"]
                ?? throw new Exception("OpenAI API Key is missing");
var openAiModel = builder.Configuration["OpenAI:Model"] ?? "gpt-4o-mini";

var openAiClient = new OpenAIClient(openAiKey);
var chatClient = openAiClient.GetChatClient(openAiModel);

// Add services to the container.
builder.Services.AddControllers();

//database connection
string connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new ArgumentNullException("ConnectionString is null");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString).UseSnakeCaseNamingConvention());

//register CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

//password hash
builder.Services.AddScoped<PasswordHasher<User>>();

//jwt authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,

        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey))
    };
});

builder.Services.AddAuthorization();


//OpenAPI https://aka.ms/aspnet/openapi
builder.Services.AddSingleton(sp =>
{
    var client = new OpenAIClient(openAiKey);
    return client.GetChatClient(openAiModel);
});

builder.Services.AddScoped<IChatService, ChatService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors(myAllowSpecificOrigins);

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
