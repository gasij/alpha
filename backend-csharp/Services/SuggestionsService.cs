using BusinessAssistant.Api.Models;
using BusinessAssistant.Api.Services.Providers;

namespace BusinessAssistant.Api.Services;

public class SuggestionsService : ISuggestionsService
{
    private readonly IConfigurationService _configService;

    public SuggestionsService(IConfigurationService configService)
    {
        _configService = configService;
    }

    public async Task<List<string>> GenerateSuggestionsAsync(string category, string userMessage, ILLMProvider provider)
    {
        try
        {
            var config = _configService.GetConfig();
            var prompt = $"На основе вопроса пользователя: \"{userMessage}\"\n" +
                        $"Предложи 3 коротких (до 5 слов) вопроса, которые могут быть полезны владельцу малого бизнеса в категории \"{category}\".\n" +
                        $"Верни только вопросы, каждый с новой строки, без нумерации.";

            var messages = new List<Message>
            {
                new() { Role = "system", Content = "Ты помощник, который предлагает релевантные вопросы." },
                new() { Role = "user", Content = prompt }
            };

            var options = new Providers.ChatOptions
            {
                Model = config.FallbackModel,
                Temperature = 0.8,
                MaxTokens = 100
            };

            var suggestionsText = await provider.ChatAsync(messages, options);

            var suggestions = suggestionsText
                .Split('\n', StringSplitOptions.RemoveEmptyEntries)
                .Select(s => s.Trim())
                .Where(s => s.Length > 0)
                .Take(3)
                .ToList();

            return suggestions;
        }
        catch
        {
            return new List<string>();
        }
    }
}

