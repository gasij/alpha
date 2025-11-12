import axios from 'axios';
import { Category, ChatResponse } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 70000, // 70 секунд таймаут для локальных моделей (60 сек на backend + запас)
});

export const getCategories = async (): Promise<{ categories: Category[] }> => {
  const response = await api.get('/categories');
  return response.data;
};

export const sendMessage = async (
  message: string,
  category: string = 'general'
): Promise<ChatResponse> => {
  const response = await api.post('/chat', {
    message,
    category,
  });
  return response.data;
};

export const analyzeData = async (data: any): Promise<{ analysis: string }> => {
  const response = await api.post('/analyze-data', data);
  return response.data;
};

export const generateContent = async (request: {
  type: string;
  topic: string;
  tone?: string;
  length?: string;
}): Promise<{ content: string; type: string }> => {
  const response = await api.post('/generate-content', request);
  return response.data;
};

export default api;

