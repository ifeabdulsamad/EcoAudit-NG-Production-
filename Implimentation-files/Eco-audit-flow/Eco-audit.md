# EcoAudit NG — Full Project Context (AI Session Primer)

> **Use this file at the start of every new AI session to get full context.**  
> **Updated:** June 6, 2026  
> **Project Root:** `C:\Users\IFEOLUWA ABDULSAMAD\Documents\EcoAudit NG\ecoaudit-ng`

---

## What Is EcoAudit NG?

An AI-powered energy audit web app for **Nigerian SMEs**. Users fill a 3-step form about their business energy setup and instantly get:

- **Energy Score** (0–100 circular gauge)
- **Cost Breakdown** (annual ₦ spend, grid vs generator split)
- **Carbon Footprint** (CO₂ with Nigerian contextual comparisons — Lagos–Abuja road trips, litres of diesel)
- **Appliance Consumption Chart** (horizontal bar chart by kWh/day)
- **Top 3 Recommendations** (prioritized with ₦ savings estimates)
- **Solar Viability Verdict** (matched against real Nigerian vendor packages with pricing)
- **AI-Generated Report** (Gemini 2.5 Flash — Pro feature, local fallback included)
- **PDF Export** (jsPDF + html-to-image)

**Deployed at:** `https://ecoauditng.vercel.app`  
**Deadline:** May 29, 2026 (GDGoC Unilorin CareerFest26)

---

## Quick Start

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (localhost:5173)
npm run build      # Production build to ./dist
```

**Environment variables** (create `.env`):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GEMINI_API_KEY=your-gemini-key
VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxx
```

---

## Tech Stack (What Actually Exists)

| Layer | Tech | Version | Key Packages |
|---|---|---|---|
| **Framework** | React + Vite | 19.2.6 / 8.0.12 | `react`, `react-dom`, `vite` |
| **Routing** | React Router | 7.15.1 | `react-router-dom` |
| **Styling** | Tailwind CSS | 4.3.0 | `tailwindcss`, `@tailwindcss/vite` |
| **Animations** | Framer Motion | 12.40.0 | `framer-motion` |
| **Charts** | Recharts | 3.8.1 | `recharts` |
| **Auth** | Supabase | 2.106.2 | `@supabase/supabase-js` |
| **DB** | Supabase (Postgres) | — | Schema in `supabase-schema.sql` |
| **Payments** | Paystack | ^2.22.9 | `@paystack/inline-js` + CDN |
| **AI** | Gemini 2.5 Flash | — | REST API direct |
| **PDF** | html-to-image + jsPDF | 4.2.1 | `html-to-image`, `jspdf` |
| **Icons** | Lucide React | 1.16.0 | `lucide-react` |
| **UI Utils** | CVA + clsx + tailwind-merge | — | `class-variance-authority`, `clsx`, `tailwind-merge` |
| **Deploy** | Vercel | — | `vercel --prod` |
| **Package Mgr** | npm | — | — |

---

## Project Structure (Key Files)

