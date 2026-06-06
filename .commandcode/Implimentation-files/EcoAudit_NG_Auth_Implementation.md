# EcoAudit NG — Supabase Auth & Freemium Implementation Guide

> Stack: React 19 + Vite + Supabase + Paystack  
> Author: LUIPHYX | Updated: 2026

---

## Overview

This guide covers the full implementation of:
1. Supabase Auth (Email + Google OAuth)
2. Audit history persistence per user
3. Freemium gating mechanism
4. User dashboard for saved reports
5. Paystack payment integration

---

## Pricing Tiers

| Plan | Price | Features |
|---|---|---|
| Free | ₦0 | 1 audit, basic results, energy score, recommendations, solar matches |
| Pro | ₦3,000/month | Everything in Free + unlimited audits (up to 5 saved), AI report, PDF export, audit history |
| Business | ₦8,000/month | Everything in Pro + unlimited saved audits, compare audits, multiple locations/branches, team access (3 users), monthly energy report email, white label PDF |

### One-Time Option
**Single AI Report: ₦1,500** — for users who want one report without subscribing. Lowers barrier to first payment.

---

## Infrastructure Cost Breakdown

### Supabase Free Tier

| Resource | Free Limit | Expected Usage |
|---|---|---|
| Database size | 500MB | ~5-10KB per audit — need 50,000+ audits to hit limit |
| Auth users | 50,000 | More than enough for early stage |
| API requests | 500,000/month | Comfortable until thousands of active users |
| Storage | 1GB | Not relevant for EcoAudit NG |

> Supabase free tier carries you to thousands of users. No upgrade needed until serious scale.

### Gemini API Cost (AI Report)

- Gemini 2.5 Flash: ~$0.00015 per 1,000 tokens
- Each audit report prompt: ~2,000–3,000 tokens
- **Cost per AI report: ~$0.0005 (less than ₦1)**
- 1,000 AI reports generated in a month: ~$0.50 total = **~₦750**

> AI report feature costs almost nothing to run. Gate it for revenue, not to save costs.

### Vercel Hosting

- Free tier: unlimited for frontend SPAs
- EcoAudit NG is a React SPA — stays free permanently

### Paystack Transaction Fees

- 1.5% per transaction + ₦100 flat fee
- On ₦3,000 Pro plan: Paystack takes ~₦145 → **you keep ₦2,855**
- On ₦8,000 Business plan: Paystack takes ~₦220 → **you keep ₦7,780**

### Monthly Revenue Projection

| Stage | Pro Users | Business Users | Revenue | Costs | Profit |
|---|---|---|---|---|---|
| Early | 10 | 0 | ₦30,000 | ~₦2,000 | ₦28,000 |
| Growing | 50 | 5 | ₦190,000 | ~₦5,000 | ₦185,000 |
| Scale | 200 | 20 | ₦760,000 | ~₦15,000 | ₦745,000 |

---

## Supabase Project Settings

When setting up your Supabase project, use these settings:

| Setting | Value | Reason |
|---|---|---|
| Enable Data API | ✅ ON | Allows React app to read/write via supabase-js |
| Automatically expose new tables | ❌ OFF | Prevents accidental public exposure of tables |
| Enable automatic RLS | ✅ ON | Ensures users only see their own data |

---

## 1. Supabase Auth (Email + Google OAuth)

### Install Supabase JS Client

```bash
npm install @supabase/supabase-js
```

### Create Supabase Client

```js
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Environment Variables

Add to your `.env` file:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_key
```

### Enable Google OAuth in Supabase Dashboard

1. Go to **Authentication → Providers → Google**
2. Enable Google provider
3. Add your Google OAuth client ID and secret
4. Add redirect URL: `https://ecoauditng.vercel.app/auth/callback`

### Auth Context

