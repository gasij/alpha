import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    categories: [
      { id: 'general', name: 'Общие вопросы', icon: '💼' },
      { id: 'legal', name: 'Юридические вопросы', icon: '⚖️' },
      { id: 'marketing', name: 'Маркетинг', icon: '📈' },
      { id: 'finance', name: 'Финансы', icon: '💰' },
      { id: 'documents', name: 'Документы', icon: '📝' }
    ]
  });
});

export default router;

