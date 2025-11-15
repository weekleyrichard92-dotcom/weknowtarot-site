import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { interpretReading } from './aiService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', service: 'We Know Tarot API', timestamp: new Date().toISOString() });
});

// AI Tarot Interpretation Endpoint
app.post('/api/interpret-reading', async (req, res) => {
  try {
    const { spread, cards } = req.body;

    if (!spread || !cards || !Array.isArray(cards)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'Please provide spread name and cards array'
      });
    }

    console.log(`🔮 Interpreting ${spread} reading with ${cards.length} cards...`);

    // Call AI service for interpretation
    const interpretation = await interpretReading(spread, cards);

    res.json({
      success: true,
      interpretation,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error interpreting reading:', error);
    res.status(500).json({
      error: 'Interpretation failed',
      message: error.message,
      fallback: {
        summary: "The mystical AI is currently meditating. The traditional meanings provided with each card offer guidance for your reading.",
        insights: []
      }
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🔮  WE KNOW TAROT API SERVER                          ║
║                                                           ║
║   Status: RUNNING                                         ║
║   Port: ${PORT}                                            ║
║   Environment: ${process.env.NODE_ENV || 'development'}                             ║
║   AI Model: qwen3:30b (via Ollama)                       ║
║                                                           ║
║   Endpoints:                                              ║
║   GET  /api/health            - Health check              ║
║   POST /api/interpret-reading - AI interpretation         ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
  console.log(`🧠 Ready to channel AI-powered tarot wisdom!\n`);
});

export default app;
