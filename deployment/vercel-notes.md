# Vercel Deployment Notes

## Build Settings

- Framework preset: `Next.js`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: leave as Vercel default

## Runtime Notes

- The app uses the Next.js App Router and Server Actions.
- `/api/ai-assistant` runs on the Node.js runtime and keeps `GEMINI_API_KEY` server-side.
- Supabase service-role access is isolated in `src/server/db/supabaseAdmin.ts`.
- Client components live under `src/client`.
- Server queries/actions live under `src/server`.
- Shared type contracts live under `src/shared`.

## Deployment Checklist

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Add all required environment variables from `deployment/env-example.md`.
4. Run `supabase/schema.sql` or `deployment/supabase-schema.sql` in Supabase SQL Editor.
5. Deploy.
6. Test:
   - Sign up / login
   - Create post
   - Edit post
   - Delete post
   - Comments
   - Dashboard analytics
   - Search
   - Writing Assistant

## Security Notes

- Never commit `.env.local`, `.env`, `.vercel`, or `.clerk`.
- `SUPABASE_SERVICE_ROLE_KEY`, `CLERK_SECRET_KEY`, and `GEMINI_API_KEY` must be configured only in Vercel Environment Variables.
- Only `NEXT_PUBLIC_*` values are intended for browser exposure.
