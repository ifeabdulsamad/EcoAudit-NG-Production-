# EcoAudit NG — Product Requirements Document (PRD)

> **Version:** 1.0  
> **Date:** June 6, 2026  
> **Status:** Implemented & Deployed  
> **Author:** LUIPHYX (Ife Abdulsamad)

---

## 1. Product Overview

**EcoAudit NG** is an AI-powered energy audit web application purpose-built for Nigerian SMEs (Small & Medium Enterprises). It enables business owners to calculate their energy consumption, carbon footprint, and operational costs in under 5 minutes, then delivers actionable savings recommendations — including real Nigerian solar merchant pricing — without requiring any specialized technical knowledge.

### 1.1 Why This Product Exists

Nigerian SMEs face a unique energy crisis:
- **Unreliable grid power** — average 4–6 hours of grid electricity daily
- **High generator dependence** — businesses run generators 8–16+ hours/day
- **Rising diesel costs** — ₦1,650/litre as of 2026
- **No visibility** — most businesses have no idea which appliances cost the most
- **Solar uncertainty** — businesses want solar but lack concrete ROI data

Energy costs represent **20–40% of operating expenses** for most Nigerian SMEs. No tool existed that gave them a simple, fast, Nigeria-specific energy assessment with real market pricing.

### 1.2 Mission

Democratize energy intelligence for Nigerian businesses — give every SME owner the same data-driven insights that large corporations pay consultants for, in under 5 minutes, for free.

---

## 2. Target Audience

### Primary Users

| Persona | Description | Needs |
|---|---|---|
| **Small Business Owner** | Restaurant, retail shop, salon, pharmacy owner in Lagos/Ibadan/Abuja | Reduce monthly diesel costs, understand energy waste, evaluate solar |
| **Facility Manager** | Manages operations for medium businesses (hotels, clinics, offices) | Track energy across locations, justify solar investment to management |
| **Energy Consultant** | Advises SMEs on energy efficiency | Quick baseline audits, data for recommendations |

### Secondary Users

| Persona | Description | Needs |
|---|---|---|
| **Solar Vendor** | Renewable energy companies | Lead generation, matching with qualified businesses |
| **NGO/Policy Maker** | Development organizations focused on clean energy | Aggregate data on SME energy consumption patterns |

### User Demographics

- **Geography:** Urban & peri-urban Nigeria (Lagos, Ibadan, Abuja, Port Harcourt, Enugu)
- **Business size:** 1–100 employees
- **Tech literacy:** Moderate — comfortable with smartphone apps and basic web tools
- **Primary device:** Mobile phone (Android/iPhone)

---

## 3. User Stories

### Core Flow

```
As a business owner, I want to…
```

| ID | Story | Priority | Status |
|---|---|---|---|
| US-01 | …complete an energy audit in under 5 minutes without signing up | P0 | ✅ Done |
| US-02 | …see my energy efficiency score (0–100) immediately | P0 | ✅ Done |
| US-03 | …see which appliances cost me the most money | P0 | ✅ Done |
| US-04 | …understand my carbon footprint in terms I can relate to | P0 | ✅ Done |
| US-05 | …get prioritized recommendations with naira savings estimates | P0 | ✅ Done |
| US-06 | …see if solar is viable for my business with real vendor pricing | P0 | ✅ Done |
| US-07 | …download a PDF of my audit results | P1 | ✅ Done |
| US-08 | …get an AI-generated plain-English audit report | P1 | ✅ Done (gated) |
| US-09 | …save my audit and come back to it later | P1 | ✅ Done (gated) |
| US-10 | …view my audit history across different sessions | P1 | ✅ Done (gated) |
| US-11 | …compare multiple audits for different business locations | P2 | ⬜ Not yet |
| US-12 | …share my audit with team members | P2 | ⬜ Not yet (schema ready) |

### Authentication & Payments

| ID | Story | Priority | Status |
|---|---|---|---|
| US-20 | …sign up with email/password or Google OAuth | P1 | ✅ Done |
| US-21 | …upgrade from free to Pro or Business plan | P1 | ✅ Done |
| US-22 | …pay in Naira using cards, bank transfer, or USSD | P1 | ✅ Done (Paystack) |
| US-23 | …buy a single AI report without subscribing | P1 | ✅ Done (₦1,500) |

---

## 4. Feature Inventory (What Actually Exists in Code)

### Core Features (All Tiers)

| Feature | File(s) | Description |
|---|---|---|
| 3-Step Audit Wizard | `Audit.jsx`, `BusinessProfileForm.jsx`, `EnergySetupForm.jsx`, `SpendConfirmation.jsx` | Business profile → Energy setup → Confirm |
| Appliance Database (30 items) | `applianceDatabase.js` | 5 categories: cooling, cooking, lighting, electronics, heavy_duty |
| Calculation Engine | `calculationEngine.js` | Pure JS: kWh, costs, CO₂, energy score, recommendations |
| Energy Score (0–100) | `EnergyScoreMeter.jsx` | SVG circular gauge with color-coded rating |
| Consumption Chart | `ConsumptionChart.jsx` | Recharts horizontal bar chart by appliance |
| Carbon Footprint | `CarbonCard.jsx` | CO₂ comparisons: road trips, diesel litres, avg Nigerian |
| Cost Breakdown | `CostCard.jsx` | Annual cost, grid vs generator split visualization |
| Recommendations | `RecommendationCards.jsx` | Top 3 prioritized with naira savings |
| Solar Viability | `SolarVerdictCard.jsx`, `solarMerchants.js` | Real pricing from 4 Nigerian vendors |
| Mobile Swipe Navigation | `useSwipe.js` | Touch gestures to navigate form steps |
| Form Draft Persistence | `useFormPersistence.js` | localStorage draft with 24h expiry |
| Animated UI | All components + `framer-motion` | Micro-interactions, page transitions, loading states |

