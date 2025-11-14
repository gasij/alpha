using BusinessAssistant.Api.Models;
using BusinessAssistant.Api.Services;
using BusinessAssistant.Api.Services.Providers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configuration
builder.Services.Configure<AppConfig>(builder.Configuration.GetSection("AppConfig"));

// Services
builder.Services.AddSingleton<IConfigurationService, ConfigurationService>();
builder.Services.AddSingleton<ILLMProviderFactory, LLMProviderFactory>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<ISuggestionsService, SuggestionsService>();

// Configure port from appsettings
var configSection = builder.Configuration.GetSection("AppConfig");
var port = configSection.GetValue<int>("Port", 8000);
builder.WebHost.UseUrls($"http://localhost:{port}");

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

// Log startup info
var configService = app.Services.GetRequiredService<IConfigurationService>();
var config = configService.GetConfig();
Console.WriteLine($"🚀 Сервер запущен на порту {port}");
Console.WriteLine($"📚 API: http://localhost:{port}");
Console.WriteLine($"✅ Используется провайдер: {config.LlmProvider}");

app.Run();

