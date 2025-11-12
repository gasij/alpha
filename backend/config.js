import dotenv from 'dotenv';

dotenv.config();

class Config {
  constructor() {
    this.PORT = process.env.PORT || 8000;
    this.NODE_ENV = process.env.NODE_ENV || 'development';
    
    // LLM Provider selection: 'ollama', 'localai', 'openrouter' (openai removed - use local models)
    this.LLM_PROVIDER = process.env.LLM_PROVIDER || 'ollama';
    
    // OpenAI settings
    this.OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    this.OPENAI_BASE_URL = process.env.OPENAI_BASE_URL; // For custom endpoints
    
    // Ollama settings (local)
    this.OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    this.OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama2'; // or 'mistral', 'codellama', etc.
    
    // Open Router settings
    this.OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    this.OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4-turbo';
    
    // LocalAI settings
    this.LOCALAI_BASE_URL = process.env.LOCALAI_BASE_URL || 'http://localhost:8080';
    this.LOCALAI_MODEL = process.env.LOCALAI_MODEL || 'gpt-4';
    
    // Model settings (provider-agnostic)
    this.DEFAULT_MODEL = process.env.DEFAULT_MODEL || this.getDefaultModel();
    this.FALLBACK_MODEL = process.env.FALLBACK_MODEL || this.getFallbackModel();
    // Для локальных моделей используем меньше токенов для ускорения
    // Уменьшено до 50 для очень быстрых ответов (2-5 секунд)
    this.MAX_TOKENS = parseInt(process.env.MAX_TOKENS) || (this.LLM_PROVIDER === 'ollama' ? 50 : 1000);
    this.TEMPERATURE = parseFloat(process.env.TEMPERATURE) || 0.7;
    
    // API settings
    this.API_TITLE = 'Бизнес-Помощник API';
    this.API_VERSION = '1.0.0';
  }
  
  getDefaultModel() {
    switch (this.LLM_PROVIDER) {
      case 'ollama':
        return this.OLLAMA_MODEL;
      case 'openrouter':
        return this.OPENROUTER_MODEL;
      case 'localai':
        return this.LOCALAI_MODEL;
      default:
        return this.OLLAMA_MODEL; // Default to Ollama model
    }
  }
  
  getFallbackModel() {
    switch (this.LLM_PROVIDER) {
      case 'ollama':
        return 'llama2'; // Используем llama2 как fallback (лучше поддерживает русский)
      case 'openrouter':
        return 'openai/gpt-3.5-turbo';
      case 'localai':
        return this.LOCALAI_MODEL;
      default:
        return 'llama2'; // Default to llama2 fallback
    }
  }
  
  validate() {
    // Validate based on selected provider
    switch (this.LLM_PROVIDER) {
      case 'openrouter':
        if (!this.OPENROUTER_API_KEY) {
          console.warn('⚠️  OPENROUTER_API_KEY не установлен.');
        }
        break;
      case 'ollama':
        console.log('✅ Используется Ollama (локально). Убедитесь, что Ollama запущен.');
        console.log(`   Модель: ${this.OLLAMA_MODEL}`);
        console.log(`   URL: ${this.OLLAMA_BASE_URL}`);
        break;
      case 'localai':
        console.log('✅ Используется LocalAI (локально). Убедитесь, что LocalAI запущен.');
        console.log(`   Модель: ${this.LOCALAI_MODEL}`);
        console.log(`   URL: ${this.LOCALAI_BASE_URL}`);
        break;
      default:
        console.warn(`⚠️  Неизвестный провайдер: ${this.LLM_PROVIDER}. Используйте 'ollama' или 'localai' для локальных моделей.`);
    }
    return true;
  }
}

const config = new Config();

export default config;

