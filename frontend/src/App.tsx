import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import CategorySelector from './components/CategorySelector';
import Header from './components/Header';
import AnimatedBackground from './components/AnimatedBackground';
import AuthModal from './components/AuthModal';
import RegisterModal from './components/RegisterModal';
import ProfileModal from './components/ProfileModal';
import { Category, Message, User } from './types';
import { getCategories, sendMessage } from './services/api';

const App: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('general');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    loadCategories();
    // Проверяем сохраненного пользователя
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    
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
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: `Переключено на категорию: ${category.name}`,
        sender: 'system',
        timestamp: new Date()
      }]);
    }
  };

  // Auth handlers
  const handleLogin = async (email: string, password: string) => {
    // Имитация авторизации (в реальном приложении здесь будет API запрос)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name: email.split('@')[0],
      createdAt: new Date(),
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleRegister = async (name: string, email: string, password: string, phone?: string) => {
    // Имитация регистрации (в реальном приложении здесь будет API запрос)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      phone,
      createdAt: new Date(),
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const handleUpdateProfile = async (name: string, phone?: string) => {
    if (!user) return;
    
    // Имитация обновления (в реальном приложении здесь будет API запрос)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedUser: User = {
      ...user,
      name,
      phone,
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setShowProfileModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 flex flex-col flex-1">
        <Header
          user={user}
          onLoginClick={() => setShowAuthModal(true)}
          onProfileClick={() => setShowProfileModal(true)}
        />
        <div className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Боковое меню */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <CategorySelector
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
              />
            </aside>
            
            {/* Основной контент - чат */}
            <main className="flex-1 min-w-0">
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                error={error}
              />
            </main>
          </div>
        </div>
      </div>

      {/* Модальные окна */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSwitchToRegister={() => {
          setShowAuthModal(false);
          setShowRegisterModal(true);
        }}
        onLogin={handleLogin}
      />

      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowAuthModal(true);
        }}
        onRegister={handleRegister}
      />

      {user && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
          onUpdate={handleUpdateProfile}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
