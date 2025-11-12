import OpenAI from 'openai';
import { BaseLLMProvider } from './base.js';

export class OpenAIProvider extends BaseLLMProvider {
  constructor(config) {
    super(config);
    this.client = config.OPENAI_API_KEY 
      ? new OpenAI({
          apiKey: config.OPENAI_API_KEY,
          baseURL: config.OPENAI_BASE_URL
        })
      : null;
  }

  async chat(messages, options = {}) {
    if (!this.client) {
      throw new Error('OpenAI API ключ не установлен');
    }

    const response = await this.client.chat.completions.create({
      model: options.model || this.config.DEFAULT_MODEL,
      messages: messages,
      temperature: options.temperature ?? this.config.TEMPERATURE,
      max_tokens: options.max_tokens ?? this.config.MAX_TOKENS
    });

    return response.choices[0].message.content;
  }

  async isAvailable() {
    return this.client !== null;
  }
}

