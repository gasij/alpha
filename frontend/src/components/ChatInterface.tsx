import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  error: string | null;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
  error,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex-1 flex flex-col glass-card rounded-xl overflow-hidden min-h-[500px] max-h-[calc(100vh-300px)] animate-scale-in">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4 custom-scrollbar">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`
              flex flex-col max-w-[80%] sm:max-w-[75%] 
              animate-fade-in-up
              transition-all duration-300 hover:scale-[1.02]
              ${
                message.sender === 'user'
                  ? 'self-end'
                  : message.sender === 'system'
                  ? 'self-center max-w-full'
                  : 'self-start'
              }
            `}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {message.sender === 'system' ? (
              <div className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 rounded-xl text-sm text-center italic animate-scale-in hover:bg-primary/25 transition-colors">
                {message.text}
              </div>
            ) : (
              <>
                <div
                  className={`
                    px-4 py-3 rounded-2xl relative
                    transition-all duration-300
                    hover:shadow-lg
                    ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02]'
                        : 'bg-card/80 text-card-foreground border border-border/50 rounded-bl-md backdrop-blur-sm hover:border-primary/30 hover:bg-card/90'
                    }
                  `}
                >
                  <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                    {message.text}
                  </div>
                  <div className="text-xs opacity-70 mt-2 transition-opacity hover:opacity-100">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    {message.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1.5 text-xs sm:text-sm glass-button rounded-full text-primary hover:bg-primary/20 hover:border-primary/50 transition-all hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-primary/20 animate-scale-in"
                        style={{ animationDelay: `${0.3 + idx * 0.05}s` }}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex self-start max-w-[75%] animate-fade-in-up">
            <div className="px-4 py-3 bg-card/80 text-card-foreground border border-border/50 rounded-2xl rounded-bl-md backdrop-blur-sm">
              <div className="flex gap-2 items-center">
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.4s' }}></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '1.4s' }}></span>
                <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1.4s' }}></span>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="flex self-start max-w-[75%] animate-fade-in-up">
            <div className="px-4 py-3 bg-destructive/20 text-destructive border border-destructive/30 rounded-2xl rounded-bl-md">
              <div className="text-sm font-medium">{error}</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 p-4 sm:p-5 border-t border-border/40 glass transition-all hover:border-primary/20"
      >
        <textarea
          ref={inputRef}
          className="flex-1 glass-input rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground resize-none max-h-[150px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all hover:border-primary/30"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Задайте вопрос или опишите задачу..."
          rows={1}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full glass-button text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-95 transition-all flex items-center justify-center flex-shrink-0 hover:shadow-lg hover:shadow-primary/30 group"
        >
          <span className="text-xl sm:text-2xl transform rotate-[-90deg] group-hover:translate-x-0.5 transition-transform">➤</span>
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
