import express from 'express';
import cors from 'cors';
import config from './config.js';
import { chatRouter, categoriesRouter, analyzeRouter, contentRouter, providerRouter } from './routes/index.js';
import { checkProviderAvailability } from './providers/index.js';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({
    message: config.API_TITLE,
    version: config.API_VERSION
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.use('/chat', chatRouter);
app.use('/categories', categoriesRouter);
app.use('/analyze-data', analyzeRouter);
app.use('/generate-content', contentRouter);
app.use('/provider', providerRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    detail: err.message || 'Внутренняя ошибка сервера. Попробуйте позже.'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    detail: 'Endpoint не найден'
  });
});

// Start server
const PORT = config.PORT;

app.listen(PORT, async () => {
  console.log(`🚀 Сервер запущен на порту ${PORT}`);
  console.log(`📚 API: http://localhost:${PORT}`);
  
  // Validate config
  try {
    config.validate();
    console.log(`✅ Используется провайдер: ${config.LLM_PROVIDER}`);
    
    // Проверяем доступность провайдера
    const isAvailable = await checkProviderAvailability();
    if (isAvailable) {
      console.log(`✅ Провайдер ${config.LLM_PROVIDER} доступен`);
    } else {
      console.warn(`⚠️  Провайдер ${config.LLM_PROVIDER} недоступен. Проверьте настройки.`);
    }
  } catch (error) {
    console.error('⚠️  Ошибка конфигурации:', error.message);
  }
});

export default app;

