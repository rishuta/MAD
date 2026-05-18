create extension if not exists "pgcrypto";

create table public.users (
  id uuid primary key default gen_random_uuid(),
  clerk_id text not null unique,
  email text not null unique,
  name text,
  created_at timestamptz not null default now()
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  image_url text,
  category text,
  tags text[] not null default '{}',
  views integer not null default 0,
  likes integer not null default 0,
  user_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.posts
add column if not exists category text;

alter table public.posts
add column if not exists tags text[] not null default '{}';

alter table public.posts
add column if not exists updated_at timestamptz not null default now();

alter table public.posts
add column if not exists views integer not null default 0;

alter table public.posts
add column if not exists likes integer not null default 0;

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id text not null,
  author_name text not null,
  author_email text,
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_post_id_created_at_idx
on public.comments (post_id, created_at desc);

create index if not exists posts_search_idx
on public.posts using gin (
  to_tsvector('english', coalesce(title, '') || ' ' || coalesce(content, '') || ' ' || coalesce(category, '') || ' ' || array_to_string(tags, ' '))
);

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;
