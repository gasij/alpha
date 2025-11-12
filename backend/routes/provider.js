import express from 'express';
import config from '../config.js';
import { getLLMProvider, checkProviderAvailability } from '../providers/index.js';

const router = express.Router();

/**
 * GET /provider/info
 * Информация о текущем провайдере
 */
router.get('/info', (req, res) => {
  res.json({
    provider: config.LLM_PROVIDER,
    model: config.DEFAULT_MODEL,
    fallbackModel: config.FALLBACK_MODEL,
    available: null // Будет заполнено в /status
  });
});

/**
 * GET /provider/status
 * Проверка статуса провайдера
 */
router.get('/status', async (req, res) => {
  try {
    const isAvailable = await checkProviderAvailability();
    res.json({
      provider: config.LLM_PROVIDER,
      available: isAvailable,
      model: config.DEFAULT_MODEL
    });
  } catch (error) {
    res.status(500).json({
      provider: config.LLM_PROVIDER,
      available: false,
      error: error.message
    });
  }
});

export default router;

