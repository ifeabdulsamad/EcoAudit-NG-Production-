# EcoAudit NG — Technical Requirements Document (TRD)

> **Version:** 1.0  
> **Date:** June 6, 2026  
> **Stack:** React 19 + Vite 8 + Supabase + Paystack + Gemini 2.5 Flash

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                     │
│                                                         │
│  React 19 SPA ─── Tailwind CSS v4 ─── Framer Motion v12 │
│         │                     │                          │
│         ▼                     ▼                          │
│  React Router v7         Recharts v3                     │
│  (Pages & Routing)       (Charts & Graphs)               │
│         │                                                 │
│         ▼                                                 │
│  Context API (useReducer)                                 │
│  ┌─────────────────────┐  ┌──────────────────────────┐   │
│  │  AuditContext        │  │  AuthContext              │   │
│  │  (step, data,        │  │  (user, session,          │   │
│  │   results, dispatch) │  │   signIn/Up/Out)          │   │
│  └─────────┬───────────┘  └───────────┬────────────────┘   │
│            │                          │                     │
│            ▼                          ▼                     │
│     Calculation Engine        Supabase JS Client            │
│     (Pure JS, no deps)        (CRUD + Auth)                 │
│            │                          │                     │
│            ▼                          ▼                     │
│     Solar Estimator           Paystack Inline.js            │
│     (Merchant matching)       (Payments)                    │
│            │                          │                     │
│            ▼                          ▼                     │
│     Gemini 2.5 Flash API     localStorage                   │
│     (AI Reports)             (Drafts + Vendor cache)        │
└─────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Client-side first** — No application backend. Everything runs in the browser.
2. **Pure computation engine** — `calculationEngine.js` is a zero-dependency pure JS module.
3. **Graceful degradation** — AI report, solar vendor data, and external APIs all have local fallbacks.
4. **Progressive enhancement** — Core audit works without auth, without payments, without internet.
5. **Nigerian-first** — Constants, pricing, comparisons, and language are Nigeria-specific by default.

---

## 2. Tech Stack (Actual)

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | React | 19.2.6 | UI component library |
| **Bundler** | Vite | 8.0.12 | Dev server & build tool |
| **Language** | JavaScript (JSX) | ES2022 | App logic |
| **Routing** | React Router DOM | 7.15.1 | SPA routing |
| **Styling** | Tailwind CSS | 4.3.0 | Utility-first CSS |
| **Animation** | Framer Motion | 12.40.0 | UI animations & transitions |
| **Charts** | Recharts | 3.8.1 | Energy consumption chart |
| **Icons** | Lucide React | 1.16.0 | Icon library |
| **Auth** | Supabase JS | 2.106.2 | Email/password + Google OAuth |
| **Database** | Supabase (Postgres) | — | User profiles, audits, team |
| **Payments** | Paystack Inline JS | ^2.22.9 | Naira payments |
| **AI** | Gemini 2.5 Flash API | — | Audit report generation |
| **PDF** | html-to-image + jsPDF | 4.2.1 | PDF export |
| **Utils** | clsx, tailwind-merge, cva | — | Class name management |
| **UI Primitives** | @radix-ui/react-slot | 1.2.4 | Slot component for shadcn-style |

---

## 3. Project Structure

