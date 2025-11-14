using BusinessAssistant.Api.Models;
using BusinessAssistant.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BusinessAssistant.Api.Controllers;

[ApiController]
[Route("chat")]
public class ChatController : ControllerBase
{
    private readonly IChatService _chatService;
    private readonly ILogger<ChatController> _logger;

    public ChatController(IChatService chatService, ILogger<ChatController> logger)
    {
        _chatService = chatService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<ChatResponse>> Post([FromBody] ChatRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var startTime = DateTime.UtcNow;

        try
        {
            _logger.LogInformation($"[Chat] Запрос получен, категория: {request.Category}");

            var response = await _chatService.ProcessChatAsync(request);

            var totalTime = (DateTime.UtcNow - startTime).TotalSeconds;
            _logger.LogInformation($"[Chat] Запрос обработан за {totalTime:F1} сек");

            return Ok(response);
        }
        catch (Exception ex)
        {
            var totalTime = (DateTime.UtcNow - startTime).TotalSeconds;
            _logger.LogError(ex, $"[Chat] Ошибка после {totalTime:F1} сек");

            return StatusCode(503, new { detail = ex.Message });
        }
    }
}