```jsx
// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({ provider: 'google' })

  const signInWithEmail = (email, password) =>
    supabase.auth.signInWithPassword({ email, password })

  const signUpWithEmail = (email, password) =>
    supabase.auth.signUp({ email, password })

  const signOut = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

### Wrap App with AuthProvider

```jsx
// src/App.jsx
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <AuditProvider>
        {/* your existing router */}
      </AuditProvider>
    </AuthProvider>
  )
}
```

---

## 2. Database Schema

Run this SQL in your Supabase SQL editor:

```sql
-- User profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  plan TEXT DEFAULT 'free', -- 'free', 'pro', or 'business'
  audit_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Audits table
CREATE TABLE audits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  business_name TEXT,
  location TEXT,
  energy_score INTEGER,
  audit_data JSONB,
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table (Business plan)
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  member_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Users can only read/write their own audits
CREATE POLICY "Users can view own audits"
  ON audits FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own audits"
  ON audits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own audits"
  ON audits FOR DELETE USING (auth.uid() = user_id);
```

---

## 3. Saving Audit Data

```jsx
// src/api/saveAudit.js
import { supabase } from '../lib/supabase'

export const saveAudit = async (user, auditData, results) => {
  const { data, error } = await supabase
    .from('audits')
    .insert({
      user_id: user.id,
      business_name: auditData.businessName,
      energy_score: results.energyScore,
      audit_data: auditData,
      results: results,
    })

  if (error) throw error
  return data
}

export const getUserAudits = async (userId) => {
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const deleteAudit = async (auditId) => {
  const { error } = await supabase
    .from('audits')
    .delete()
    .eq('id', auditId)

  if (error) throw error
}
```

---

## 4. Freemium Gating

### Feature Access Table

| Feature | Free | Pro ₦3,000/mo | Business ₦8,000/mo |
|---|---|---|---|
| Run audit | ✅ | ✅ | ✅ |
| Energy score | ✅ | ✅ | ✅ |
| Basic recommendations | ✅ | ✅ | ✅ |
| Solar merchant matches | ✅ | ✅ | ✅ |
| AI-generated report | ❌ | ✅ | ✅ |
| PDF export | ❌ | ✅ | ✅ |
| Save audit history | ❌ | ✅ (5 audits) | ✅ Unlimited |
| Compare audits | ❌ | ❌ | ✅ |
| Multiple locations/branches | ❌ | ❌ | ✅ |
| Team members access | ❌ | ❌ | ✅ (3 users) |
| Monthly energy report email | ❌ | ❌ | ✅ |
| White label PDF report | ❌ | ❌ | ✅ |
| One-time AI report | ₦1,500 | — | — |

### Gate Hook

```jsx
// src/hooks/useFeatureGate.js
import { useAuth } from '../context/AuthContext'

export const useFeatureGate = () => {
  const { user } = useAuth()

  const plan = user?.user_metadata?.plan ?? 'free'
  const isPro = plan === 'pro' || plan === 'business'
  const isBusiness = plan === 'business'

  const canAccess = (feature) => {
    const freeFeatures = ['run_audit', 'energy_score', 'recommendations', 'solar_matches']
    const proFeatures = ['ai_report', 'pdf_export', 'save_audit', 'audit_history']
    const businessFeatures = ['compare_audits', 'multiple_locations', 'team_access', 'monthly_report', 'white_label_pdf']

    if (freeFeatures.includes(feature)) return true
    if (proFeatures.includes(feature)) return isPro
    if (businessFeatures.includes(feature)) return isBusiness
    return false
  }

  const canSaveAudit = (currentAuditCount) => {
    if (isBusiness) return true
    if (isPro) return currentAuditCount < 5
    return currentAuditCount < 1
  }

  return { plan, isPro, isBusiness, canAccess, canSaveAudit }
}
```

### Usage in Component

```jsx
// Example: gating AI Report
import { useFeatureGate } from '../hooks/useFeatureGate'

const AIReport = () => {
  const { canAccess } = useFeatureGate()

  if (!canAccess('ai_report')) {
    return (
      <div className="upgrade-prompt">
        <h3>AI Report is a Pro feature</h3>
        <p>Upgrade to get your full AI-generated energy audit report</p>
        <button onClick={() => setShowUpgradeModal(true)}>
          Upgrade to Pro
        </button>
      </div>
    )
  }

  return <AIReportContent />
}
```

---

## 5. User Dashboard for Saved Reports

```jsx
// src/pages/MyAudits.jsx
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUserAudits, deleteAudit } from '../api/saveAudit'

