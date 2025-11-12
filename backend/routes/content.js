import express from 'express';
import { body, validationResult } from 'express-validator';
import config from '../config.js';
import { SYSTEM_PROMPTS } from '../constants/prompts.js';
import { getLLMProvider } from '../providers/index.js';

const router = express.Router();

const validateContent = [
  body('topic')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Тема контента обязательна'),
  body('type')
    .optional()
    .isIn(['post', 'email', 'promo'])
    .withMessage('Недопустимый тип контента'),
];

router.post('/', validateContent, async (req, res, next) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const provider = getLLMProvider();
    
    const isAvailable = await provider.isAvailable();
    if (!isAvailable) {
      return res.status(503).json({
        detail: `Провайдер ${config.LLM_PROVIDER} недоступен. Проверьте настройки.`
      });
    }

    const { type = 'post', topic, tone = 'профессиональный', length = 'средний' } = req.body;

    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({
        detail: 'Тема контента не указана'
      });
    }

    const prompt = `Создай ${type} для малого бизнеса.
Тема: ${topic}
Тон: ${tone}
Длина: ${length}

Создай готовый к использованию контент.`;

    const messages = [
      { role: 'system', content: SYSTEM_PROMPTS.marketing },
      { role: 'user', content: prompt }
    ];

    const content = await provider.chat(messages, {
      model: config.DEFAULT_MODEL,
      temperature: 0.8,
      max_tokens: 1000
    });

    res.json({
      content,
      type
    });
  } catch (error) {
    console.error('Content generation error:', error);
    next(error);
  }
});

export default router;

