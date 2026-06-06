# Google OAuth Setup Guide

The error "Unsupported provider: provider is not enabled" means Google OAuth isn't configured in your Supabase project. You have two options:

---

## Option 1: Use Email Sign-In Only (Quickest)

If you don't need Google sign-in, the auth will work with just email. The updated AuthModal now shows a helpful error message if Google isn't configured.

---

## Option 2: Enable Google OAuth (Recommended)

### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure the consent screen first (if prompted):
   - User Type: External
   - App name: EcoAudit NG
   - User support email: your email
   - Developer contact: your email
   - Save and Continue
6. Back to Create OAuth client ID:
   - Application type: Web application
   - Name: EcoAudit NG Web
   - Authorized JavaScript origins:
     - `http://localhost:5173` (for local dev)
     - `https://your-production-domain.com` (for production)
   - Authorized redirect URIs:
     - `http://localhost:5173/auth/callback`
     - `https://your-production-domain.com/auth/callback`
7. Click **Create**
8. Copy the **Client ID** and **Client Secret**

### Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** → **Providers** (left sidebar)
4. Find **Google** and click it
5. Toggle **Enabled** to ON
6. Paste your **Client ID** and **Client Secret**
7. Click **Save**

### Step 3: Test

1. Restart your dev server: `npm run dev`
2. Open the auth modal and click "Continue with Google"
3. Should now work!

---

## Troubleshooting

### "Authorized redirect URI mismatch"
- Make sure the redirect URI in Google Cloud matches exactly what's in Supabase
- Must include the full path: `/auth/callback`

### "This app isn't verified"
- Google shows this warning for unverified apps
- Click "Advanced" → "Go to EcoAudit NG (unsafe)"
- Or submit your app for verification (takes a few days)

### Users not redirected back properly
- Check that your redirect URIs are correct in both Google Cloud and Supabase
- Make sure your app handles the callback route

---

## Optional: Create Auth Callback Route

If you want to handle the OAuth callback properly, create this file:

```jsx
// src/pages/AuthCallback.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate('/')
      }
    })
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-zinc-400">Completing sign in...</p>
    </div>
  )
}
```

Add to your router in `App.jsx`:
```jsx
<Route path="/auth/callback" element={<AuthCallback />} />
```

---

For now, email sign-in works perfectly without any Google setup!