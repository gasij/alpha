/**
 * Базовый класс для провайдеров LLM
 */
export class BaseLLMProvider {
  constructor(config) {
    this.config = config;
  }

  /**
   * Создает запрос к LLM
   * @param {Array} messages - Массив сообщений в формате {role, content}
   * @param {Object} options - Дополнительные опции (temperature, max_tokens и т.д.)
   * @returns {Promise<string>} - Ответ от модели
   */
  async chat(messages, options = {}) {
    throw new Error('Метод chat должен быть реализован в подклассе');
  }

  /**
   * Проверяет доступность провайдера
   * @returns {Promise<boolean>}
   */
  async isAvailable() {
    throw new Error('Метод isAvailable должен быть реализован в подклассе');
  }
}

