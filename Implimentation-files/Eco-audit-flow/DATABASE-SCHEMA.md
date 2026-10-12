# EcoAudit NG — Database Schema (Supabase/Postgres)

> **Status:** Implemented  
> **File:** `supabase-schema.sql` (runnable in Supabase SQL Editor)  
> **RLS:** Row-Level Security enabled on all tables

---

## Entity Relationship Diagram

```
┌───────────────┐       ┌─────────────────┐
│   auth.users   │       │   audits         │
│  (Supabase)    │──1:N──│                  │
│  id (UUID) PK  │       │  id (UUID) PK     │
│  email         │       │  user_id (FK)     │
│  created_at    │       │  business_name    │
└───────┬───────┘       │  location          │
        │               │  energy_score      │
        │ 1:1           │  audit_data (JSONB) │
        ▼               │  results (JSONB)   │
┌───────────────┐       │  created_at        │
│   profiles    │       └─────────────────┘
│               │
│  id (UUID) PK │       ┌─────────────────┐
│  email        │       │  team_members    │
│  full_name    │──1:N──│                  │
│  plan         │       │  id (UUID) PK    │
│  audit_count  │       │  owner_id (FK)   │
│  created_at   │       │  member_id (FK)  │
│  updated_at   │       │  created_at      │
└───────────────┘       │  UNIQUE(owner_id, │
                        │   member_id)     │
                        └─────────────────┘
```

---

## Table Definitions

### 1. `profiles` — User Profiles (extends `auth.users`)

| Column | Type | Default | Constraints | Description |
|---|---|---|---|---|
| `id` | `UUID` | — | PK, FK → `auth.users(id) ON DELETE CASCADE` | Matches Supabase auth user ID |
| `email` | `TEXT` | — | — | User email from auth |
| `full_name` | `TEXT` | — | — | From `raw_user_meta_data->>'full_name'` |
| `plan` | `TEXT` | `'free'` | — | `'free'`, `'pro'`, or `'business'` |
| `audit_count` | `INTEGER` | `0` | — | Incremented via `increment_audit_count()` |
| `created_at` | `TIMESTAMPTZ` | `NOW()` | — | Row creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | `NOW()` | — | Updated on profile changes |

**RLS Policies:**
- `SELECT`: Users can view own profile (auth.uid() = id)
- `UPDATE`: Users can update own profile
- `INSERT`: Authenticated users can insert own profile (for trigger)

**Auto-creation:** Trigger `on_auth_user_created` fires `handle_new_user()` on `auth.users` INSERT.

### 2. `audits` — Energy Audit Records

| Column | Type | Default | Constraints | Description |
|---|---|---|---|---|
| `id` | `UUID` | `gen_random_uuid()` | PK | Unique audit identifier |
| `user_id` | `UUID` | — | FK → `profiles(id) ON DELETE CASCADE` | Who owns this audit |
| `business_name` | `TEXT` | — | — | From auditData.businessType (mapped field name) |
| `location` | `TEXT` | — | — | Business location |
| `energy_score` | `INTEGER` | — | — | 0–100 score |
| `audit_data` | `JSONB` | — | — | Complete input form data |
| `results` | `JSONB` | — | — | Complete calculation output |
| `created_at` | `TIMESTAMPTZ` | `NOW()` | — | When audit was saved |

**RLS Policies:**
- `SELECT`: Users can view own audits (auth.uid() = user_id)
- `INSERT`: Users can insert own audits (auth.uid() = user_id)
- `DELETE`: Users can delete own audits
- `UPDATE`: Users can update own audits

**Realtime:** Enabled via `ALTER PUBLICATION supabase_realtime ADD TABLE audits;`

### 3. `team_members` — Business Plan Team Access

| Column | Type | Default | Constraints | Description |
|---|---|---|---|---|
| `id` | `UUID` | `gen_random_uuid()` | PK | Unique row identifier |
| `owner_id` | `UUID` | — | FK → `profiles(id) ON DELETE CASCADE` | Business plan subscriber |
| `member_id` | `UUID` | — | FK → `profiles(id) ON DELETE CASCADE` | Invited team member |
| `created_at` | `TIMESTAMPTZ` | `NOW()` | — | When member was added |
| | | | `UNIQUE(owner_id, member_id)` | Prevents duplicates |

**RLS Policies:**
- `SELECT`: Owners can view their team (auth.uid() = owner_id)
- `SELECT`: Members can view their teams (auth.uid() = member_id)
- `INSERT`: Owners can add team members
- `DELETE`: Owners can remove team members

---

## Functions & Triggers

### `increment_audit_count(user_id UUID)`

```sql
CREATE OR REPLACE FUNCTION increment_audit_count(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET audit_count = audit_count + 1,
      updated_at = NOW()
  WHERE id = user_id;
END;
$$;
```

**Called from:** `src/api/auditApi.js` — `incrementAuditCount(userId)` via `supabase.rpc('increment_audit_count', { user_id })`

### `handle_new_user()` (Trigger Function)

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Data Access Layer (Client-side)

### `src/api/auditApi.js`

| Function | SQL Equivalent | Description |
|---|---|---|
| `saveAudit(user, data, results)` | `INSERT INTO audits (...)` | Save audit with user_id, business_name, location, energy_score, audit_data, results |
| `getUserAudits(userId)` | `SELECT * FROM audits WHERE user_id = $1 ORDER BY created_at DESC` | Load all user audits |
| `deleteAudit(auditId)` | `DELETE FROM audits WHERE id = $1` | Delete a single audit |
| `getUserProfile(userId)` | `SELECT * FROM profiles WHERE id = $1` | Get user profile with plan info |
| `updateUserPlan(userId, planType)` | `UPDATE profiles SET plan = $1 WHERE id = $2` | Upgrade user plan after payment |
| `incrementAuditCount(userId)` | `SELECT increment_audit_count($1)` | RPC call to increment counter |

---

## Schema Migration Notes

### What's Already Applied (in `supabase-schema.sql`)
- ✅ 3 tables: `profiles`, `audits`, `team_members`
- ✅ RLS on all tables
- ✅ 9 RLS policies for auth
- ✅ `increment_audit_count()` function
- ✅ `handle_new_user()` trigger + `on_auth_user_created` trigger
- ✅ Realtime publication for `audits`

### Not Yet in Schema (Code-ready, Schema-not)
- ⬜ `last_ai_report_at TIMESTAMPTZ` on profiles — for one-time report tracking
- ⬜ `payment_customer_id TEXT` on profiles — Paystack customer reference
- ⬜ `subscription_expires_at TIMESTAMPTZ` on profiles — subscription expiry handling
- ⬜ `locations JSONB` on profiles — Business plan multi-location storage
- ⬜ `branches` table for multi-location audit grouping