```
ecoaudit-ng/
├── supabase-schema.sql              # DB DDL — profiles, audits, team_members tables
├── src/
│   ├── App.jsx                      # Root: TestingModeProvider → AuthProvider → AuditProvider → Router
│   ├── index.css                    # Tailwind directives + custom animations
│   ├── main.jsx                     # React DOM mount
│   │
│   ├── engine/                      ★ HEART OF THE APP — pure JS, zero deps
│   │   ├── calculationEngine.js     # calculateAudit() — takes auditData, returns auditResults
│   │   ├── applianceDatabase.js     # 30 appliances × 5 categories × wattage × efficiency
│   │   ├── solarMerchants.js        # 4 vendors (Femtech, Arnergy, GVE, SolarForce), 9 packages
│   │   └── solarEstimator.js        # estimateSolar() — matches merchants to audit
│   │
│   ├── api/
│   │   ├── auditApi.js              # Supabase CRUD: save/load/delete audits, profiles, plans
│   │   └── geminiAudit.js           # Gemini API prompt builder + fetch (model: gemini-2.5-flash)
│   │
│   ├── context/
│   │   ├── AuditContext.jsx         # useReducer({ currentStep, auditData, auditResults })
│   │   ├── AuthContext.jsx          # user, session, signIn/Up/Out (with testing mode bypass)
│   │   └── TestingModeContext.jsx   # isTestingMode, fake business-plan user
│   │
│   ├── hooks/
│   │   ├── useFeatureGate.js        # plan, isPro, isBusiness, canAccess(feature), canSaveAudit()
│   │   ├── useFormPersistence.js    # localStorage drafts with 24h expiry
│   │   ├── useSolarVendors.js       # Fetches vendor data, falls back to local
│   │   └── useSwipe.js              # Touch gesture detection (left/right swipe)
│   │
│   ├── components/
│   │   ├── form/                    # 3-step wizard
│   │   │   ├── BusinessProfileForm.jsx  # Type, location, size, hours
│   │   │   ├── EnergySetupForm.jsx      # Generator, grid hours, appliances
│   │   │   ├── ApplianceSelector.jsx    # Category-filtered grid, quantity/hours controls
│   │   │   └── SpendConfirmation.jsx    # Review + monthly fuel spend input
│   │   ├── dashboard/               # Results views
│   │   │   ├── EnergyScoreMeter.jsx     # SVG ring gauge
│   │   │   ├── CostCard.jsx             # Annual cost + grid/gen split bar
│   │   │   ├── CarbonCard.jsx           # CO₂ + contextual comparisons
│   │   │   ├── ConsumptionChart.jsx     # Recharts horizontal bar
│   │   │   ├── RecommendationCards.jsx  # Top 3 with savings
│   │   │   ├── SolarVerdictCard.jsx     # Merchant-matched packages
│   │   │   └── AIReport.jsx            # Gemini report or local fallback
│   │   ├── shared/
│   │   │   ├── Navbar.jsx               # Global nav + testing banner
│   │   │   └── ExportButton.jsx         # PDF export with gating
│   │   ├── ui/                          # shadcn-style primitives
│   │   └── AuthModal.jsx / UpgradeModal.jsx  # Auth + payment modals
│   │
│   ├── pages/
│   │   ├── Landing.jsx              # Full marketing page: hero, features, testimonials, FAQ
│   │   ├── Audit.jsx                # 3-step wizard with draft recovery, swipe, mobile nav
│   │   ├── Dashboard.jsx            # Results grid with save, export, upgrade gates
│   │   ├── MyAudits.jsx             # Saved audit history list
│   │   ├── Pricing.jsx              # Full pricing comparison table
│   │   └── Testing.jsx              # /testing route — enables testing mode
│   │
│   ├── services/
│   │   ├── paystack.js              # initializePayment(), getPlanDetails()
│   │   └── solarVendorService.js    # Remote fetch with cache + embedded fallback
│   │
│   └── utils/
│       ├── fallbackReport.js        # Local offline report generator
│       ├── formatters.js            # formatNaira, formatNumber, etc.
│       └── pdfExport.js             # toPng() → jsPDF multi-page export
│
├── Implementation-files/            # Documentation
│   ├── PRD.md                       # Product Requirements Document
│   ├── TRD.md                       # Technical Architecture Document
│   ├── DATABASE-SCHEMA.md           # Full schema reference
│   ├── Eco-audit.md                 # THIS FILE — AI session primer
│   ├── PROJECT_BRIEF.md             # Original project brief
│   ├── FEATURE-MATRIX.md            # Free vs Pro vs Business features
│   ├── SETUP-GUIDE.md               # Supabase + Paystack setup steps
│   ├── GOOGLE-OAUTH-SETUP.md        # Google OAuth configuration guide
│   └── EcoAudit_NG_Auth_Implementation.md  # Full auth & freemium implementation guide
```

---

## Pricing Tiers (Implemented in Code)

| Plan | Price | Limits | Key Locked Features |
|---|---|---|---|
| **Free** | ₦0 | 1 saved audit | No AI report, no PDF export, no history |
| **Pro** | ₦3,000/mo | 5 saved audits | AI report, PDF, audit history |
| **Business** | ₦8,000/mo | Unlimited | Everything + team (3 users), compare, multi-location, white-label |
| **One-time** | ₦1,500 | 1 report | Single AI report + PDF (no subscription) |

**Feature gating:** `src/hooks/useFeatureGate.js` — `canAccess('ai_report')`, `canSaveAudit()`, etc.

---

## Core Calculation Constants

```js
DIESEL_EMISSIONS_FACTOR = 2.68       // kg CO₂ per litre (IPCC)
DIESEL_PRICE_NGN = 1650              // ₦/litre
GENERATOR_EFFICIENCY = 0.85          // 85%
SOLAR_COST_PER_KW_NGN = 600000       // ₦600k/kW installed
GRID_RATE_NGN = 65                   // ₦/kWh
```

