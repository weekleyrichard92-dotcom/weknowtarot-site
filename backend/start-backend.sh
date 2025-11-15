#!/bin/bash

# We Know Tarot Backend Startup Script
# Starts the AI-powered tarot interpretation API

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                                                           ║"
echo "║   🔮  WE KNOW TAROT - BACKEND STARTUP                   ║"
echo "║                                                           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
  echo "✅ Dependencies installed!"
  echo ""
fi

# Copy .env.example to .env if it doesn't exist
if [ ! -f ".env" ]; then
  echo "📝 Creating .env file from .env.example..."
  cp .env.example .env
  echo "✅ .env file created!"
  echo ""
fi

# Check if Ollama is running
echo "🔍 Checking Ollama connection..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
  echo "✅ Ollama is running!"

  # Check if qwen3:30b is installed
  if curl -s http://localhost:11434/api/tags | grep -q "qwen3:30b"; then
    echo "✅ qwen3:30b model is installed!"
  else
    echo "⚠️  qwen3:30b model not found. You may need to run:"
    echo "   ollama pull qwen3:30b"
  fi
else
  echo "⚠️  Ollama is not running. AI interpretations will use fallback mode."
  echo "   To enable AI: Start Ollama and ensure qwen3:30b is installed."
fi

echo ""
echo "🚀 Starting backend server..."
echo ""

# Start the server
npm start
