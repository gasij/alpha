import config from '../config.js';
import { OpenAIProvider } from './openai.js';
import { OllamaProvider } from './ollama.js';
import { OpenRouterProvider } from './openrouter.js';
import { LocalAIProvider } from './localai.js';

let providerInstance = null;

/**
 * Получает экземпляр провайдера LLM
 */
export function getLLMProvider() {
  if (providerInstance) {
    return providerInstance;
  }

  switch (config.LLM_PROVIDER) {
    case 'ollama':
      providerInstance = new OllamaProvider(config);
      break;
    case 'openrouter':
      providerInstance = new OpenRouterProvider(config);
      break;
    case 'localai':
      providerInstance = new LocalAIProvider(config);
      break;
    case 'openai':
      // OpenAI доступен, но не рекомендуется - используйте локальные модели
      providerInstance = new OpenAIProvider(config);
      break;
    default:
      // По умолчанию используем Ollama для локальной работы
      console.log('⚠️  Провайдер не указан, используем Ollama по умолчанию');
      providerInstance = new OllamaProvider(config);
      break;
  }

  return providerInstance;
}

/**
 * Проверяет доступность текущего провайдера
 */
export async function checkProviderAvailability() {
  const provider = getLLMProvider();
  try {
    return await provider.isAvailable();
  } catch (error) {
    console.error('Provider availability check failed:', error);
    return false;
  }
}

export { OpenAIProvider, OllamaProvider, OpenRouterProvider, LocalAIProvider };

