import React, { useState, useEffect } from 'react';
import './App.css';
import ChatInterface from './components/ChatInterface';
import CategorySelector from './components/CategorySelector';
import Header from './components/Header';
import { Category, Message } from './types';
import { getCategories, sendMessage } from './services/api';

const App: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
    // Добавляем приветственное сообщение
    setMessages([{
      id: '1',
      text: 'Привет! Я ваш AI-помощник для бизнеса. Чем могу помочь?',
      sender: 'assistant',
      timestamp: new Date()
    }]);
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.categories);
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      category: selectedCategory
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(text, selectedCategory);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'assistant',
        timestamp: new Date(),
        category: selectedCategory,
        suggestions: response.suggestions
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Ошибка при отправке сообщения:', err);
      
      let errorMessage = 'Произошла ошибка при отправке сообщения';
      
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        errorMessage = 'Запрос занял слишком много времени. Попробуйте использовать более легкую модель или уменьшить MAX_TOKENS.';
      } else if (err.response?.data?.detail) {
        // Ошибка от backend (503, 500 и т.д.)
        errorMessage = err.response.data.detail;
      } else if (err.response?.status === 503) {
        errorMessage = 'Сервис временно недоступен. Проверьте, что Ollama запущен и модель загружена.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Добавляем сообщение о смене категории
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: `Переключено на категорию: ${category.name} ${category.icon}`,
        sender: 'system',
        timestamp: new Date()
      }]);
    }
  };

  return (
    <div className="app">
      <Header />
      <div className="app-container">
        <CategorySelector
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default App;

