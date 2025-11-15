# 🏗️ WE KNOW TAROT - PLATFORM ARCHITECTURE

> **Vision:** The Shopify of Tarot - Complete toolkit for tarot creators to build, monetize, and scale their businesses

---

## 🎯 Core Philosophy: "Picks and Shovels"

**We don't just sell tarot decks. We sell the TOOLS to create and sell tarot decks.**

Like Levi Strauss selling jeans during the gold rush, we profit from enabling thousands of creators, not competing with them.

---

## 📐 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    WE KNOW TAROT PLATFORM                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────────┐ │
│  │   FRONTEND     │  │    BACKEND     │  │   AI ENGINE   │ │
│  │   (Vite/React) │  │   (Node/Express│  │  (Quinn 30B)  │ │
│  └────────────────┘  └────────────────┘  └───────────────┘ │
│          │                    │                   │          │
│          └────────────────────┴───────────────────┘          │
│                              │                               │
│                    ┌─────────┴─────────┐                    │
│                    │                   │                     │
│         ┌──────────▼────────┐  ┌──────▼─────────┐          │
│         │   DATABASE        │  │  FILE STORAGE  │          │
│         │   (PostgreSQL)    │  │  (S3/R2)       │          │
│         └───────────────────┘  └────────────────┘          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
        ┌───────────▼────────┐  ┌───────▼──────────┐
        │  EXTERNAL SERVICES │  │   INTEGRATIONS   │
        │  - Stripe          │  │  - Printful      │
        │  - SendGrid        │  │  - Printify      │
        │  - Auth0/Clerk     │  │  - Shipstation   │
        └────────────────────┘  └──────────────────┘
```

---

## 🎭 User Types & Roles

### 1. **Visitor** (Unauthenticated)
- Browse marketplace
- View deck previews
- Try free tarot reader (limited)
- Read blog/tutorials

### 2. **Consumer** (Free Account)
- Save favorite decks
- Use basic tarot reader
- Purchase decks from marketplace
- Reading history (basic)

### 3. **Premium Reader** ($9.99/mo)
- AI-powered readings
- All spread types
- Unlimited reading history
- Cloud sync
- Early access to new decks

### 4. **Creator** ($49/mo)
- Deck Generator Studio access
- AI image generation (Quinn)
- 5 active projects
- Commercial license
- Export print-ready files

### 5. **Creator Pro** ($99/mo)
- Everything in Creator
- White-label Reader App
- Unlimited projects
- Priority AI generation
- Advanced analytics
- API access

### 6. **Creator Business** ($199/mo)
- Everything in Creator Pro
- Multi-user teams
- Custom domain
- Remove We Know Tarot branding
- Dedicated support
- Revenue sharing options

### 7. **Admin** (Platform Management)
- User management
- Content moderation
- Analytics dashboard
- Revenue tracking
- Feature flags

---

## 🧩 Core Modules

### **Module 1: User Management**
```
- Authentication (email, OAuth, magic links)
- User profiles
- Subscription management
- Billing history
- Team/organization management
```

### **Module 2: Deck Generator Studio**
```
- Project management (CRUD)
- Style profile system
- AI prompt generation
- Batch card generation
- Image management & upload
- Export system (PDF, PNG, print-ready)
- Version control
```

### **Module 3: Tarot Reader App**
```
- Spread selection
- Card drawing engine
- AI interpretation (qwen3:30b)
- Reading history
- Share/export readings
- Custom deck import
- White-label customization
```

### **Module 4: Marketplace**
```
- Deck listings (browse, search, filter)
- Shopping cart & checkout
- Payment processing (Stripe)
- Digital delivery
- Physical fulfillment (print-on-demand)
- Reviews & ratings
- Creator storefronts
- Revenue sharing
```

### **Module 5: AI Engine**
```
- Image generation (Quinn via Ollama)
- Prompt optimization
- Reading interpretation
- Guidebook generation
- Style consistency checking
- Batch processing queue
```

### **Module 6: Analytics & Insights**
```
- User analytics
- Deck performance
- Revenue tracking
- Popular spreads/cards
- Creator dashboard
- Admin metrics
```

### **Module 7: Content Management**
```
- Blog system
- Tutorial library
- FAQ/Help center
- Email campaigns
- Community features
```

---

## 🔄 Data Flow Architecture

### **Creating a Deck (Creator Flow)**

```
User → Deck Generator UI
         ↓
    Create Project
         ↓
    Define Style Profile
         ↓
    Select Cards to Generate
         ↓
    AI generates prompts → Quinn generates images
         ↓
    Review/Edit/Regenerate
         ↓
    Export to Print Files OR Publish to Marketplace
         ↓
    (If marketplace) → Listing goes live
         ↓
    Consumers can purchase
         ↓
    Revenue split: 80% Creator, 20% Platform
```

### **Using a Deck (Consumer Flow)**

```
User → Marketplace
         ↓
    Browse Decks
         ↓
    Purchase (Digital or Physical)
         ↓
    If Digital → Auto-imported to Reader App
    If Physical → Order sent to Print Partner
         ↓
    Use in Tarot Reader
         ↓
    Get AI Interpretations
         ↓
    Save/Share Readings
```

### **White-Label (Creator Pro Flow)**

```
Creator Pro User
         ↓
    Generate Custom Deck
         ↓
    Configure White-Label Reader
    - Upload logo
    - Set colors/branding
    - Choose domain
         ↓
    Deploy to custom URL (theirdeck.com)
         ↓
    They charge THEIR users
         ↓
    They keep 100% of revenue
    We charge them $99/mo for platform
```

---

## 🗄️ Technology Stack

### **Frontend**
- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand or Jotai
- **Forms:** React Hook Form
- **Routing:** React Router
- **Icons:** Lucide React

### **Backend**
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** PostgreSQL 15+ (with Prisma ORM)
- **Authentication:** Clerk or Auth0
- **File Storage:** Cloudflare R2 or AWS S3
- **Queue:** BullMQ (Redis)
- **Cache:** Redis
- **Email:** SendGrid or Resend

### **AI & Generation**
- **Image Gen:** Qwen3:30b via Ollama (local) OR Stable Diffusion API
- **Interpretations:** Qwen3:30b via Ollama
- **Fallback:** OpenAI GPT-4 or Claude API

### **Payments & Commerce**
- **Payment Processing:** Stripe
- **Subscription Management:** Stripe Billing
- **Print-on-Demand:** Printful API, Printify API

### **Infrastructure**
- **Hosting:** Vercel (frontend), Railway/Render (backend)
- **Database Hosting:** Supabase or Neon
- **CDN:** Cloudflare
- **Monitoring:** Sentry
- **Analytics:** Plausible or PostHog

### **DevOps**
- **Version Control:** Git + GitHub
- **CI/CD:** GitHub Actions
- **Environment Management:** dotenv
- **Testing:** Vitest, Playwright
- **Type Safety:** TypeScript (optional but recommended)

---

## 🔐 Security & Compliance

### **Authentication & Authorization**
- JWT tokens with refresh mechanism
- Role-based access control (RBAC)
- API rate limiting
- CSRF protection
- XSS prevention

### **Data Protection**
- Encrypted at rest (database)
- Encrypted in transit (HTTPS/TLS)
- PII handling compliance
- GDPR-compliant data deletion
- SOC 2 considerations for enterprise

### **Payment Security**
- PCI compliance via Stripe
- No card data stored on our servers
- Secure webhook handling
- Fraud detection

---

## 📡 API Architecture

### **RESTful API Endpoints**

```
/api/v1/auth/*           - Authentication
/api/v1/users/*          - User management
/api/v1/projects/*       - Deck projects
/api/v1/cards/*          - Card management
/api/v1/generate/*       - AI generation
/api/v1/marketplace/*    - Marketplace listings
/api/v1/orders/*         - Order processing
/api/v1/readings/*       - Tarot readings
/api/v1/analytics/*      - Analytics data
/api/v1/billing/*        - Subscription management
```

### **WebSocket Events** (Real-time features)

```
generation:progress      - AI generation status
generation:complete      - Image ready
reading:started          - Someone started a reading
marketplace:new-listing  - New deck published
```

---

## 🚀 Scalability Considerations

### **Horizontal Scaling**
- Stateless API servers (multiple instances)
- Load balancer (Cloudflare or AWS ALB)
- Database read replicas
- CDN for static assets

### **Vertical Optimization**
- Image optimization & compression
- Lazy loading & code splitting
- Database indexing
- Query optimization
- Caching strategy (Redis)

### **Async Processing**
- AI generation in background queue
- Email sending via queue
- PDF generation offloaded
- Webhook processing async

### **Cost Optimization**
- Quinn running locally (free AI!)
- Cloudflare R2 (cheaper than S3)
- Vercel hobby/pro plan
- Self-hosted backend option

---

## 📊 Monitoring & Observability

### **Application Monitoring**
- Error tracking (Sentry)
- Performance monitoring (Vercel Analytics)
- Uptime monitoring (Better Uptime)
- Log aggregation (LogDrain or Papertrail)

### **Business Metrics**
- User signups (daily/weekly/monthly)
- Conversion rates (free → paid)
- Churn rate
- MRR (Monthly Recurring Revenue)
- Deck generation volume
- Marketplace GMV (Gross Merchandise Value)

### **AI Metrics**
- Generation success rate
- Average generation time
- Quinn uptime
- Cost per generation
- Quality feedback loop

---

## 🔄 Integration Points

### **Print-on-Demand**
```
1. User completes deck
2. Export print-ready PDF (300 DPI, CMYK, bleed)
3. Upload to Printful/Printify via API
4. Configure product (size, finish, etc.)
5. When order comes in → auto-fulfill
6. Tracking sent to customer
```

### **White-Label Deployment**
```
1. Creator configures branding
2. Generate custom build with their assets
3. Deploy to Vercel with custom domain
4. DNS configuration assistance
5. SSL auto-provisioned
6. Analytics tracked separately
```

### **Email Marketing**
```
1. User signs up → Welcome sequence
2. Creator publishes deck → Notify followers
3. Abandoned cart → Recovery email
4. Usage milestones → Engagement emails
5. Renewal reminders → Reduce churn
```

---

## 🎨 Design System

### **Brand Guidelines**
- Purple/Indigo primary palette (mystical)
- Gold accents (premium, spiritual)
- Dark mode by default
- Accessible (WCAG AA minimum)
- Responsive (mobile-first)

### **Component Library**
- Reusable UI components
- Consistent spacing/typography
- Animation library (Framer Motion)
- Icon set (Lucide React)
- Form patterns
- Loading states
- Error states

---

## 🧪 Testing Strategy

### **Unit Tests**
- Business logic
- Utility functions
- API endpoints

### **Integration Tests**
- User flows
- API interactions
- Database operations

### **E2E Tests**
- Critical user journeys
- Payment flows
- Deck generation pipeline

### **Manual Testing**
- UI/UX review
- AI generation quality
- Print file verification
- Cross-browser testing

---

## 📋 Feature Flags

Allow gradual rollout and A/B testing:

```javascript
{
  "marketplace": true,          // Marketplace live
  "whitelabel": false,          // Coming soon
  "aiGeneration": true,         // Quinn active
  "printIntegration": false,    // In development
  "teamFeatures": false,        // Planned
  "advancedAnalytics": true     // Beta users only
}
```

---

## 🗺️ MVP vs Full Platform

### **MVP (Months 1-3)**
- ✅ User accounts & auth
- ✅ Deck Generator Studio (basic)
- ✅ AI prompt generation
- ✅ Manual image upload
- ✅ Tarot Reader App
- ✅ Stripe subscription billing
- ✅ Basic analytics

### **V1 (Months 4-6)**
- ✅ Quinn AI image generation
- ✅ Marketplace (buy/sell)
- ✅ Print-ready exports
- ✅ Reading history
- ✅ Enhanced analytics
- ✅ Email notifications

### **V2 (Months 7-12)**
- ✅ White-label system
- ✅ Print-on-demand integration
- ✅ Team/organization features
- ✅ Advanced AI features
- ✅ Mobile apps (React Native)
- ✅ API for third parties

### **V3 (Year 2+)**
- ✅ Enterprise features
- ✅ Franchise/partner program
- ✅ International expansion
- ✅ Physical store integrations
- ✅ AR tarot experiences
- ✅ Live reader booking

---

## 💡 Key Architectural Decisions

### **Why PostgreSQL?**
- Relational data (users, decks, orders)
- ACID compliance for transactions
- JSON support for flexible data
- Excellent ORM support (Prisma)
- Mature ecosystem

### **Why Ollama for AI?**
- Run Quinn locally = $0 cost!
- Full control over model
- No API rate limits
- Privacy (data never leaves server)
- Fallback to cloud APIs if needed

### **Why Stripe?**
- Industry standard for SaaS
- Handles subscription complexity
- Excellent documentation
- Built-in fraud protection
- Global payment support

### **Why Vercel?**
- Zero-config deployment
- Automatic scaling
- Edge network (fast globally)
- Preview deployments
- Great DX

---

## 🎯 Success Metrics

### **Technical KPIs**
- Uptime: 99.9%+
- API response time: <200ms p95
- AI generation time: <30s per card
- Page load time: <2s
- Error rate: <0.1%

### **Business KPIs**
- User growth: 20%+ MoM
- Conversion rate: 5%+ (free → paid)
- Churn: <5% monthly
- MRR growth: 30%+ MoM
- Customer LTV: >$500
- CAC payback: <6 months

---

## 🔮 Future Possibilities

- **AI Training:** Fine-tune model on successful decks
- **Community Features:** Forums, deck reviews, tutorials
- **Live Events:** Virtual tarot reading sessions
- **Physical Presence:** Pop-up stores, conventions
- **Partnerships:** Collaborate with spiritual brands
- **Education:** Tarot reading certification courses
- **B2B:** Enterprise for corporate wellness programs

---

## 📞 Technical Support Strategy

### **Self-Service**
- Comprehensive docs
- Video tutorials
- FAQ system
- Community forums

### **Assisted Support**
- Email support (24-48hr)
- Live chat (Creator Pro+)
- Priority support (Business tier)
- Dedicated account manager (Enterprise)

---

## ✅ Next Steps

See `ROADMAP.md` for phased implementation plan.
See `DATABASE_SCHEMA.md` for complete data model.
See `USER_FLOWS.md` for detailed user journeys.
See `BUSINESS_MODEL.md` for revenue strategy.

---

**Built with vision. Designed to scale. Ready to empower thousands of tarot creators.** 🔮✨