### Gemini AI Report

| Feature | File(s) | Description |
|---|---|---|
| AI Report Generation | `geminiAudit.js` | Gemini 2.5 Flash API with Nigerian-context prompt |
| Local Fallback Report | `fallbackReport.js` | Structured report generated locally when offline |
| Streaming Skeleton | `AIReport.jsx` | Animated skeleton while report loads |
| Copy to Clipboard | `AIReport.jsx` | One-click copy of report text |

### Authentication & Database

| Feature | File(s) | Description |
|---|---|---|
| Auth Context | `AuthContext.jsx` | Session management, sign-in/up/out |
| Auth Modal | `AuthModal.jsx` | Email/password + Google OAuth with error handling |
| Supabase Client | `supabase.js` | `@supabase/supabase-js` client |
| Audit API | `auditApi.js` | CRUD: saveAudit, getUserAudits, deleteAudit, getUserProfile, updateUserPlan |

### Freemium & Payments

| Feature | File(s) | Description |
|---|---|---|
| Feature Gate Hook | `useFeatureGate.js` | Per-feature and per-tier access control |
| Paystack Integration | `paystack.js` | Payment initialization, plan details |
| Upgrade Modal | `UpgradeModal.jsx` | Plan selection modal with Paystack checkout |
| Pricing Page | `Pricing.jsx`, `Pricing.css` | Full comparison table, subscribe buttons |
| My Audits Page | `MyAudits.jsx`, `MyAudits.css` | Saved audit history with view/delete |

### Testing & Development

| Feature | File(s) | Description |
|---|---|---|
| Testing Mode | `TestingModeContext.jsx` | Bypasses auth with fake business-plan user |
| Testing Route | `Testing.jsx` | `/testing` route activates testing mode |
| Solar Vendor Service | `solarVendorService.js` | Remote fetch with localStorage caching and fallback |

---

## 5. Pricing Tiers (Implemented)

| Plan | Price | Key Limits | Paid Features |
|---|---|---|---|
| **Free** | ₦0 | 1 audit, basic results | — |
| **Pro** | ₦3,000/mo | 5 saved audits | AI report, PDF export, audit history |
| **Business** | ₦8,000/mo | Unlimited | Everything + team (3 users), compare, multi-location, white label, monthly email |
| **One-Time** | ₦1,500 | 1 report | Single AI report + PDF export |

---

## 6. Success Metrics

### Launch Metrics (GDGoC Unilorin CareerFest26 — May 29, 2026)

| Metric | Target | Measurement |
|---|---|---|
| Total audits completed | 500+ in first month | Supabase audits table count |
| Audit completion rate | > 60% (start → finish) | localStorage draft vs completed |
| Free → Paid conversion | > 5% | profiles with plan != 'free' |
| AI report views | > 200 | Gemini API call count |
| PDF exports | > 100 | Export button clicks |
| Mobile completion rate | > 40% of total | User-agent tracking |

### Growth Metrics

| Metric | Target |
|---|---|
| Monthly active users | 500+ by month 3 |
| Customer acquisition cost | < ₦500 |
| Monthly recurring revenue | ₦200k+ by month 6 |
| NPS (Net Promoter Score) | > 40 |

---

## 7. Competitive Landscape

| Product | Type | EcoAudit Advantage |
|---|---|---|
| **CarbonHq / Greenly** | Enterprise carbon accounting | Too expensive, not Nigeria-specific |
| **Manual Excel audits** | DIY | EcoAudit is 5 minutes vs hours |
| **Solar company assessments** | Vendor-specific | Independent, multi-vendor comparison |
| **Energy audit consultants** | Premium service | 95% cheaper, instant results |

---

## 8. Roadmap

### Phase 1 — Complete (Current)
- ✅ Core audit engine + 30-appliance database
- ✅ 3-step form wizard
- ✅ Dashboard with score, cost, carbon, chart, recommendations
- ✅ Solar viability with 4 real vendors
- ✅ AI report (Gemini 2.5 Flash)
- ✅ PDF export
- ✅ Supabase auth (email + Google)
- ✅ Paystack payments
- ✅ Freemium gating
- ✅ Audit history
- ✅ Testing mode
- ✅ Mobile-responsive UI

### Phase 2 — Next
- ⬜ Audit comparison (side-by-side)
- ⬜ Multi-location/branch management
- ⬜ Team access (shared audits)
- ⬜ Monthly energy report email
- ⬜ White-label PDF branding
- ⬜ NERC tariff data integration
- ⬜ Admin dashboard

### Phase 3 — Future
- ⬜ Mobile app (React Native)
- ⬜ Real-time energy monitoring API integration
- ⬜ Carbon credit marketplace
- ⬜ Bulk audit for enterprise clients
- ⬜ PAYG solar financing integration
