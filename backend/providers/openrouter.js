import { BaseLLMProvider } from './base.js';

export class OpenRouterProvider extends BaseLLMProvider {
  constructor(config) {
    super(config);
    this.apiKey = config.OPENROUTER_API_KEY;
    this.baseURL = 'https://openrouter.ai/api/v1';
  }

  async chat(messages, options = {}) {
    if (!this.apiKey) {
      throw new Error('OpenRouter API ключ не установлен');
    }

    const model = options.model || this.config.DEFAULT_MODEL;

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'http://localhost:3000', // Optional
        'X-Title': 'Business Assistant'
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: options.temperature ?? this.config.TEMPERATURE,
        max_tokens: options.max_tokens ?? this.config.MAX_TOKENS
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenRouter API error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  async isAvailable() {
    return this.apiKey !== null && this.apiKey !== undefined;
  }
}

