export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant' | 'system';
  timestamp: Date;
  category?: string;
  suggestions?: string[];
}

export interface ChatResponse {
  response: string;
  category: string;
  suggestions?: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  createdAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ChatHistory {
  id: string;
  messages: Message[];
  category: string;
  createdAt: Date;
  title?: string;
}