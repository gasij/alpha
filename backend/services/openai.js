/**
 * Генерирует предложения для дальнейших вопросов
 */
export async function generateSuggestions(category, userMessage, provider, config) {
  if (!provider) {
    return [];
  }

  try {
    const prompt = `На основе вопроса пользователя: "${userMessage}"
Предложи 3 коротких (до 5 слов) вопроса, которые могут быть полезны владельцу малого бизнеса в категории "${category}".
Верни только вопросы, каждый с новой строки, без нумерации.`;

    const messages = [
      { role: 'system', content: 'Ты помощник, который предлагает релевантные вопросы.' },
      { role: 'user', content: prompt }
    ];

    const suggestionsText = await provider.chat(messages, {
      model: config.FALLBACK_MODEL,
      temperature: 0.8,
      max_tokens: 100
    });

    const suggestions = suggestionsText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .slice(0, 3);

    return suggestions;
  } catch (error) {
    console.warn('Failed to generate suggestions:', error.message);
    return [];
  }
}

