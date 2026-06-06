# EcoAudit NG — Project Brief

## Overview

**EcoAudit NG** is an AI-powered energy audit web application built for Nigerian SMEs (Small & Medium Enterprises). It helps businesses calculate their energy consumption, carbon footprint, and operational costs, then delivers actionable savings recommendations — including real Nigerian solar merchant integrations — all in under 5 minutes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 8 |
| **Routing** | React Router v7 |
| **Charts** | Recharts 3 |
| **PDF Export** | jsPDF + html2canvas |
| **AI/LLM** | Gemini 2.5 Flash (optional API key via `VITE_GEMINI_API_KEY`) |
| **Styling** | Custom CSS (dark glassmorphism design system, no framework) |
| **Package Manager** | npm |

---

## Architecture

The app is a Single Page Application (SPA) with three main routes served through React Router:

```
App (BrowserRouter)
 └─ AuditProvider (Context/reducer state management)
    └─ Navbar (fixed, conditionally shows Dashboard link)
    └─ Routes
       ├─ /          → Landing.jsx
       ├─ /audit     → Audit.jsx (3-step form wizard)
       └─ /dashboard → Dashboard.jsx (results view)
```

**State management** uses `useReducer` via React Context (`AuditContext.jsx`), with actions for step navigation, audit data updates, generator settings, appliance selection, and full reset.

---

## Pages & User Flow

### 1. Landing Page (`/`)
- Animated hero section with floating particles and glow rings
- Three feature cards: Energy Score, AI-Powered Report, Solar Viability
- CTA button → starts the audit flow

### 2. Audit Form (`/audit`) — 3-Step Wizard

| Step | Component | Description |
|---|---|---|
| 1 | `BusinessProfileForm` | Business type, location, size, operating hours & generator specs |
| 2 | `EnergySetupForm` | Grid hours, appliance selector (categorised: cooling, cooking, lighting, electronics, heavy_duty) |
| 3 | `SpendConfirmation` | Review all data, monthly fuel spend input, summary display |

Navigation via `StepIndicator` (circles + lines) and `ProgressBar`.

### 3. Dashboard (`/dashboard`)
Shows audit results in a responsive grid layout:
- **Energy Score Meter** — 0–100 circular gauge with colour-coded badge
- **Cost Card** — Annual cost + grid vs generator split bar
- **Carbon Card** — CO₂ emissions with contextual comparisons (road trips, Nigerian monthly avg, litres of diesel)
- **Consumption Chart** — Appliance-level kWh breakdown (Recharts)
- **Recommendation Cards** — Priority-sorted (high/medium/low) with savings estimates
- **Solar Verdict Card** — Matched solar packages from real Nigerian merchants
- **AI Report** — Optional Gemini-generated plain-English audit report
- **Export Button** — PDF export of the dashboard

---

## Core Engine

### `calculationEngine.js`
The heart of the app. Takes `auditData` and computes:
- **Per-appliance** kWh, cost, and CO₂ (split by grid vs generator hours)
- **Generator costs** using diesel consumption formula: `kVA × 0.8 × loadFactor × 0.28 L/kWh`
- **Energy Score** (0–100) based on: appliance efficiency, grid vs gen ratio, cooling load %, spend vs benchmark, gen hours
- **Recommendations** derived from data: low-efficiency replacements, gen reduction, cooling optimisation, LED switching, solar consideration
- **Carbon comparisons** contextualised for Nigeria

Key constants:
- Diesel: ₦1,650/L, 2.68 kg CO₂/L (IPCC standard)
- Grid rate: ₦65/kWh
- Solar: ₦600k/kW installed

### `applianceDatabase.js`
30 appliances across 5 categories (cooling, cooking, lighting, electronics, heavy_duty) with wattage and efficiency ratings (1–5).

### `solarEstimator.js` & `solarMerchants.js`
Real solar merchant integration with **4 verified Nigerian vendors**:

| Merchant | Focus | Packages |
|---|---|---|
| **Femtech Energy** | Solar & IT solutions | 3 packages (1.2kW–8kW, ₦495k–₦3.2M) |
| **Arnergy** | Premium business solar | 2 packages (5kW–10kW, ₦2.25M–₦4.2M) |
| **GVE Projects** | Engineering & community | 2 packages (2.5kW–7.5kW, ₦980k–₦2.8M) |
| **SolarForce Nigeria** | Components & installation | 2 packages (1.8kW–6kW, ₦680k–₦2.1M) |

