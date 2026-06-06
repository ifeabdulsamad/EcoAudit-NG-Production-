# EcoAudit NG — Claude Code Agent Instructions

## Project Overview
EcoAudit NG is an AI-powered energy and carbon audit tool for Nigerian SMEs.
Users fill a multi-step form about their business energy setup and receive:
- An energy efficiency score (0–100)
- Appliance-by-appliance consumption breakdown
- Carbon footprint estimate with real-world Nigerian comparisons
- AI-generated plain-English audit report (via Claude API)
- Solar viability verdict with naira-based payback calculation
- Downloadable PDF summary

**Submission deadline: May 29, 2026 — GDGoCUnilorin CareerFest26**

---

## Tech Stack
- **Frontend:** React + Vite
- **Charts:** Recharts
- **AI Report:** Google Gemini API (`gemini-2.5-flash`)
- **PDF Export:** jsPDF + html2canvas
- **Deployment:** Vercel
- **Styling:** CSS variables + custom dark theme (no Tailwind)

---

## Bash Commands
- `npm run dev` — start local dev server
- `npm run build` — production build
- `npm run preview` — preview production build locally
- `vercel --prod` — deploy to production

---

## Project Structure
```
ecoaudit-ng/
├── public/
├── src/
│   ├── components/
│   │   ├── form/
│   │   │   ├── BusinessProfileForm.jsx   ← Step 1
│   │   │   ├── EnergySetupForm.jsx       ← Step 2
│   │   │   ├── ApplianceSelector.jsx     ← Appliance picker grid
│   │   │   └── SpendConfirmation.jsx     ← Step 3
│   │   ├── dashboard/
│   │   │   ├── EnergyScoreMeter.jsx      ← SVG circular ring (0–100)
│   │   │   ├── ConsumptionChart.jsx      ← Recharts bar chart
│   │   │   ├── CarbonCard.jsx            ← CO₂ footprint display
│   │   │   ├── CostCard.jsx              ← Naira cost breakdown
│   │   │   ├── AIReport.jsx              ← Streaming Claude report
│   │   │   ├── RecommendationCards.jsx   ← Top 3 action cards
│   │   │   └── SolarVerdictCard.jsx      ← Solar viability result
│   │   └── shared/
│   │       ├── ProgressBar.jsx
│   │       ├── StepIndicator.jsx
│   │       └── ExportButton.jsx
│   ├── engine/
│   │   ├── calculationEngine.js          ← Core energy/carbon math (pure JS)
│   │   ├── applianceDatabase.js          ← ~30 appliances with wattage data
│   │   └── solarEstimator.js             ← Solar ROI calculator
│   ├── api/
│   │   └── geminiAudit.js               ← Gemini API call + prompt builder
│   ├── context/
│   │   └── AuditContext.jsx              ← Global audit state (React Context)
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Audit.jsx
│   │   └── Dashboard.jsx
│   ├── utils/
│   │   ├── pdfExport.js
│   │   └── formatters.js                ← naira formatting, unit conversion
│   └── App.jsx
├── .env                                  ← VITE_GEMINI_API_KEY
└── package.json
```

---

## Core Constants (Do Not Change Without Reason)
```js
DIESEL_EMISSIONS_FACTOR = 2.68   // kg CO₂ per litre (IPCC standard)
DIESEL_PRICE_NGN = 1650          // ₦/litre — update if market shifts
GENERATOR_EFFICIENCY = 0.85      // 85% load efficiency factor
SOLAR_COST_PER_KW_NGN = 600000   // ₦600k per kW installed (2025 Nigeria avg)
```

---

## Calculation Engine Rules
- `calculationEngine.js` is a **pure JS module** — no React, no API calls, no side effects
- It takes `auditData` object and returns `auditResults` object
- Test it independently before wiring to UI
- All math must be traceable — no magic numbers without constants defined above
- Energy score (0–100) is derived from: appliance efficiency ratings, generator hours vs PHCN ratio, cooling load %, and spend vs industry benchmark

---

