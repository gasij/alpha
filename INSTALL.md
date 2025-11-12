# Инструкция по установке и запуску

## Требования

- Node.js 18+
- npm или yarn
- OpenAI API ключ

## Установка

### 1. Клонирование и настройка окружения

```bash
cd alpha
```

### 2. Backend установка

```bash
cd backend

# Установка зависимостей
npm install

# Создание файла .env (используем Ollama локально)
echo "LLM_PROVIDER=ollama" > .env
echo "OLLAMA_MODEL=llama2" >> .env
echo "PORT=8000" >> .env
echo "NODE_ENV=development" >> .env

# Запуск сервера в режиме разработки
npm run dev

# Или в продакшн режиме
npm start
```

Backend будет доступен на `http://localhost:8000`

### 3. Frontend установка

Откройте новый терминал:

```bash
cd frontend

# Установка зависимостей
npm install

# Запуск приложения
npm start
```

Frontend будет доступен на `http://localhost:3000`

## Быстрый запуск

Если у вас установлены все зависимости, можно использовать скрипт:

```bash
chmod +x start.sh
./start.sh
```

## Установка Ollama (локальная модель)

1. Установите Ollama:
```bash
# Linux/Mac
curl -fsSL https://ollama.ai/install.sh | sh

# Windows: скачайте установщик с https://ollama.ai
```

2. Скачайте модель:
```bash
ollama pull llama2
# или другую модель: mistral, codellama, neural-chat
```

3. Убедитесь, что Ollama запущен (он запускается автоматически)

## Проверка работы

1. Откройте браузер на http://localhost:3000
2. Выберите категорию (например, "Юридические вопросы")
3. Задайте вопрос, например: "Как оформить договор с поставщиком?"
4. Получите ответ от AI-помощника

## API Endpoints

Основные endpoints:
- `GET /` - Информация о API
- `GET /health` - Проверка здоровья сервиса
- `GET /categories` - Список категорий
- `POST /chat` - Отправка сообщения AI-помощнику
- `POST /analyze-data` - Анализ операционных данных
- `POST /generate-content` - Генерация маркетингового контента

## Решение проблем

### Backend не запускается

- Проверьте, что установлен Node.js 18+
- Убедитесь, что установлены зависимости: `npm install`
- Проверьте наличие файла `.env` с `OPENAI_API_KEY`

### Frontend не запускается

- Проверьте, что установлен Node.js 16+
- Удалите `node_modules` и запустите `npm install` заново
- Проверьте, что порт 3000 свободен

### Ошибки API

- Убедитесь, что backend запущен на порту 8000
- Проверьте, что Ollama запущен: `ollama list`
- Убедитесь, что модель скачана: `ollama pull llama2`
- Проверьте настройки в `.env` файле

