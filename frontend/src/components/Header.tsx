import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border/40 backdrop-blur-xl animate-slide-up">
      <div className="container mx-auto px-4 sm:px-6 py-5">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            <span className="glow-text inline-block animate-scale-in" style={{ animationDelay: '0.1s' }}>
              Бизнес-Помощник
            </span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-medium animate-slide-up" style={{ animationDelay: '0.2s' }}>
            AI-ассистент для малого бизнеса
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
