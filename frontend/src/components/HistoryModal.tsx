import React, { useState, useEffect } from 'react';
import { ChatHistory, Message } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ChatHistory[];
  onLoadHistory: (messages: Message[]) => void;
  onDeleteHistory: (id: string) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onLoadHistory,
  onDeleteHistory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      item.title?.toLowerCase().includes(searchLower) ||
      item.messages.some((msg) => msg.text.toLowerCase().includes(searchLower))
    );
  });

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Вчера';
    } else if (days < 7) {
      return `${days} дн. назад`;
    } else {
      return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  };

  const getHistoryTitle = (messages: Message[]) => {
    const firstUserMessage = messages.find((msg) => msg.sender === 'user');
    if (firstUserMessage) {
      const text = firstUserMessage.text;
      return text.length > 50 ? text.substring(0, 50) + '...' : text;
    }
    return 'Без названия';
  };

  const handleLoadHistory = (item: ChatHistory) => {
    onLoadHistory(item.messages);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">История запросов</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        <div className="p-4 border-b border-border">
          <input
            type="text"
            placeholder="Поиск по истории..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-muted rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? 'Ничего не найдено' : 'История пуста'}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/30 hover:shadow-md transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground truncate">
                          {item.title || getHistoryTitle(item.messages)}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {item.messages.length} сообщений • Категория: {item.category}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {item.messages
                          .filter((msg) => msg.sender === 'user')
                          .slice(0, 1)
                          .map((msg) => msg.text)
                          .join(' ')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleLoadHistory(item)}
                        className="px-3 py-1.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all text-sm font-medium opacity-0 group-hover:opacity-100"
                      >
                        Загрузить
                      </button>
                      <button
                        onClick={() => onDeleteHistory(item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all opacity-0 group-hover:opacity-100"
                        title="Удалить"
                      >
                        <span className="text-lg">×</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Всего: {history.length} {history.length === 1 ? 'запрос' : history.length < 5 ? 'запроса' : 'запросов'}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-all font-medium"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;

