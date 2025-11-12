import { BaseLLMProvider } from './base.js';

export class OllamaProvider extends BaseLLMProvider {
  constructor(config) {
    super(config);
    this.baseURL = config.OLLAMA_BASE_URL;
  }

  async chat(messages, options = {}) {
    const model = options.model || this.config.DEFAULT_MODEL;
    
    // Используем AbortController для таймаута (60 секунд для локальных моделей)
    // llama2 может быть медленной, особенно при первой загрузке
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    
    try {
      // Используем chat API вместо generate для лучшей поддержки контекста
      const response = await fetch(`${this.baseURL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: messages, // Ollama поддерживает формат OpenAI messages
          stream: false,
          options: {
            temperature: options.temperature ?? this.config.TEMPERATURE,
            num_predict: options.max_tokens ?? this.config.MAX_TOKENS,
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error: ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      return data.message?.content || data.response || '';
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Запрос к Ollama превысил время ожидания (60 секунд). Модель слишком медленная. Попробуйте предзагрузить модель командой: ollama run llama2');
      }
      throw error;
    }
  }

  // Метод formatMessages больше не нужен, так как используем chat API
  // Оставлен для совместимости, если понадобится fallback
  formatMessages(messages) {
    // Конвертируем формат OpenAI в простой текст для Ollama (fallback)
    let prompt = '';
    for (const msg of messages) {
      if (msg.role === 'system') {
        prompt += `System: ${msg.content}\n\n`;
      } else if (msg.role === 'user') {
        prompt += `User: ${msg.content}\n\n`;
      } else if (msg.role === 'assistant') {
        prompt += `Assistant: ${msg.content}\n\n`;
      }
    }
    prompt += 'Assistant:';
    return prompt;
  }

  async isAvailable() {
    try {
      // Используем AbortController для таймаута
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${this.baseURL}/api/tags`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('Ollama availability check timed out');
      } else {
        console.warn('Ollama availability check failed:', error.message);
      }
      return false;
    }
  }
}

