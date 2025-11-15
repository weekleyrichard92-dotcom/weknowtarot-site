# 🧠 Tarot AI Backend

This backend connects your tarot website to the **qwen3:30b** AI model (30 billion parameters!) via Ollama.

## Setup & Run

### 1. Make sure Ollama is running
```bash
# Ollama should already be running on port 11434
# Check with:
curl http://localhost:11434/api/tags
```

### 2. Start the backend (as your user, not root!)
```bash
cd backend
./start-backend.sh
```

Or manually:
```bash
cd backend
npm install
npm start
```

The backend will start on **http://localhost:3001**

## API Endpoints

### Health Check
```bash
GET http://localhost:3001/health
```

### Test Brain Connection
```bash
GET http://localhost:3001/api/test-brain
```

### AI Card Interpretation
```bash
POST http://localhost:3001/api/interpret-card
{
  "cardName": "The Fool",
  "cardSuit": "Major Arcana",
  "context": "Career question"
}
```

### Ask Tarot AI
```bash
POST http://localhost:3001/api/ask-tarot
{
  "question": "What guidance do you have for my career path?"
}
```

### Game Rule Explanation
```bash
POST http://localhost:3001/api/explain-rule
{
  "rule": "The role of the excuse card",
  "playerQuestion": "When can I play the excuse?"
}
```

## Features

- 🎴 **AI Card Interpretations** - Deep insights powered by 30B parameters
- 💬 **Ask Tarot AI** - Get mystical wisdom and practical guidance
- 📖 **Game Rules** - Clear explanations of French Tarot rules
- ✨ **Fast & Local** - Runs on your machine, no external API calls

## Next Steps

Integrate these endpoints into your tarot website frontend to give it the 30 billion parameter brain! 🚀
