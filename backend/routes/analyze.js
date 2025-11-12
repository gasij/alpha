import express from 'express';
import config from '../config.js';
import { SYSTEM_PROMPTS } from '../constants/prompts.js';
import { getLLMProvider } from '../providers/index.js';

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const provider = getLLMProvider();
    
    const isAvailable = await provider.isAvailable();
    if (!isAvailable) {
      return res.status(503).json({
        detail: `Провайдер ${config.LLM_PROVIDER} недоступен. Проверьте настройки.`
      });
    }

    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({
        detail: 'Данные для анализа не предоставлены'
      });
    }

    const dataStr = JSON.stringify(data, null, 2);

    const prompt = `Проанализируй следующие данные бизнеса и дай практические рекомендации:

${dataStr}

Предоставь:
1. Краткий анализ текущей ситуации
2. Выявленные проблемы или возможности
3. Конкретные рекомендации по улучшению
4. Приоритетные действия`;

    const messages = [
      { role: 'system', content: SYSTEM_PROMPTS.finance },
      { role: 'user', content: prompt }
    ];

    const analysis = await provider.chat(messages, {
      model: config.DEFAULT_MODEL,
      temperature: 0.5,
      max_tokens: 1500
    });

    res.json({ analysis });
  } catch (error) {
    console.error('Analyze error:', error);
    next(error);
  }
});

export default router;