## Gemini API Integration
- File: `src/api/geminiAudit.js`
- Model: `gemini-2.5-flash`
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- API key passed as query param: `?key=${import.meta.env.VITE_GEMINI_API_KEY}`
- The prompt receives the full `auditResults` JSON
- Parse response from: `data.candidates[0].content.parts[0].text`
- If API call fails, dashboard still renders with calculation results — graceful degradation, never a blank screen
- Tone instruction in prompt: *"Direct, practical, Nigerian context-aware. No jargon. Speak like a trusted advisor."*
- Target length: under 400 words

```js
// geminiAudit.js — reference implementation
export async function generateAuditReport(auditResults) {
  const prompt = buildPrompt(auditResults)
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    }
  )
  const data = await response.json()
  return data.candidates[0].content.parts[0].text
}
```

---

## UI/Design Rules
- Dark theme only — background `#0a0f0d`, accent `#00ff88` (electric green)
- No Tailwind — use CSS variables defined in `index.css`
- Energy score meter: SVG circular ring (same pattern as progress ring in study timers)
- Dashboard renders **immediately** from calculation results — Gemini report loads in after
- User never stares at a loading screen — show skeleton/placeholder for AI report section while fetching
- Mobile responsive — SME owners use phones, not laptops

---

## Data Approach
- All energy data is **simulated/calculated** — no real-time NERC/TCN API
- Label clearly in UI: *"Estimates based on standard appliance ratings and Nigerian grid averages"*
- Appliance database covers ~30 common Nigerian SME appliances
- This is a demonstration prototype — judges understand this

---

## Code Style
- Use ES modules (`import/export`), not CommonJS
- Destructure imports where possible
- Functional React components only — no class components
- Keep components focused — if a component exceeds ~150 lines, split it
- No unnecessary abstractions — this is a 4-day build, keep it readable

---

## What NOT to Do
- Do not add a backend — everything runs client-side
- Do not use localStorage (not supported in this environment)
- Do not use Tailwind — custom CSS only
- Do not over-engineer — ship working > perfect
- Do not leave placeholder lorem ipsum in demo — use realistic Nigerian SME data

---

## Demo Data (for testing)
Use this sample profile to test the full flow:
```json
{
  "businessType": "restaurant",
  "location": "Ibadan, Oyo State",
  "size": "small",
  "operatingHours": 12,
  "generator": { "capacityKVA": 10, "hoursPerDay": 10, "fuelType": "diesel" },
  "appliances": [
    { "id": "chest_freezer", "quantity": 2, "hoursPerDay": 24 },
    { "id": "ac_1.5hp", "quantity": 1, "hoursPerDay": 10 },
    { "id": "industrial_cooker", "quantity": 2, "hoursPerDay": 8 },
    { "id": "led_bulb", "quantity": 6, "hoursPerDay": 12 },
    { "id": "water_dispenser", "quantity": 1, "hoursPerDay": 10 },
    { "id": "tv_32inch", "quantity": 1, "hoursPerDay": 12 }
  ],
  "gridHoursPerDay": 2,
  "monthlyFuelSpend": 180000
}
```
Expected output: Energy Score ~38/100, ~₦2.16M annual spend, ~3.47 tonnes CO₂/year

---

## Build Priority Order
1. `applianceDatabase.js` + `calculationEngine.js` — test in isolation first
2. `AuditContext.jsx` — global state
3. Multi-step form (Steps 1→2→3)
4. Dashboard UI (score meter + charts + cards)
5. Gemini API integration + report rendering
6. PDF export
7. Landing page
8. Polish + mobile responsiveness

---

## Environment Variables
```
VITE_GEMINI_API_KEY=your_gemini_key_here
```
Get your free API key at **aistudio.google.com** — no billing required for Gemini Flash.
Never commit `.env` to git. Add to `.gitignore`.

---

## Deployment Checklist
- [ ] `npm run build` passes without errors
- [ ] `VITE_GEMINI_API_KEY` set in Vercel environment variables
- [ ] Demo flow tested end-to-end with sample data above
- [ ] Mobile view checked on 375px width
- [ ] AI report graceful degradation tested (disable API key, confirm dashboard still works)
- [ ] PDF export tested and downloads correctly
- [ ] "Estimates based on standard appliance ratings" disclaimer visible on dashboard
