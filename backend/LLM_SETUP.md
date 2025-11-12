# Настройка языковых моделей

Приложение настроено для работы с **локальными языковыми моделями** для обеспечения приватности данных и работы без API ключей.

## Поддерживаемые провайдеры

### 1. Ollama (рекомендуется, по умолчанию)
Локальное развертывание моделей. Простая установка и использование.

**Установка Ollama:**
```bash
# Linux/Mac
curl -fsSL https://ollama.ai/install.sh | sh

# Windows: скачайте установщик с https://ollama.ai
```

**Запуск модели:**
```bash
# Скачать и запустить модель
ollama pull llama2
# или
ollama pull mistral
ollama pull codellama
```

**Настройка:**
```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

**Доступные модели Ollama:**
- `llama2` - Meta LLaMA 2
- `mistral` - Mistral 7B
- `codellama` - Code LLaMA
- `neural-chat` - Intel Neural Chat
- И другие на https://ollama.ai/library

### 2. LocalAI
Локальное развертывание с OpenAI-совместимым API.

**Установка LocalAI:**
```bash
# Docker
docker run -ti -p 8080:8080 --name local-ai -ti localai/localai:latest-aio-cpu

# Или с GPU
docker run -ti -p 8080:8080 --gpus all --name local-ai -ti localai/localai:latest-aio-cuda-11
```

**Настройка:**
```env
LLM_PROVIDER=localai
LOCALAI_BASE_URL=http://localhost:8080
LOCALAI_MODEL=gpt-4
```

### 3. Open Router (опционально - облачный)
Облачный API gateway с доступом к множеству моделей. Используйте только если нужен доступ к облачным моделям.

**Настройка:**
```env
LLM_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=openai/gpt-4-turbo
```

## Переключение между провайдерами

1. Отредактируйте файл `backend/.env`
2. Установите `LLM_PROVIDER` на нужный провайдер (`ollama` или `localai` для локальной работы)
3. Заполните соответствующие настройки
4. Перезапустите сервер

## Проверка статуса провайдера

```bash
# Проверить статус текущего провайдера
curl http://localhost:8000/provider/status

# Получить информацию о провайдере
curl http://localhost:8000/provider/info
```

## Рекомендации

### Для разработки и продакшена
- **Ollama** - рекомендуется для всех случаев
  - Не требует API ключей
  - Быстрый старт
  - Приватность данных
  - Бесплатно

### Альтернативы
- **LocalAI** - если нужен OpenAI-совместимый API
- **Open Router** - только если нужен доступ к облачным моделям

### Требования к ресурсам

**Ollama:**
- Минимум 8GB RAM для llama2
- 16GB+ RAM для больших моделей
- GPU опционально (ускоряет работу)

**LocalAI:**
- Минимум 8GB RAM
- Рекомендуется GPU для лучшей производительности

## Примеры конфигураций

### Рекомендуемая (Ollama локально)
```env
LLM_PROVIDER=ollama
OLLAMA_MODEL=llama2
OLLAMA_BASE_URL=http://localhost:11434
```

### С другой моделью Ollama
```env
LLM_PROVIDER=ollama
OLLAMA_MODEL=mistral
# или
OLLAMA_MODEL=codellama
```

### LocalAI (альтернатива)
```env
LLM_PROVIDER=localai
LOCALAI_BASE_URL=http://localhost:8080
LOCALAI_MODEL=gpt-4
```

## Устранение проблем

### Ollama не отвечает
```bash
# Проверить, запущен ли Ollama
curl http://localhost:11434/api/tags

# Перезапустить Ollama
ollama serve
```

### LocalAI не отвечает
```bash
# Проверить статус контейнера
docker ps | grep local-ai

# Проверить логи
docker logs local-ai
```

### Ошибки API
- Убедитесь, что провайдер запущен
- Проверьте правильность URL в настройках
- Проверьте наличие API ключей (для облачных провайдеров)

