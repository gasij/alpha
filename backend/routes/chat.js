import express from 'express';
import { body, validationResult } from 'express-validator';
import config from '../config.js';
import { SYSTEM_PROMPTS } from '../constants/prompts.js';
import { generateSuggestions } from '../services/openai.js';
import { getLLMProvider } from '../providers/index.js';

const router = express.Router();

// Validation middleware
const validateChat = [
  body('message')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Сообщение должно быть от 1 до 2000 символов'),
  body('category')
    .optional()
    .isIn(['general', 'legal', 'marketing', 'finance', 'documents'])
    .withMessage('Недопустимая категория'),
];

router.post('/', validateChat, async (req, res, next) => {
  const startTime = Date.now();
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const provider = getLLMProvider();
    
    // Проверяем доступность провайдера
    const isAvailable = await provider.isAvailable();
    if (!isAvailable) {
      return res.status(503).json({
        detail: `Провайдер ${config.LLM_PROVIDER} недоступен. Проверьте настройки и убедитесь, что сервис запущен.`
      });
    }

    console.log(`[Chat] Запрос получен, категория: ${req.body.category || 'general'}`);

    const { message, category = 'general', context } = req.body;
    const selectedCategory = SYSTEM_PROMPTS[category] ? category : 'general';
    const systemPrompt = SYSTEM_PROMPTS[selectedCategory];

    // Формируем контекстное сообщение
    let userMessage = message;
    if (context && Object.keys(context).length > 0) {
      const contextStr = JSON.stringify(context, null, 2);
      userMessage = `Контекст: ${contextStr}\n\nВопрос: ${message}`;
    }

    // Формируем messages для провайдера
    // Добавляем явное указание отвечать на русском
    const messages = [
      { role: 'system', content: systemPrompt + '\n\nПомни: отвечай ТОЛЬКО на русском языке.' },
      { role: 'user', content: userMessage }
    ];

    // Вызов LLM через провайдер
    let aiResponse;
    try {
      console.log(`[Chat] Отправка запроса к ${config.LLM_PROVIDER}, модель: ${config.DEFAULT_MODEL}, max_tokens: ${config.MAX_TOKENS}`);
      const llmStartTime = Date.now();
      aiResponse = await provider.chat(messages, {
        model: config.DEFAULT_MODEL,
        temperature: config.TEMPERATURE,
        max_tokens: config.MAX_TOKENS
      });
      const llmTime = ((Date.now() - llmStartTime) / 1000).toFixed(1);
      console.log(`[Chat] Ответ получен за ${llmTime} сек`);
    } catch (apiError) {
      console.error(`[Chat] ${config.LLM_PROVIDER} API error:`, apiError.message);
      
      // Пробуем использовать fallback модель
      try {
        console.log(`[Chat] Пробую fallback модель: ${config.FALLBACK_MODEL}`);
        aiResponse = await provider.chat(messages, {
          model: config.FALLBACK_MODEL,
          temperature: config.TEMPERATURE,
          max_tokens: config.MAX_TOKENS
        });
      } catch (fallbackError) {
        console.error('[Chat] Fallback model error:', fallbackError.message);
        const errorDetail = fallbackError.message || 'Сервис временно недоступен. Попробуйте позже.';
        return res.status(503).json({
          detail: errorDetail,
          error: 'LLM_ERROR',
          model: config.FALLBACK_MODEL
        });
      }
    }

    // Генерируем предложения для дальнейших вопросов
    const suggestions = await generateSuggestions(selectedCategory, message, provider, config);

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[Chat] Запрос обработан за ${totalTime} сек`);

    res.json({
      response: aiResponse,
      category: selectedCategory,
      suggestions: suggestions
    });
  } catch (error) {
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.error(`[Chat] Ошибка после ${totalTime} сек:`, error.message);
    next(error);
  }
});

export default router;

