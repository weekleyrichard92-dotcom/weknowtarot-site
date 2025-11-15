# 🗄️ WE KNOW TAROT - DATABASE SCHEMA

> Complete data model for the platform, designed for PostgreSQL with Prisma ORM

---

## 📊 Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│    Users    │────────<│Subscriptions │         │ StyleProfiles│
└─────────────┘         └──────────────┘         └──────────────┘
       │                                                  │
       │                                                  │
       │ 1:N                                            1:N
       │                                                  │
       ▼                                                  │
┌─────────────┐         ┌──────────────┐◄────────────────┘
│  Projects   │────────<│    Cards     │
└─────────────┘   1:N   └──────────────┘
       │                       │
       │                       │ N:M
       │                       ▼
       │                ┌──────────────┐
       │                │  CardImages  │
       │                └──────────────┘
       │
       │ 1:N
       ▼
┌──────────────┐
│   Listings   │
└──────────────┘
       │
       │ 1:N
       ▼
┌──────────────┐        ┌──────────────┐
│    Orders    │───────<│  OrderItems  │
└──────────────┘   1:N  └──────────────┘
       │
       │ 1:N
       ▼
┌──────────────┐
│   Readings   │
└──────────────┘
```

---

## 📋 Table Definitions

### **users**
```sql
CREATE TABLE users (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             VARCHAR(255) UNIQUE NOT NULL,
  username          VARCHAR(50) UNIQUE,
  full_name         VARCHAR(255),
  avatar_url        TEXT,

  -- Account type
  role              VARCHAR(20) NOT NULL DEFAULT 'consumer',
    -- Options: 'consumer', 'creator', 'creator_pro', 'creator_business', 'admin'

  -- Profile
  bio               TEXT,
  website           VARCHAR(255),
  social_links      JSONB,  -- {instagram: '', tiktok: '', etc}

  -- Preferences
  preferences       JSONB,  -- {theme: 'dark', notifications: true, etc}

  -- Status
  is_verified       BOOLEAN DEFAULT false,
  is_active         BOOLEAN DEFAULT true,
  email_verified_at TIMESTAMP,

  -- Timestamps
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW(),
  last_login_at     TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_username ON users(username);
```

---

### **subscriptions**
```sql
CREATE TABLE subscriptions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Stripe data
  stripe_customer_id    VARCHAR(255) UNIQUE,
  stripe_subscription_id VARCHAR(255) UNIQUE,

  -- Plan details
  plan_type             VARCHAR(50) NOT NULL,
    -- Options: 'reader_premium', 'creator', 'creator_pro', 'creator_business'
  status                VARCHAR(20) NOT NULL,
    -- Options: 'active', 'canceled', 'past_due', 'trialing', 'incomplete'

  -- Pricing
  amount                INTEGER NOT NULL,  -- in cents
  currency              VARCHAR(3) DEFAULT 'usd',
  interval              VARCHAR(20),  -- 'month' or 'year'

  -- Dates
  current_period_start  TIMESTAMP NOT NULL,
  current_period_end    TIMESTAMP NOT NULL,
  trial_end             TIMESTAMP,
  canceled_at           TIMESTAMP,
  ended_at              TIMESTAMP,

  -- Timestamps
  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

---

### **style_profiles**
```sql
CREATE TABLE style_profiles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Profile details
  name            VARCHAR(255) NOT NULL,
  description     TEXT,

  -- Style attributes
  border_style    TEXT NOT NULL,
  color_palette   TEXT NOT NULL,  -- "Deep purple, midnight blue, silver, gold"
  art_style       TEXT NOT NULL,  -- "Dreamy watercolor with galaxy elements"
  dimensions      VARCHAR(50) DEFAULT '2.75" x 4.75"',

  -- Advanced settings
  additional_prompts TEXT,  -- Extra instructions for AI
  negative_prompts   TEXT,  -- What to avoid

  -- Metadata
  is_public       BOOLEAN DEFAULT false,
  use_count       INTEGER DEFAULT 0,  -- How many times used

  -- Timestamps
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_style_profiles_user ON style_profiles(user_id);
CREATE INDEX idx_style_profiles_public ON style_profiles(is_public) WHERE is_public = true;
```

---

### **projects** (Deck Projects)
```sql
CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  style_profile_id UUID REFERENCES style_profiles(id) ON DELETE SET NULL,

  -- Project details
  name            VARCHAR(255) NOT NULL,
  description     TEXT,
  theme           VARCHAR(255),  -- "Celestial Moon", "Cyberpunk Future", etc

  -- Settings
  deck_type       VARCHAR(20) DEFAULT 'full',  -- 'major_only', 'full'
  card_back_url   TEXT,  -- URL to card back image

  -- Progress tracking
  total_cards     INTEGER DEFAULT 78,
  completed_cards INTEGER DEFAULT 0,

  -- Status
  status          VARCHAR(20) DEFAULT 'draft',
    -- Options: 'draft', 'in_progress', 'completed', 'published', 'archived'

  -- Publication
  is_published    BOOLEAN DEFAULT false,
  published_at    TIMESTAMP,

  -- Metadata
  tags            TEXT[],  -- ['mystical', 'watercolor', 'lunar']

  -- Timestamps
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_published ON projects(is_published) WHERE is_published = true;
CREATE INDEX idx_projects_tags ON projects USING GIN(tags);
```

---

### **cards**
```sql
CREATE TABLE cards (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,

  -- Card identification
  card_type       VARCHAR(20) NOT NULL,  -- 'major', 'minor'
  suit            VARCHAR(20),  -- NULL for major, 'wands', 'cups', 'swords', 'pentacles'
  rank            VARCHAR(20),  -- '0' for Fool, 'ace', 'two', ... 'king'
  name            VARCHAR(100) NOT NULL,  -- "The Fool", "Three of Cups"
  number          INTEGER,  -- For sorting

  -- Content
  keywords        TEXT,  -- "new beginnings, innocence, spontaneity"
  upright_meaning TEXT,
  reversed_meaning TEXT,

  -- AI Generation
  ai_prompt       TEXT,  -- Generated prompt for image
  generation_params JSONB,  -- {seed: 123, steps: 30, cfg_scale: 7.5}

  -- Images
  primary_image_id UUID REFERENCES card_images(id),

  -- Status
  status          VARCHAR(20) DEFAULT 'pending',
    -- Options: 'pending', 'generating', 'completed', 'failed', 'needs_revision'

  -- Timestamps
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW(),
  generated_at    TIMESTAMP
);

CREATE INDEX idx_cards_project ON cards(project_id);
CREATE INDEX idx_cards_type ON cards(card_type);
CREATE INDEX idx_cards_status ON cards(status);
CREATE INDEX idx_cards_name ON cards(name);
```

---

### **card_images**
```sql
CREATE TABLE card_images (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id         UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Image data
  url             TEXT NOT NULL,  -- S3/R2 URL
  thumbnail_url   TEXT,  -- Optimized preview
  print_ready_url TEXT,  -- 300 DPI version

  -- File info
  filename        VARCHAR(255),
  file_size       INTEGER,  -- in bytes
  width           INTEGER,
  height          INTEGER,
  format          VARCHAR(10),  -- 'png', 'jpg', 'webp'

  -- Generation info
  is_ai_generated BOOLEAN DEFAULT false,
  ai_model        VARCHAR(50),  -- 'qwen3:30b', 'stable-diffusion', etc
  generation_time INTEGER,  -- in seconds

  -- Version control
  version         INTEGER DEFAULT 1,
  is_primary      BOOLEAN DEFAULT false,
  parent_id       UUID REFERENCES card_images(id),  -- For variations

  -- Timestamps
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_card_images_card ON card_images(card_id);
CREATE INDEX idx_card_images_user ON card_images(user_id);
CREATE INDEX idx_card_images_primary ON card_images(is_primary) WHERE is_primary = true;
```

---

### **listings** (Marketplace)
```sql
CREATE TABLE listings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Listing details
  title           VARCHAR(255) NOT NULL,
  description     TEXT,

  -- Product options
  product_type    VARCHAR(20) NOT NULL,  -- 'digital', 'physical', 'both'

  -- Pricing
  digital_price   INTEGER,  -- in cents, NULL if not available
  physical_price  INTEGER,  -- in cents, NULL if not available
  currency        VARCHAR(3) DEFAULT 'usd',

  -- Inventory (for physical)
  stock_quantity  INTEGER,
  is_print_on_demand BOOLEAN DEFAULT true,

  -- Preview images
  preview_images  TEXT[],  -- Array of URLs
  sample_cards    UUID[],  -- Array of card IDs to show as samples

  -- Metadata
  tags            TEXT[],
  category        VARCHAR(50),  -- 'traditional', 'modern', 'themed', etc

  -- Stats
  view_count      INTEGER DEFAULT 0,
  favorite_count  INTEGER DEFAULT 0,
  purchase_count  INTEGER DEFAULT 0,

  -- Status
  status          VARCHAR(20) DEFAULT 'draft',
    -- Options: 'draft', 'pending_review', 'active', 'paused', 'rejected'
  is_featured     BOOLEAN DEFAULT false,

  -- Commission
  commission_rate DECIMAL(5,2) DEFAULT 20.00,  -- Platform fee percentage

  -- Timestamps
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW(),
  published_at    TIMESTAMP
);

CREATE INDEX idx_listings_user ON listings(user_id);
CREATE INDEX idx_listings_project ON listings(project_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_featured ON listings(is_featured) WHERE is_featured = true;
CREATE INDEX idx_listings_tags ON listings USING GIN(tags);
```

---

### **orders**
```sql
CREATE TABLE orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Order details
  order_number        VARCHAR(50) UNIQUE NOT NULL,  -- "ORD-20240115-001"

  -- Pricing
  subtotal            INTEGER NOT NULL,  -- in cents
  tax                 INTEGER DEFAULT 0,
  shipping            INTEGER DEFAULT 0,
  discount            INTEGER DEFAULT 0,
  total               INTEGER NOT NULL,
  currency            VARCHAR(3) DEFAULT 'usd',

  -- Payment
  stripe_payment_intent_id VARCHAR(255),
  payment_status      VARCHAR(20) DEFAULT 'pending',
    -- Options: 'pending', 'processing', 'succeeded', 'failed', 'refunded'
  paid_at             TIMESTAMP,

  -- Fulfillment
  fulfillment_status  VARCHAR(20) DEFAULT 'pending',
    -- Options: 'pending', 'processing', 'shipped', 'delivered', 'digital_delivered'
  tracking_number     VARCHAR(255),
  shipped_at          TIMESTAMP,
  delivered_at        TIMESTAMP,

  -- Shipping address (for physical orders)
  shipping_address    JSONB,
    -- {name, address1, address2, city, state, zip, country}

  -- Customer info
  customer_email      VARCHAR(255),
  customer_name       VARCHAR(255),

  -- Timestamps
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_fulfillment_status ON orders(fulfillment_status);
```

---

### **order_items**
```sql
CREATE TABLE order_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  listing_id      UUID NOT NULL REFERENCES listings(id) ON DELETE RESTRICT,

  -- Item details
  item_type       VARCHAR(20) NOT NULL,  -- 'digital', 'physical'
  title           VARCHAR(255) NOT NULL,  -- Snapshot at purchase time

  -- Pricing
  unit_price      INTEGER NOT NULL,  -- in cents
  quantity        INTEGER NOT NULL DEFAULT 1,
  subtotal        INTEGER NOT NULL,

  -- Commission (for creator payments)
  commission_rate DECIMAL(5,2),
  commission_amount INTEGER,  -- Platform fee
  creator_payout  INTEGER,  -- What creator receives
  creator_id      UUID REFERENCES users(id),

  -- Digital delivery
  download_url    TEXT,  -- Temporary signed URL
  download_expires_at TIMESTAMP,
  downloaded_at   TIMESTAMP,

  -- Timestamps
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_listing ON order_items(listing_id);
CREATE INDEX idx_order_items_creator ON order_items(creator_id);
```

---

### **readings** (Tarot Reading History)
```sql
CREATE TABLE readings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,  -- Can be anonymous
  project_id      UUID REFERENCES projects(id) ON DELETE SET NULL,  -- Which deck used

  -- Reading details
  spread_type     VARCHAR(50) NOT NULL,  -- 'single', 'three_card', 'celtic_cross', etc
  spread_name     VARCHAR(100),

  -- Cards drawn
  cards_drawn     JSONB NOT NULL,
    -- [{position: "Past", card: "The Fool", orientation: "upright"}, ...]

  -- Interpretation
  ai_interpretation TEXT,
  is_ai_generated   BOOLEAN DEFAULT false,

  -- User notes
  user_notes      TEXT,
  question        TEXT,  -- What they asked about

  -- Metadata
  is_public       BOOLEAN DEFAULT false,
  is_favorite     BOOLEAN DEFAULT false,

  -- Timestamps
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_readings_user ON readings(user_id);
CREATE INDEX idx_readings_project ON readings(project_id);
CREATE INDEX idx_readings_spread ON readings(spread_type);
CREATE INDEX idx_readings_created ON readings(created_at DESC);
CREATE INDEX idx_readings_public ON readings(is_public) WHERE is_public = true;
```

---

### **favorites**
```sql
CREATE TABLE favorites (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  listing_id      UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

  -- Timestamps
  created_at      TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, listing_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_listing ON favorites(listing_id);
```

---

### **reviews**
```sql
CREATE TABLE reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id      UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id        UUID REFERENCES orders(id) ON DELETE SET NULL,  -- Verified purchase

  -- Review content
  rating          INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title           VARCHAR(255),
  comment         TEXT,

  -- Images
  image_urls      TEXT[],

  -- Status
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved     BOOLEAN DEFAULT true,

  -- Timestamps
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, listing_id)  -- One review per user per listing
);

CREATE INDEX idx_reviews_listing ON reviews(listing_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

---

### **generation_queue** (AI Generation Jobs)
```sql
CREATE TABLE generation_queue (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id         UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Job details
  prompt          TEXT NOT NULL,
  parameters      JSONB,  -- {width: 512, height: 896, steps: 30, etc}
  model           VARCHAR(50) DEFAULT 'qwen3:30b',

  -- Status
  status          VARCHAR(20) DEFAULT 'queued',
    -- Options: 'queued', 'processing', 'completed', 'failed'
  progress        INTEGER DEFAULT 0,  -- 0-100

  -- Results
  result_url      TEXT,
  error_message   TEXT,

  -- Timing
  started_at      TIMESTAMP,
  completed_at    TIMESTAMP,
  duration        INTEGER,  -- in seconds

  -- Retry logic
  attempts        INTEGER DEFAULT 0,
  max_attempts    INTEGER DEFAULT 3,

  -- Timestamps
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_generation_queue_status ON generation_queue(status);
CREATE INDEX idx_generation_queue_user ON generation_queue(user_id);
CREATE INDEX idx_generation_queue_created ON generation_queue(created_at);
```

---

### **analytics_events** (Event Tracking)
```sql
CREATE TABLE analytics_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Event details
  event_type      VARCHAR(50) NOT NULL,
    -- Examples: 'page_view', 'deck_generated', 'reading_completed', 'purchase', etc
  event_data      JSONB,

  -- User context
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  session_id      UUID,

  -- Request context
  ip_address      INET,
  user_agent      TEXT,
  referer         TEXT,

  -- Timestamps
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at DESC);
```

---

### **whitelabel_configs** (White-Label Settings)
```sql
CREATE TABLE whitelabel_configs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Branding
  brand_name      VARCHAR(255),
  logo_url        TEXT,
  favicon_url     TEXT,

  -- Colors
  primary_color   VARCHAR(7),  -- Hex color
  secondary_color VARCHAR(7),
  accent_color    VARCHAR(7),

  -- Domain
  custom_domain   VARCHAR(255) UNIQUE,
  is_domain_verified BOOLEAN DEFAULT false,

  -- Features
  enabled_features JSONB,  -- {readings: true, marketplace: false, etc}

  -- Advanced
  custom_css      TEXT,
  custom_js       TEXT,  -- For analytics, etc

  -- SEO
  meta_title      VARCHAR(255),
  meta_description TEXT,
  og_image_url    TEXT,

  -- Timestamps
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_whitelabel_domain ON whitelabel_configs(custom_domain);
```

---

## 🔗 Common Queries

### Get user's active subscription
```sql
SELECT s.*
FROM subscriptions s
WHERE s.user_id = $1
  AND s.status = 'active'
  AND s.current_period_end > NOW()
ORDER BY s.created_at DESC
LIMIT 1;
```

### Get project with progress
```sql
SELECT
  p.*,
  COUNT(c.id) as total_cards,
  COUNT(c.id) FILTER (WHERE c.status = 'completed') as completed_cards,
  (COUNT(c.id) FILTER (WHERE c.status = 'completed')::FLOAT / NULLIF(COUNT(c.id), 0) * 100) as progress_percent
FROM projects p
LEFT JOIN cards c ON c.project_id = p.id
WHERE p.user_id = $1
  AND p.status != 'archived'
GROUP BY p.id
ORDER BY p.updated_at DESC;
```

### Get marketplace listings with stats
```sql
SELECT
  l.*,
  u.username as creator_username,
  u.avatar_url as creator_avatar,
  COUNT(DISTINCT f.id) as favorite_count,
  COUNT(DISTINCT r.id) as review_count,
  AVG(r.rating) as average_rating
FROM listings l
JOIN users u ON u.id = l.user_id
LEFT JOIN favorites f ON f.listing_id = l.id
LEFT JOIN reviews r ON r.listing_id = l.id
WHERE l.status = 'active'
GROUP BY l.id, u.username, u.avatar_url
ORDER BY l.created_at DESC;
```

### Get user's reading history
```sql
SELECT
  r.*,
  p.name as deck_name,
  p.theme as deck_theme
FROM readings r
LEFT JOIN projects p ON p.id = r.project_id
WHERE r.user_id = $1
ORDER BY r.created_at DESC
LIMIT 50;
```

---

## 🔄 Migration Strategy

### Phase 1: Core Tables
1. users
2. subscriptions
3. style_profiles
4. projects
5. cards
6. card_images

### Phase 2: Marketplace
1. listings
2. orders
3. order_items
4. favorites
5. reviews

### Phase 3: Features
1. readings
2. generation_queue
3. analytics_events

### Phase 4: Advanced
1. whitelabel_configs

---

## 💾 Backup & Recovery

- **Daily automated backups** via Supabase/Neon
- **Point-in-time recovery** (up to 7 days)
- **Export capability** for users (GDPR compliance)
- **Soft deletes** for critical tables (add `deleted_at` column)

---

## 📊 Estimated Storage

### Year 1 Projections:
- **Users:** 10,000 × 1KB = 10MB
- **Projects:** 5,000 × 2KB = 10MB
- **Cards:** 200,000 × 1KB = 200MB
- **Images (metadata only):** 200,000 × 500B = 100MB
- **Orders:** 5,000 × 2KB = 10MB
- **Readings:** 50,000 × 1KB = 50MB
- **Total Database:** ~400MB

### Image Storage (separate, S3/R2):
- 200,000 images × 500KB avg = **100GB**
- With CDN caching and compression

---

**Ready to build! This schema supports the full platform vision.** 🚀
