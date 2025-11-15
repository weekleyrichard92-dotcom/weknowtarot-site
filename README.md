# 🔮 WE KNOW TAROT

> The complete platform for creating, selling, and experiencing tarot decks - powered by AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 What Is This?

**We Know Tarot** is becoming **the Shopify of Tarot** - a complete platform that enables creators to build, monetize, and scale their tarot businesses.

### The "Picks and Shovels" Strategy

Instead of selling tarot decks, we sell the **tools** to create and sell tarot decks. Like Levi Strauss selling jeans during the gold rush, we profit by enabling thousands of creators.

---

## ✨ Features

### For Creators
- 🎨 **Deck Generator Studio** - AI-powered prompt generation for all 78 cards
- 🤖 **Quinn Integration** - Local AI (qwen3:30b) generates images at $0 cost
- 📦 **Export Tools** - Print-ready files, guidebooks, commercial licenses
- 🏪 **Marketplace** - Sell digital & physical decks (we take 20%)
- 🎯 **White-Label Apps** - Launch your own branded tarot reader

### For Consumers
- 🎴 **Cinematic Tarot Reader** - 8 spread types with stunning animations
- 🧠 **AI Interpretations** - Powered by Quinn (qwen3:30b)
- 📚 **Deck Library** - Access marketplace decks in the reader
- 💫 **Premium Features** - Unlimited readings, cloud sync, all decks

### For the Platform (You!)
- 💰 **7 Revenue Streams** - SaaS ($49-199/mo), marketplace (20%), reader ($9.99/mo)
- 📈 **20:1 LTV:CAC** - Best-in-class unit economics
- 🚀 **$446k ARR Target** - Year 1 projection
- 🏆 **Quinn Advantage** - $0 AI generation cost (local 30B model)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Ollama with qwen3:30b model

### Installation

```bash
# Install dependencies
npm install
cd backend && npm install && cd ..

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Set up database
npx prisma generate
npx prisma migrate dev

# Start everything
npm run dev              # Frontend (Terminal 1)
cd backend && npm run dev  # Backend (Terminal 2)
ollama serve            # Quinn AI (Terminal 3)
```

Visit:
- **Frontend:** http://localhost:5173
- **Tarot Reader:** http://localhost:5173/tarot-reader-premium.html
- **Backend API:** http://localhost:3001

---

## 📚 Documentation

Comprehensive planning docs in `/docs`:

1. **[SETUP.md](./docs/SETUP.md)** - Complete installation guide
2. **[PLATFORM_ARCHITECTURE.md](./docs/PLATFORM_ARCHITECTURE.md)** - Technical architecture
3. **[DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md)** - Database design
4. **[ROADMAP.md](./docs/ROADMAP.md)** - 12-month implementation plan
5. **[BUSINESS_MODEL.md](./docs/BUSINESS_MODEL.md)** - Revenue strategy & projections
6. **[README.md](./docs/README.md)** - Documentation index

---

## 🗺️ Roadmap

### ✅ Completed
- Cinematic Tarot Reader with 8 spread types
- Full 78-card tarot deck data
- Backend API structure
- Quinn (qwen3:30b) AI integration
- Comprehensive platform planning
- Database schema & Prisma setup

### 🚧 Current: Phase 0 (Week 1-2)
- [x] PostgreSQL + Prisma setup
- [x] Environment configuration
- [ ] User authentication system
- [ ] Basic user profiles

### 📋 Next: Phase 1 (Month 1)
- Project management (create/edit deck projects)
- AI prompt generator (all 78 cards)
- Style profiles & templates
- Progress tracking

### 🎯 Milestones
| Milestone | Target | Revenue Goal |
|-----------|--------|--------------|
| MVP Launch | Month 1 | $0 |
| First Paying Customer | Month 2 | $49 |
| Break Even | Month 2 | $1,000 MRR |
| Marketplace Launch | Month 5 | $5,000 MRR |
| V1.0 Launch | Month 6 | $10,000 MRR |
| Profitability | Month 12 | $50,000 MRR |

---

## 💡 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Cinematic animations

### Backend
- **Node.js + Express** - API server
- **PostgreSQL** - Database
- **Prisma** - ORM
- **Stripe** - Payments

### AI
- **Quinn (qwen3:30b)** - Local 30B parameter model via Ollama
- **$0 generation cost** - Competitive advantage

---

## 🎨 Project Structure

```
weknowtarot-site/
├── src/
│   ├── components/           # React components
│   │   ├── TarotReaderCinematic.jsx
│   │   └── CardAnimation.jsx
│   ├── data/
│   │   └── tarotDeck.js     # Full 78-card deck
│   └── scripts/
│       └── main.js
├── backend/
│   └── src/
│       ├── server.js        # Express API
│       └── aiService.js     # Quinn integration
├── prisma/
│   └── schema.prisma        # Database schema
├── docs/
│   ├── PLATFORM_ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── ROADMAP.md
│   ├── BUSINESS_MODEL.md
│   └── SETUP.md
├── index.html               # Homepage (refactored)
├── tarot-reader-premium.html
└── package.json
```

---

## 🤖 Meet Quinn

**Quinn** is the AI brain powering the platform:

- **Model:** qwen3:30b (30 billion parameters)
- **Provider:** Ollama (runs locally)
- **Cost:** $0 per generation (competitive moat!)
- **Capabilities:** Tarot interpretations, deck creation, business insights

Quinn provides:
- Personalized tarot readings
- AI-generated card prompts
- Business consulting mode
- Character personalities (NPCs for future card game)
- 20-30 different avatars (same brain, different personas)

---

## 💰 Business Model

### Revenue Streams

1. **SaaS Subscriptions** (Primary)
   - Creator: $49/mo
   - Creator Pro: $99/mo
   - Creator Business: $199/mo
   - Reader Premium: $9.99/mo

2. **Marketplace Fees**
   - Digital decks: 20% commission
   - Physical decks: 15% commission

3. **Additional Revenue**
   - Print-on-demand markup: $5/deck
   - White-label setups: $500 one-time
   - Custom commissions: $1,000-3,000/deck

### Target Economics
- **Year 1 Revenue:** $446,640 ARR
- **LTV:CAC Ratio:** 20:1
- **Payback Period:** <6 months
- **Break-even:** Month 2-3

---

## 🔐 Security & Privacy

- All environment variables in `.env` (gitignored)
- Stripe for secure payment processing
- GDPR-compliant from day 1
- User data encrypted at rest
- Regular security audits planned

---

## 🤝 Contributing

This is currently a private project in active development. Once MVP launches, we'll open source portions of the platform.

---

## 📄 License

MIT License - see LICENSE file for details

---

## 🎯 Current Status

**Phase:** 0 - Foundation
**Status:** Database & Prisma setup complete
**Next:** User authentication system
**Target Launch:** Month 1 (MVP)

---

## 📞 Contact

Questions about the platform? Check the documentation in `/docs` or review the roadmap.

---

**Built with ❤️ and powered by Quinn 🤖**

**Let's build the future of tarot!** 🔮🚀✨
