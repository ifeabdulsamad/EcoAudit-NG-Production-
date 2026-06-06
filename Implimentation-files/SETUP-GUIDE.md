# EcoAudit NG - Setup Guide

## Prerequisites
- Node.js installed
- npm or yarn
- Supabase account (free tier works fine)
- Paystack account (for payments)
- Google Cloud account (for OAuth - optional)

---

## Step 1: Install Dependencies

```bash
npm install @supabase/supabase-js @paystack/inline-js
```

---

## Step 2: Set Up Supabase

### 2.1 Create Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Name it "ecoaudit-ng"
4. Choose region closest to your users (for Nigeria, use EU West)
5. Wait for project to be created (~2 minutes)

### 2.2 Get API Keys
1. In your project dashboard, go to **Project Settings** → **API**
2. Copy:
   - `URL` → this is your `VITE_SUPABASE_URL`
   - `anon public` → this is your `VITE_SUPABASE_ANON_KEY`

### 2.3 Run Database Schema
1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire contents of `supabase-schema.sql`
4. Paste and click **Run**
5. Verify no errors (you should see "Success" at the bottom)

### 2.4 Configure Auth Providers (Optional - for Google OAuth)
1. Go to **Authentication** → **Providers**
2. Find **Google** and enable it
3. Add your Google OAuth credentials:
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 credentials
   - Add redirect URL: `https://your-domain.com/auth/callback`
   - For local dev: `http://localhost:5173/auth/callback`

---

## Step 3: Set Up Paystack

### 3.1 Create Account
1. Go to [paystack.com](https://paystack.com) and sign up
2. Complete your business verification
3. Switch to **Test Mode** for development

### 3.2 Get API Keys
1. Go to **Settings** → **API Keys**
2. Copy your **Public Key** (starts with `pk_test_` or `pk_live_`)
3. This is your `VITE_PAYSTACK_PUBLIC_KEY`

---

## Step 4: Set Up Environment Variables

Create a `.env` file in your project root:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Gemini API (for AI reports - optional for now)
VITE_GEMINI_API_KEY=your-gemini-key-here

# Paystack (for payments)
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your-key-here
```

**⚠️ NEVER commit this file to git!**

---

## Step 5: Start Development Server

```bash
npm run dev
```

Your app should now be running at `http://localhost:5173`

---

## Step 6: Test the Flow

### Test 1: Basic Audit (No Auth)
1. Open app in incognito/private window
2. Complete an audit
3. View dashboard
4. Try to save audit → should prompt sign-in

### Test 2: Sign Up
1. Click "Sign In" in navbar
2. Click "Sign Up" tab
3. Enter email and password
4. Check email for confirmation link
5. Confirm and sign in

### Test 3: Save Audit (Free Plan)
1. Complete another audit
2. Click "Save Audit" on dashboard
3. Check Supabase → SQL Editor → run:
   ```sql
   SELECT * FROM audits;
   SELECT * FROM profiles;
   ```
4. Go to "My Audits" page → should show saved audit

### Test 4: Feature Gating
1. As free user, try to export PDF → should show lock icon
2. Click locked features → UpgradeModal should open
3. (Optional) Test Paystack in test mode

### Test 5: Upgrade Flow
1. Click upgrade on any locked feature
2. Select Pro or Business plan
3. Use Paystack test card: `4084084084084081`
4. Enter any future expiry date and CVV
5. Payment should succeed

---

## Troubleshooting

### Issue: "Failed to save audit"
- Check browser console for errors
- Verify Supabase URL and key in `.env`
- Check RLS policies are enabled in Supabase

### Issue: "Paystack not defined"
- Make sure Paystack script is in `index.html`
- Check browser network tab for script loading

### Issue: Auth not persisting
- Check browser cookies are enabled
- Verify Supabase auth settings in dashboard

### Issue: Can't see saved audits
- Run this in Supabase SQL Editor:
  ```sql
  SELECT * FROM audits;
  ```
- Check user_id matches the logged-in user

---

## Next Steps

1. **Deploy to Vercel**
   ```bash
   npm run build
   # Drag dist folder to Vercel or use CLI
   ```

2. **Add Environment Variables to Vercel**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env`

3. **Update Paystack Redirect URLs**
   - In Paystack dashboard, add your production domain
   - Update Supabase redirect URLs if using Google OAuth

4. **Switch to Live Mode**
   - Paystack: Switch from test to live keys
   - Update `VITE_PAYSTACK_PUBLIC_KEY` in production

---

## Security Checklist

- [ ] RLS policies enabled on all tables
- [ ] Environment variables not committed to git
- [ ] Using test keys for development
- [ ] Production keys only on Vercel
- [ ] Google OAuth redirect URLs configured
- [ ] Paystack webhook URLs set (for production)

---

Need help? Check the Supabase docs or Paystack docs for detailed API references.