import React from 'react';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="header-title">
          <span className="header-icon">🤖</span>
          Бизнес-Помощник
        </h1>
        <p className="header-subtitle">AI-ассистент для малого бизнеса</p>
      </div>
    </header>
  );
};

export default Header;