Package matching considers: business size suitability, energy coverage ratio, affordability (3-year payment spread), and a "Goldilocks zone" for ideal system sizing. Returns a verdict of "Viable", "Marginal", or "Not Yet".

### `geminiAudit.js`
Optional AI-generated audit report using Gemini 2.5 Flash. Builds a structured prompt with business profile, audit results, and recommendations. Gracefully falls back if no API key is configured.

---

## Design System (`index.css`)

- **Dark theme** — deep green/black palette (`#050a07` primary, `#00ff88` accent)
- **Glassmorphism** — frosted glass cards with `backdrop-filter: blur()`
- **Animated background** — mesh gradient shift + grain overlay + grid lines
- **Responsive** — desktop-first with 768px and 480px breakpoints
- **Custom scrollbar**, SVG icons, micro-interactions on hover

---

## Utility Layer

- **`formatters.js`** — `formatNaira()`, `formatNumber()`, `formatDecimal()`, `formatPercentage()`, `formatDate()`
- **`pdfExport.js`** — Captures dashboard as canvas → multi-page A4 PDF

---

## Dependencies (Production)

```json
{
  "react": "^19.2.6",
  "react-dom": "^19.2.6",
  "react-router-dom": "^7.15.1",
  "recharts": "^3.8.1",
  "jspdf": "^4.2.1",
  "html2canvas": "^1.4.1"
}
```

---

## Configuration

- **Vite config** — React plugin, dev server on default port
- **Linting** — ESLint with React hooks & refresh plugins
- **Environment** — `VITE_GEMINI_API_KEY` for AI report feature (optional)

---

## Target Audience

Nigerian SME owners/business managers who:
- Rely on generators due to unreliable grid power
- Want to reduce monthly fuel costs
- Are considering solar but need concrete ROI data
- Want an easy, no-jargon energy assessment

---

## Project Structure

```
ecoaudit-ng/
├── public/
├── src/
│   ├── api/
│   │   └── geminiAudit.js           # Gemini AI prompt builder & API client
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── AIReport.jsx          # AI-generated audit report display
│   │   │   ├── CarbonCard.jsx        # CO₂ emissions & comparisons
│   │   │   ├── ConsumptionChart.jsx  # Appliance kWh breakdown (Recharts)
│   │   │   ├── CostCard.jsx          # Annual cost & grid/gen split
│   │   │   ├── EnergyScoreMeter.jsx  # Circular score gauge
│   │   │   ├── RecommendationCards.jsx # Priority-sorted recommendations
│   │   │   └── SolarVerdictCard.jsx   # Solar merchant matches
│   │   ├── form/
│   │   │   ├── ApplianceSelector.jsx  # Appliance grid picker
│   │   │   ├── BusinessProfileForm.jsx # Step 1: business profile
│   │   │   ├── EnergySetupForm.jsx    # Step 2: energy setup
│   │   │   └── SpendConfirmation.jsx  # Step 3: review & submit
│   │   └── shared/
│   │       ├── ExportButton.jsx       # PDF export trigger
│   │       ├── Navbar.jsx             # Fixed top navigation
│   │       ├── ProgressBar.jsx        # Step progress indicator
│   │       └── StepIndicator.jsx      # Step circles with lines
│   ├── context/
│   │   └── AuditContext.jsx           # Global state (useReducer + Context)
│   ├── engine/
│   │   ├── applianceDatabase.js       # 30 appliances, 5 categories
│   │   ├── calculationEngine.js       # Energy score, cost, CO₂ logic
│   │   ├── solarEstimator.js          # Solar viability estimation
│   │   └── solarMerchants.js          # 4 Nigerian solar vendors, 9 packages
│   ├── pages/
│   │   ├── Audit.jsx                  # 3-step form wizard page
│   │   ├── Dashboard.jsx              # Results dashboard page
│   │   └── Landing.jsx                # Hero + features landing page
│   ├── utils/
│   │   ├── formatters.js              # Naira, number, percentage formatters
│   │   └── pdfExport.js               # jsPDF + html2canvas export
│   ├── App.jsx                        # Root with Router + AuditProvider
│   ├── index.css                      # Complete design system (~1200 lines)
│   └── main.jsx                       # Entry point
├── index.html
├── package.json
├── vite.config.js
└── eslint.config.js
```
