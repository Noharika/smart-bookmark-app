# Smart Bookmark App

Next.js (App Router) + Supabase (Auth, DB, Realtime) + Tailwind CSS.  
Private per-user bookmarks, realtime updates, deployed on Vercel.

## Features
- Google OAuth (no email/password)
- Add bookmark (URL + title)
- Private per-user data (RLS enforced)
- Realtime updates across tabs
- Delete bookmarks

## Tech
- Next.js 14 (App Router)
- Supabase (Auth, Postgres, Realtime)
- Tailwind CSS
- Deployed to Vercel

## Local Dev (GitHub Codespaces)
1. Create Codespace on this repo.
2. Set `.env.local`:

# In a fresh Codespace
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir false --import-alias "@/*"
npm install @supabase/supabase-js

# (create .env.local with Supabase URL and anon key)

# Replace/add files as shown above

npm run dev -- -p 3008
# Open Port 3000 link