```
ecoaudit-ng/
├── index.html                     # Entry HTML (Paystack script loaded here)
├── package.json                   # Dependencies & scripts
├── vite.config.js                 # Vite config (React + Tailwind v4 plugins)
├── tailwind.config.js             # Tailwind theme (colors, animations, fonts)
├── supabase-schema.sql            # Database DDL (profiles, audits, team_members)
│
└── src/
    ├── main.jsx                   # React root mount
    ├── App.jsx                    # BrowserRouter + Providers (Testing → Auth → Audit)
    ├── index.css                  # Tailwind directives + custom CSS vars + utility classes
    │
    ├── api/
    │   ├── auditApi.js            # Supabase CRUD: save/load/delete audits
    │   └── geminiAudit.js         # Gemini prompt builder + fetch wrapper
    │
    ├── components/
    │   ├── AuthModal.jsx/css      # Sign-in/up modal (email + Google)
    │   ├── UpgradeModal.jsx/css   # Plan selection & Paystack payment modal
    │   │
    │   ├── dashboard/
    │   │   ├── EnergyScoreMeter.jsx   # SVG score gauge (0-100)
    │   │   ├── CostCard.jsx           # Annual cost & grid/gen split
    │   │   ├── CarbonCard.jsx         # CO₂ with contextual comparisons
    │   │   ├── ConsumptionChart.jsx   # Recharts bar chart
    │   │   ├── RecommendationCards.jsx # Top 3 savings recommendations
    │   │   ├── SolarVerdictCard.jsx    # Solar viability & matched packages
    │   │   └── AIReport.jsx           # AI report display with skeletons
    │   │
    │   ├── form/
    │   │   ├── BusinessProfileForm.jsx # Step 1: type, location, size, hours
    │   │   ├── EnergySetupForm.jsx     # Step 2: generator, grid, appliances
    │   │   ├── ApplianceSelector.jsx   # Category-filtered appliance grid
    │   │   └── SpendConfirmation.jsx   # Step 3: review & monthly spend
    │   │
    │   ├── shared/
    │   │   ├── Navbar.jsx          # Global nav with auth state + testing banner
    │   │   ├── ExportButton.jsx    # PDF export with loading/success states
    │   │   ├── ProgressBar.jsx     # Step progress indicator
    │   │   └── StepIndicator.jsx   # Step circles with connecting lines
    │   │
    │   └── ui/                     # shadcn-style UI primitives
    │       ├── badge.jsx, button.jsx, card.jsx
    │       ├── input.jsx, progress.jsx, select.jsx
    │
    ├── context/
    │   ├── AuditContext.jsx       # Global audit state (useReducer)
    │   ├── AuthContext.jsx        # Auth session management
    │   └── TestingModeContext.jsx # Testing mode flag + fake user
    │
    ├── engine/
    │   ├── calculationEngine.js   # Core energy/carbon math (pure JS)
    │   ├── applianceDatabase.js   # 30 appliances, 5 categories
    │   ├── solarEstimator.js      # Solar viability estimation
    │   └── solarMerchants.js      # 4 Nigerian vendors, 9 packages
    │
    ├── hooks/
    │   ├── useFeatureGate.js     # Freemium feature access control
    │   ├── useFormPersistence.js # localStorage draft save/load
    │   ├── useSolarVendors.js    # Solar data fetch/refresh
    │   └── useSwipe.js           # Touch gesture detection
    │
    ├── lib/
    │   ├── supabase.js           # Supabase client instance
    │   └── utils.js              # cn() helper + formatters
    │
    ├── pages/
    │   ├── Landing.jsx           # Marketing page (hero, features, FAQ)
    │   ├── Audit.jsx             # 3-step form wizard page
    │   ├── Dashboard.jsx         # Results dashboard grid
    │   ├── MyAudits.jsx/css      # Saved audit history
    │   ├── Pricing.jsx/css       # Pricing comparison table
    │   └── Testing.jsx           # Testing mode activator
    │
    ├── services/
    │   ├── paystack.js           # Paystack payment handler
    │   └── solarVendorService.js # Remote vendor fetch with caching
    │
    └── utils/
        ├── fallbackReport.js     # Local report generator (offline fallback)
        ├── formatters.js         # formatNaira, formatNumber, etc.
        └── pdfExport.js          # jsPDF + html-to-image capture
```

---

## 4. Data Flow

### 4.1 Audit Flow (No Auth Required)

```
User → Landing Page → ["Start Free Audit"]
  → /audit (Step 1: BusinessProfileForm)
    → Step 2: EnergySetupForm (generator + grid + appliances)
    → Step 3: SpendConfirmation (review + monthly fuel spend)
  → calculateAudit(auditData)  ← Pure JS engine
  → estimateSolar(results)     ← Merchant matching
  → /dashboard (results view)
```

**State:** `AuditContext` (useReducer) holds `currentStep`, `auditData`, `auditResults`.

### 4.2 Save/Retrieve Flow (Auth Required)

```
Dashboard → "Save Audit"
  → If !user → show AuthModal
  → If !canSave → show UpgradeModal
  → supabase.from('audits').insert({ user_id, audit_data, results })

My Audits → Click audit card
  → loadSavedAudit(audit) → set auditData + auditResults + step=4
  → navigate('/dashboard')
```

### 4.3 Payment Flow

```
UpgradeModal / Pricing → Select Plan
  → PaystackPop.setup({ key, email, amount, ref })
  → handler.openIframe() → Paystack checkout modal
  → On success → updateUserPlan(user.id, planType) → reload
```

### 4.4 AI Report Flow

```
Dashboard → AIReport component mounts
  → generateAuditReport(auditResults) → Gemini API call
  → If success → display markdown-formatted report
  → If fail → generateLocalReport(auditResults) → display local fallback
  → If no API key + offline → immediate local fallback
```

### 4.5 Solar Vendor Data Flow

```
Dashboard → SolarVerdictCard mounts
  → useSolarVendors(auditResults) hook
  → Check localStorage cache (24h TTL)
  → If stale/missing → fetch from remote API (with 2 retries)
  → If fetch fails → use embedded SOLAR_MERCHANTS fallback data
  → matchSolarPackages(auditResults, vendors) → rank & score packages
  → getSolarVerdict(matchedPackages) → "Viable" | "Marginal" | "Not Yet"
```

---

## 5. Calculation Engine Details

### 5.1 Input (auditData)

```js
{
  businessType: "restaurant" | "retail" | "office" | "salon" | "pharmacy" | "hotel" | "other",
  location: "Ibadan, Oyo State",
  size: "micro" | "small" | "medium",
  operatingHours: 12,          // 1–24
  generator: {
    capacityKVA: 10,           // 1–100
    hoursPerDay: 8,            // 0–24
    fuelType: "diesel" | "petrol"
  },
  appliances: [
    { id: "chest_freezer", quantity: 2, hoursPerDay: 24 },
    { id: "ac_1.5hp", quantity: 1, hoursPerDay: 10 }
  ],
  gridHoursPerDay: 4,          // 0–24
  monthlyFuelSpend: 180000     // ₦ (0 = estimated from generator)
}
```

