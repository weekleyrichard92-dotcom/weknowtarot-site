# 🚀 WE KNOW TAROT - SETUP GUIDE

> Complete installation and configuration guide

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed
- **PostgreSQL 14+** installed and running
- **Ollama** installed with `qwen3:30b` model
- **Git** for version control
- **Code editor** (VS Code recommended)

---

## 1. Environment Setup

### Clone & Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd weknowtarot-site

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Database (Update with your PostgreSQL credentials)
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/weknowtarot?schema=public"

# Quinn AI (Default Ollama setup)
OLLAMA_URL="http://localhost:11434"
AI_MODEL="qwen3:30b"

# Server
PORT=3001

# Stripe (Add when ready to accept payments)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Frontend URL
NEXT_PUBLIC_APP_URL="http://localhost:5173"
```

---

## 2. Database Setup

### Option A: Using Prisma (Recommended)

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database with sample data
npm run db:seed
```

### Option B: Manual SQL Setup

If Prisma commands don't work, run the SQL directly:

```bash
# Create the database
createdb weknowtarot

# Connect to PostgreSQL
psql weknowtarot

# Run the schema
\i prisma/migrations/001_init.sql
```

### Verify Database

```bash
# Open Prisma Studio to view your database
npx prisma studio
```

This will open a web interface at `http://localhost:5555`

---

## 3. Quinn (AI) Setup

### Install Ollama

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# Download from https://ollama.com/download
```

### Download Quinn Model

```bash
# Pull the qwen3:30b model (Quinn)
ollama pull qwen3:30b

# Verify it's working
ollama run qwen3:30b "Hello Quinn!"
```

### Start Ollama Server

```bash
# Start Ollama service (runs in background)
ollama serve
```

The service will be available at `http://localhost:11434`

---

## 4. Running the Application

### Development Mode

Open **3 terminal windows**:

**Terminal 1 - Frontend:**
```bash
npm run dev
```
Frontend runs at: `http://localhost:5173`

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```
Backend API runs at: `http://localhost:3001`

**Terminal 3 - Ollama (if not running as service):**
```bash
ollama serve
```
Quinn AI runs at: `http://localhost:11434`

### Production Build

```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

---

## 5. Verify Everything Works

### Test Checklist

- [ ] Frontend loads at `http://localhost:5173`
- [ ] Backend responds at `http://localhost:3001/api/health`
- [ ] Quinn responds at `http://localhost:11434/api/version`
- [ ] Database connection successful (check logs)
- [ ] Tarot Reader app works at `/tarot-reader-premium.html`
- [ ] AI interpretations generate (test a reading)

### Quick Test Commands

```bash
# Test backend health
curl http://localhost:3001/api/health

# Test Quinn
curl -X POST http://localhost:11434/api/generate \
  -d '{
    "model": "qwen3:30b",
    "prompt": "Say hello",
    "stream": false
  }'
```

---

## 6. Database Migrations

### Creating New Migrations

When you update `prisma/schema.prisma`:

```bash
# Create and apply migration
npx prisma migrate dev --name descriptive_migration_name

# Example: Adding a new field
npx prisma migrate dev --name add_user_avatar
```

### Applying Migrations to Production

```bash
# Production migration (no seed, no prompts)
npx prisma migrate deploy
```

---

## 7. Common Issues & Solutions

### Issue: Prisma binary download fails

**Solution:** Use environment variable:
```bash
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
npx prisma generate
```

### Issue: PostgreSQL connection refused

**Solutions:**
1. Check PostgreSQL is running: `pg_isready`
2. Verify credentials in `.env`
3. Check PostgreSQL port (default: 5432)
4. Ensure database exists: `createdb weknowtarot`

### Issue: Ollama not found

**Solution:**
```bash
# Check if Ollama is installed
which ollama

# If not, install it:
curl -fsSL https://ollama.com/install.sh | sh
```

### Issue: qwen3:30b model missing

**Solution:**
```bash
ollama pull qwen3:30b
```

### Issue: Frontend can't connect to backend

**Solutions:**
1. Verify backend is running on port 3001
2. Check CORS settings in `backend/src/server.js`
3. Ensure `.env` has correct URLs

---

## 8. Next Steps

Once everything is running:

1. **Create your first user account** (authentication system TBD)
2. **Test the Tarot Reader** at `/tarot-reader-premium.html`
3. **Review the roadmap** at `docs/ROADMAP.md`
4. **Start Phase 1 development** (Project Management)

---

## 9. Development Workflow

### Daily Development

```bash
# Start all services
npm run dev            # Terminal 1: Frontend
cd backend && npm run dev  # Terminal 2: Backend
ollama serve          # Terminal 3: Quinn (if not service)
```

### Before Committing

```bash
# Format code
npm run format

# Run linter
npm run lint

# Build to check for errors
npm run build
```

### Database Changes

```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name your_change_name
# 3. Commit both schema and migration files
git add prisma/
git commit -m "Add: your_change_name migration"
```

---

## 10. Deployment Checklist

When ready to deploy:

- [ ] Set production `DATABASE_URL` in hosting environment
- [ ] Set production `STRIPE_SECRET_KEY` and webhook secret
- [ ] Configure Ollama on production server
- [ ] Run `npx prisma migrate deploy`
- [ ] Set `NODE_ENV=production`
- [ ] Configure CDN for static assets
- [ ] Set up domain and SSL
- [ ] Configure backup schedule for database

---

## Additional Resources

- **Prisma Docs:** https://www.prisma.io/docs
- **Ollama Docs:** https://ollama.com/docs
- **Vite Docs:** https://vitejs.dev
- **PostgreSQL Docs:** https://www.postgresql.org/docs

---

**Setup Status:** ✅ Complete
**Last Updated:** January 2025
**Version:** 1.0

---

**Ready to build the future of tarot!** 🔮🚀
