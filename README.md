# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.










###  august,25,2026


Viewed supabase-schema.sql:1-173

No problem! Setting up a new Supabase project from scratch is straightforward. Here are the step-by-step instructions to get your app connected to a brand new Supabase instance:

### Step 1: Create a New Supabase Project
1. Go to [supabase.com](https://supabase.com) and log in.
2. Click **New Project** and select your organization.
3. Give your project a name (e.g., "EcoAudit NG"), generate a strong database password, and choose a region close to your users.
4. Click **Create new project**. It will take a few minutes for the database to provision.

### Step 2: Get Your New API Credentials
1. Once your project is ready, click on the **Project Settings** (the gear icon at the bottom of the left sidebar).
2. Go to **API** under the Configuration section.
3. You will see your **Project URL** and your **anon** `public` key.

### Step 3: Update Your Environment Variables
Open your `.env` file (which I fixed earlier) and replace the old values with your new ones:
```env
VITE_SUPABASE_URL=your_new_project_url_here
VITE_SUPABASE_ANON_KEY=your_new_anon_key_here
```
*(Make sure not to leave any spaces before the `VITE_...` text!)*

### Step 4: Recreate Your Database Schema
Your codebase already has a file called [`supabase-schema.sql`](file:///c:/Users/IFEOLUWA%20ABDULSAMAD/Documents/EcoAudit%20NG/supabase-schema.sql) which contains all your tables, policies, and auth triggers. Let's run it on the new project:
1. In your Supabase dashboard, click on the **SQL Editor** (the `</>` icon on the left sidebar).
2. Click **New query**.
3. Copy all the contents of your `supabase-schema.sql` file and paste them into the SQL Editor.
4. Click the **Run** button (or press `Cmd/Ctrl + Enter`). This will create your `profiles`, `audits`, and `team_members` tables along with all the necessary security rules.

### Step 5: Configure Authentication
1. Go to **Authentication** -> **Providers** in the left sidebar.
2. **Email sign-in** is enabled by default. If you want to disable email confirmation for now (so you don't have to verify emails during testing), go to **Authentication** -> **Providers** -> **Email** and toggle off "Confirm email".
3. **Google sign-in**: Click on Google, toggle it to **Enabled**, and enter your Google OAuth **Client ID** and **Client Secret** (you can set this up later if you just want to test email login for now).

Once you've done this, restart your Vite development server (`npm run dev`) so it picks up the new `.env` variables, and try signing up with an email! Let me know if you run into any issues during the setup.