### 5.2 Output (auditResults)

```js
{
  score: 38,                         // 0–100
  totalAnnualKwh: 52340,
  totalAnnualCost: 2160000,          // ₦
  totalAnnualCo2: 3470,              // kg
  effectiveMonthlyFuelCost: 180000,  // ₦ (user input or calculated)
  calculatedMonthlyFuelCost: 165000, // ₦ (from generator formula)
  genOverheadAnnualCost: 2160000,    // ₦
  benchmark: 180000,                 // ₦/month for similar businesses
  applianceResults: [
    {
      id: "chest_freezer", label: "Chest Freezer",
      category: "cooling", wattage: 350,
      quantity: 2, hoursPerDay: 24,
      dailyKwh: 16.8, monthlyKwh: 504, annualKwh: 6132,
      annualCost: 425000,
      annualCo2: 680,
      efficiencyRating: 3
    }
  ],
  recommendations: [
    { priority: "high", title: "Replace Chest Freezer", savings: 170000, ... },
    { priority: "high", title: "Reduce Generator Hours", savings: 648000, ... }
  ],
  carbonComparisons: {
    lagosAbujaRoadTrip: 19,           // trips equivalent
    nigerianMonthlyAvg: 2,            // × average Nigerian monthly footprint
    litresOfDieselBurned: 1295         // L
  },
  auditSummary: { businessType, location, size, ... }
}
```

### 5.3 Key Constants

| Constant | Value | Source |
|---|---|---|
| Diesel price | ₦1,650/L | Nigerian market (2026) |
| CO₂ factor | 2.68 kg/L | IPCC standard |
| Generator efficiency | 0.85 | Typical diesel genset |
| Grid rate | ₦65/kWh | NERC average |
| Solar install cost | ₦600k/kW | 2025–26 Nigeria average |
| Diesel consumption | 0.28 L/kWh | Engine formula |

### 5.4 Score Formula (0–100)

```
Base = 68
  + (avgEfficiency - 3) × 5          // ±10
  + (gridFraction - 0.5) × 20        // ±10
  - cooling penalty (if > 35% load)  // -7 to -12
  + spend vs benchmark bonus/penalty  // -15 to +10
  - gen hours penalty                 // -10 to +5
→ Clamp 0–100
```

---

## 6. External Integrations

### 6.1 Supabase

| Purpose | Feature | Endpoint |
|---|---|---|
| Auth (email) | `signInWithPassword`, `signUp`, `signOut` | `supabase.auth.*` |
| Auth (Google) | `signInWithOAuth({ provider: 'google' })` | `supabase.auth.*` |
| Profiles | CRUD on `profiles` table | `supabase.from('profiles')` |
| Audits | CRUD on `audits` table | `supabase.from('audits')` |
| RPC | `increment_audit_count` | `supabase.rpc()` |

**Env vars:** `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### 6.2 Gemini 2.5 Flash

| Purpose | Feature | Endpoint |
|---|---|---|
| AI Report | `generateAuditReport()` | `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}` |

**Env var:** `VITE_GEMINI_API_KEY`
**Cost:** ~$0.0005 per report (< ₦1)

### 6.3 Paystack

| Purpose | Feature | Mechanism |
|---|---|---|
| Payments | `initializePayment()` | `PaystackPop.setup()` via inline script |
| Plans | Pro (₦3,000), Business (₦8,000), One-time (₦1,500) | Amounts in kobo |

**Env var:** `VITE_PAYSTACK_PUBLIC_KEY`

---

## 7. Performance & Caching

| Strategy | Where | What |
|---|---|---|
| localStorage | `useFormPersistence.js` | Audit form drafts (24h expiry) |
| localStorage | `solarVendorService.js` | Solar vendor data cache (24h TTL) |
| React Context | `AuditContext.jsx` | In-memory audit state |
| React Context | `AuthContext.jsx` | In-memory auth session |
| lazy loading | N/A (not implemented) | — |
| image optimization | `html-to-image` | Dashboard export only |

---

## 8. Security

- **API keys:** All keys are client-side (VITE_* env vars) — standard for Supabase anon key + Gemini API key
- **RLS:** Row-level security enforced on all Supabase tables
- **Auth:** Supabase handles password hashing, session tokens, OAuth
- **Paystack:** Card data never reaches our server — handled entirely by Paystack iframe
- **No backend:** Zero server-side code means zero server-side attack surface
- **.gitignore:** `.env` is gitignored; keys set via Vercel environment variables in production

---

## 9. Testing Mode

The app includes a **testing mode** that bypasses all auth and unlocks all features:

- **Route:** `/testing`
- **Mechanism:** `TestingModeContext` reads `ecoaudit_testing_mode` from localStorage
- **Fake user:** `{ id: 'testing-user-123', email: 'testing@ecoaudit.ng', plan: 'business' }`
- **Banner:** Amber warning bar at top of screen
- **Usage:** Demo, development, and judging purposes
