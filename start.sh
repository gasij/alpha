#!/bin/bash

# Скрипт для запуска приложения

echo "🚀 Запуск Бизнес-Помощника..."

# Проверка наличия .env файла
if [ ! -f backend/.env ]; then
    echo "⚠️  Файл backend/.env не найден!"
    echo "Создайте файл backend/.env с содержимым:"
    echo "OPENAI_API_KEY=your_api_key_here"
    echo "PORT=8000"
    exit 1
fi

# Проверка установки зависимостей backend
if [ ! -d backend/node_modules ]; then
    echo "📦 Установка зависимостей backend..."
    cd backend
    npm install
    cd ..
fi

# Запуск backend в фоне
echo "📡 Запуск backend сервера..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Ожидание запуска backend
sleep 3

# Запуск frontend
echo "🎨 Запуск frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "✅ Приложение запущено!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Для остановки нажмите Ctrl+C"

# Ожидание завершения
wait