const MyAudits = () => {
  const { user } = useAuth()
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      getUserAudits(user.id)
        .then(setAudits)
        .finally(() => setLoading(false))
    }
  }, [user])

  const handleDelete = async (id) => {
    await deleteAudit(id)
    setAudits(audits.filter(a => a.id !== id))
  }

  if (loading) return <p>Loading your audits...</p>

  return (
    <div className="my-audits">
      <h2>My Audits</h2>
      {audits.length === 0 ? (
        <p>No saved audits yet. Run your first audit!</p>
      ) : (
        audits.map(audit => (
          <div key={audit.id} className="audit-card">
            <span>{audit.business_name}</span>
            <span>Score: {audit.energy_score}</span>
            <span>{new Date(audit.created_at).toLocaleDateString()}</span>
            <button onClick={() => loadAudit(audit)}>View</button>
            <button onClick={() => handleDelete(audit.id)}>Delete</button>
          </div>
        ))
      )}
      <button>+ New Audit</button>
    </div>
  )
}
```

---

## 6. Paystack Integration (Nigerian Payments)

> Use Paystack instead of Stripe — works with Nigerian cards, bank transfer, and USSD.

```bash
npm install @paystack/inline-js
```

```jsx
// src/api/payment.js

const PLANS = {
  pro: 300000,        // ₦3,000 in kobo
  business: 800000,   // ₦8,000 in kobo
  one_time: 150000,   // ₦1,500 in kobo (single AI report)
}

export const initializePayment = (user, planType, onSuccess) => {
  const handler = PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email: user.email,
    amount: PLANS[planType],
    currency: 'NGN',
    ref: `ecoaudit_${planType}_${Date.now()}`,
    onClose: () => console.log('Payment closed'),
    callback: async (response) => {
      // Verify payment on backend, then update user plan
      if (planType !== 'one_time') {
        await updateUserPlan(user.id, planType)
      } else {
        await unlockOneTimeReport(user.id)
      }
      onSuccess()
    }
  })
  handler.openIframe()
}
```

---

## Full User Flow (End to End)

```
Landing page
  → "Start Free Audit" (no auth required)
  → Complete 3-step audit wizard
  → View results dashboard
  → Click "Save This Report"
  → Auth modal appears (Email or Google)
  → User signs up / logs in
  → Audit saved automatically to database
  → Redirected to personal dashboard (My Audits)
  → Click "Generate AI Report"
      → Free user → upgrade prompt (Pro ₦3,000/mo or One-time ₦1,500)
      → Pro user → report generated instantly
  → Click "Compare Audits" or "Add Branch"
      → Pro user → upgrade prompt (Business ₦8,000/mo)
      → Business user → feature unlocked
```

---

## Implementation Order

| Week | Task |
|---|---|
| Week 1 | Supabase setup, Auth context, Login/Signup modal, Google OAuth |
| Week 2 | Audits table, Save audit after Step 3, My Audits dashboard page |
| Week 3 | Freemium gate logic, Upgrade modal, Paystack integration |
| Week 4 | Test full flow, Deploy, Get first paying users |

---

## Environment Variables (Full List)

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GEMINI_API_KEY=
VITE_PAYSTACK_PUBLIC_KEY=
```

---

*EcoAudit NG — Built by LUIPHYX · 2026*
