# Environment Variables

Add these in Vercel Project Settings -> Environment Variables.

```env
# Clerk authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_or_test_replace_this
CLERK_SECRET_KEY=sk_live_or_test_replace_this

# Supabase database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=replace_this
SUPABASE_SERVICE_ROLE_KEY=replace_this

# Google Gemini Writing Assistant
GEMINI_API_KEY=replace_this
```

## Public Variables

These are safe to expose to the browser:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Server-Only Variables

These must stay private:

- `CLERK_SECRET_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