**Score formula:** Base 68 + efficiency ±10 + grid ratio ±10 - cooling penalty - spend penalty - gen hours penalty, clamped 0–100.

**Appliances:** 30 items in 5 categories (cooling, cooking, lighting, electronics, heavy_duty) with wattage (10W–3000W) and efficiency ratings (1–5).

**Solar vendors:** Femtech Energy (3 packages), Arnergy (2), GVE Projects (2), SolarForce Nigeria (2). Total: 9 packages, ₦495k–₦4.2M.

---

## Authentication Flow

- **Email/password:** Supabase `signInWithPassword` / `signUp`
- **Google OAuth:** Supabase `signInWithOAuth({ provider: 'google' })`
- **Session:** Managed via AuthContext (subscribes to `onAuthStateChange`)
- **Profile creation:** Automatic via `on_auth_user_created` DB trigger
- **Testing mode:** `/testing` route activates `TestingModeContext` → fake business-plan user, bypasses all gates
- **UI:** AuthModal (email + Google), UpgradeModal (plan selection → Paystack)

---

## Database (Supabase)

| Table | Purpose | Key Columns |
|---|---|---|
| `profiles` | User extends auth.users | id, email, plan ('free'/'pro'/'business'), audit_count |
| `audits` | Saved audit records | id, user_id, business_name, location, energy_score, audit_data (JSONB), results (JSONB) |
| `team_members` | Business plan team | owner_id, member_id, UNIQUE constraint |

RLS enabled on all tables. See `supabase-schema.sql` for full DDL.

---

## External API Keys Required

| Key | Where | Service |
|---|---|---|
| `VITE_SUPABASE_URL` | `.env` → `src/lib/supabase.js` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | `.env` → `src/lib/supabase.js` | Supabase anon key |
| `VITE_GEMINI_API_KEY` | `.env` → `src/api/geminiAudit.js` | Google AI Studio (free) |
| `VITE_PAYSTACK_PUBLIC_KEY` | `.env` → `src/services/paystack.js` | Paystack dashboard (test/live) |

---

## Common Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # ESLint check
vercel --prod        # Deploy to Vercel
```

---

## Key Architecture Decisions

1. **No backend server** — Everything runs client-side via Supabase and direct API calls
2. **Pure JS calculation engine** — `calculationEngine.js` has zero dependencies, fully testable
3. **Graceful degradation everywhere** — AI report (local fallback), solar data (embedded fallback), auth (testing mode bypass)
4. **Nigerian-first** — Constants, comparisons (Lagos–Abuja road trips), pricing (₦), merchant data (Nigerian vendors)
5. **Mobile-responsive** — Fixed bottom nav on mobile, swipe gestures, touch-optimized form controls

---

## What's Implemented vs Not

### ✅ Fully Implemented
- Core audit engine + 30 appliance database
- 3-step form wizard with draft persistence
- Full results dashboard (score, cost, carbon, chart, recommendations, solar)
- AI report via Gemini 2.5 Flash (with local fallback + copy feature)
- PDF export via html-to-image + jsPDF
- Supabase auth (email/password + Google OAuth)
- Paystack payments (Pro, Business, one-time)
- Freemium gating (useFeatureGate)
- Audit history (My Audits page)
- Solar merchant vendor service (remote fetch + cache + fallback)
- Testing mode (bypass auth, unlock all features)
- Pricing comparison page
- Upgrade modal
- Landing page with all sections
- Mobile swipe navigation
- Form draft persistence/recovery

### ⬜ Not Yet Implemented (Schema/Code-Ready)
- Audit comparison (side-by-side)
- Multi-location/branch management
- Team access (team_members table exists, UI not built)
- Monthly energy report email
- White-label PDF
- Subscription expiry handling

---

## Common Pitfalls to Avoid

1. **DO NOT** add a backend — the whole point is serverless simplicity
2. **DO NOT** break the pure JS engine — `calculationEngine.js` must remain dependency-free
3. **DO NOT** remove fallbacks — AI report and solar data must always have degraded options
4. **DO NOT** deploy without VITE_* env vars set in Vercel
5. **DO NOT** ignore RLS — all Supabase queries rely on row-level security
6. **DO NOT** remove testing mode — it's essential for demo/judging
7. **REMEMBER** the form step validation: Step 1 needs businessType+location+size, Step 2 needs ≥1 appliance, Step 3 always valid
