import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLoginClick: () => void;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLoginClick, onProfileClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm animate-slide-up">
      <div className="container mx-auto px-4 sm:px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
              <span className="text-primary inline-block animate-scale-in" style={{ animationDelay: '0.1s' }}>
                Бизнес-Помощник
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-medium animate-slide-up" style={{ animationDelay: '0.2s' }}>
              AI-ассистент для малого бизнеса
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={onProfileClick}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-all border border-primary/20 font-medium"
              >
                <span className="hidden sm:inline">{user.name}</span>
                <span className="text-lg">👤</span>
              </button>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-md hover:shadow-lg font-medium"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
