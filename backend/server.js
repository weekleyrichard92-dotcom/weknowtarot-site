import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;
const OLLAMA_API = 'http://localhost:11434';

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', brain: 'qwen3:30b', neurons: '30 billion' });
});

// AI Card Interpretation
app.post('/api/interpret-card', async (req, res) => {
  try {
    const { cardName, cardSuit, context } = req.body;

    const prompt = `You are a mystical tarot expert. Provide a thoughtful interpretation of the ${cardName} of ${cardSuit} card.

${context ? `Context: ${context}` : ''}

Provide:
1. Traditional meaning
2. Symbolism
3. How it might apply to the querent's situation

Keep it mystical yet insightful, about 100-150 words.`;

    const response = await fetch(`${OLLAMA_API}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3:30b',
        prompt: prompt,
        stream: false
      })
    });

    const data = await response.json();
    res.json({ interpretation: data.response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to interpret card' });
  }
});

// Ask Tarot AI
app.post('/api/ask-tarot', async (req, res) => {
  try {
    const { question } = req.body;

    const prompt = `You are a wise tarot advisor. Answer this question with mystical insight and practical wisdom:

"${question}"

Provide a thoughtful, encouraging response that blends tarot wisdom with actionable guidance. Keep it under 200 words.`;

    const response = await fetch(`${OLLAMA_API}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3:30b',
        prompt: prompt,
        stream: false
      })
    });

    const data = await response.json();
    res.json({ answer: data.response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to consult the tarot AI' });
  }
});

// Game Rule Explanation
app.post('/api/explain-rule', async (req, res) => {
  try {
    const { rule, playerQuestion } = req.body;

    const prompt = `Explain this French Tarot game rule clearly and concisely:

${rule}

${playerQuestion ? `Player asks: ${playerQuestion}` : ''}

Provide a clear explanation with an example if helpful. Keep it under 150 words.`;

    const response = await fetch(`${OLLAMA_API}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3:30b',
        prompt: prompt,
        stream: false
      })
    });

    const data = await response.json();
    res.json({ explanation: data.response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to explain rule' });
  }
});

// Test Ollama connection
app.get('/api/test-brain', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_API}/api/tags`);
    const data = await response.json();
    const hasQwen = data.models?.some(m => m.name.includes('qwen3:30b'));

    res.json({
      connected: true,
      models: data.models?.map(m => m.name),
      brain_ready: hasQwen
    });
  } catch (error) {
    res.status(500).json({ connected: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🧠 Tarot AI Backend running on http://localhost:${PORT}`);
  console.log(`🎴 Connected to qwen3:30b (30 billion parameters)`);
  console.log(`✨ Ready to provide mystical insights!`);
});
