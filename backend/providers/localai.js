import { BaseLLMProvider } from './base.js';

export class LocalAIProvider extends BaseLLMProvider {
  constructor(config) {
    super(config);
    this.baseURL = config.LOCALAI_BASE_URL;
  }

  async chat(messages, options = {}) {
    const model = options.model || this.config.DEFAULT_MODEL;

    // LocalAI использует OpenAI-совместимый API
    const response = await fetch(`${this.baseURL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: options.temperature ?? this.config.TEMPERATURE,
        max_tokens: options.max_tokens ?? this.config.MAX_TOKENS
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LocalAI API error: ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async isAvailable() {
    try {
      // Используем AbortController для таймаута
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${this.baseURL}/v1/models`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.warn('LocalAI availability check timed out');
      } else {
        console.warn('LocalAI availability check failed:', error.message);
      }
      return false;
    }
  }
}

