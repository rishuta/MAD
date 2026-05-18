# Simple Blog App

This is a very simple college mini-project blog app built with:

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- Clerk Authentication
- Supabase Database
- Vercel Deployment

## Step 1: Project Setup

What we built:
- A new Next.js project structure.
- Basic folders: `src/app`, `src/components`, and `src/lib`.
- Config files for TypeScript, Tailwind CSS, ESLint, and Next.js.

Why it is needed:
- Next.js gives us pages, routing, and backend features in one project.
- TypeScript helps catch mistakes early.
- Tailwind CSS helps us build a modern design quickly.

Terminal command:

```bash
npm.cmd install
```

Possible error:
- If PowerShell blocks `npm`, use `npm.cmd` instead of `npm`.

## Step 2: Clerk Setup

What we built:
- `ClerkProvider` in `src/app/layout.tsx`.
- Login page at `/sign-in`.
- Signup page at `/sign-up`.
- Navbar login/signup buttons.
- Middleware that protects future `/create` and `/edit` pages.

Why it is needed:
- Only logged-in users should create, edit, and delete blog posts.

Files:
- `src/app/layout.tsx`
- `src/app/sign-in/[[...sign-in]]/page.tsx`
- `src/app/sign-up/[[...sign-up]]/page.tsx`
- `middleware.ts`
- `src/components/Navbar.tsx`

Environment variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

Possible errors:
- If Clerk says keys are missing, create `.env.local` and add the keys.
- Restart the dev server after changing `.env.local`.

## Step 3: Supabase Setup

What we built:
- A Supabase client helper.
- A simple SQL schema for `users` and `posts`.
- A storage bucket called `blog-images`.

Why it is needed:
- Supabase stores blog data and uploaded cover image URLs.

Files:
- `src/lib/supabase.ts`
- `supabase/schema.sql`

Environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SUPABASE_BUCKET=blog-images
```

In Supabase:
1. Open your Supabase project.
2. Go to SQL Editor.
3. Paste the code from `supabase/schema.sql`.
4. Run it.

## Step 4: Homepage UI

What we built:
- Modern navbar.
- Hero section.
- Feature cards.
- Sample blog cards.
- Responsive layout for mobile and desktop.

Why it is needed:
- The homepage is the first screen users see during your project demo.

Files:
- `src/app/page.tsx`
- `src/components/Navbar.tsx`
- `src/components/BlogCard.tsx`
- `src/app/globals.css`

## Run The Project

Create `.env.local`:

```bash
copy .env.example .env.local
```

Then add your real Clerk and Supabase keys.

Start the app:

```bash
npm.cmd run dev
```

Open:

```txt
http://localhost:3000
```

## Check The Project

```bash
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

## Next Step

## Step 5: Create Blog Page

What we built:
- A protected page at `/create`.
- A title input.
- A content textarea.
- A submit button.
- A server action that saves the post into Supabase.
- The post uses Clerk's `user.id` as `posts.user_id`.

Why it is needed:
- This is the first real blog feature.
- A blog app must allow logged-in users to create posts.
- Using a server action keeps the Supabase service key safely on the server.

Files:
- `src/app/create/page.tsx`
- `src/app/create/actions.ts`
- `src/lib/supabaseAdmin.ts`
- `middleware.ts`
- `supabase/schema.sql`

How it works:
1. User visits `/create`.
2. Clerk middleware checks if the user is logged in.
3. User fills title and content.
4. The form calls the `createPost` server action.
5. The server action reads the Clerk user.
6. The server action saves the post to Supabase.
7. User is redirected to the homepage.

Possible errors:
- `Missing Supabase server environment variables`: add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`.
- `You must be logged in`: sign in before opening `/create`.
- Supabase insert error: make sure you ran the latest `supabase/schema.sql`.

Test:

```bash
npm.cmd run dev
```

Then:
1. Open `http://localhost:3000`.
2. Sign up or log in.
3. Open `http://localhost:3000/create`.
4. Add a title and content.
5. Submit the form.
6. Check the `posts` table in Supabase.

## Upcoming Steps

## Step 6: Display Posts On Homepage

What we built:
- The homepage now fetches blog posts from Supabase.
- Static demo blog cards were removed.
- Posts are shown newest first.
- Each card displays title, content preview, and created date.
- If there are no posts, the homepage shows a simple empty message.

Why it is needed:
- A blog app should show real posts from the database, not hardcoded demo data.
- Fetching in the homepage Server Component is a good App Router practice because the data loads on the server.

Files:
- `src/lib/posts.ts`
- `src/app/page.tsx`
- `src/components/BlogCard.tsx`

How it works:
1. `src/lib/posts.ts` has a `getPosts` function.
2. `getPosts` reads rows from the Supabase `posts` table.
3. `.order("created_at", { ascending: false })` shows newest posts first.
4. `src/app/page.tsx` calls `await getPosts()`.
5. The homepage sends each post into `BlogCard`.
6. `BlogCard` creates a short content preview and formats the date.

Possible errors:
- `Missing Supabase environment variables`: check `.env.local`.
- Empty homepage list: create a post at `/create`.
- Supabase table error: make sure `supabase/schema.sql` was run.

Test:

```bash
npm.cmd run dev
```

Then:
1. Open `http://localhost:3000/create`.
2. Create a post.
3. Go back to `http://localhost:3000`.
4. Your newest post should appear first.

The next steps are:

1. Single blog page
2. Edit blog post
3. Delete blog post
