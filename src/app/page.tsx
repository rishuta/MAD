import Link from "next/link";
import { ArrowRight, BookOpen, PenLine, ShieldCheck } from "lucide-react";
import { BlogCard } from "@/components/BlogCard";
import { getPosts } from "@/lib/posts";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <main>
      <section className="mx-auto grid min-h-[72vh] max-w-6xl items-center gap-10 px-5 py-14 md:grid-cols-2">
        <div>
          <p className="mb-4 inline-flex rounded-full bg-black px-4 py-2 text-sm font-medium text-white">
            College mini project
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-neutral-950 sm:text-5xl">
            A simple modern blog app.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-600">
            Sign in, create posts, upload cover images, and show blogs publicly. We are starting with the clean homepage, auth setup, and Supabase setup.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
            >
              Get started <ArrowRight size={18} />
            </Link>
            <Link
              href="#blogs"
              className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-5 py-3 text-sm font-semibold transition hover:bg-neutral-100"
            >
              View blogs
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4">
            <div className="rounded-2xl bg-neutral-950 p-6 text-white">
              <PenLine className="mb-8" size={28} />
              <h2 className="text-2xl font-semibold">Write and publish</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-300">
                A beginner-friendly blog system using only the important features.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-neutral-100 p-5">
                <ShieldCheck className="mb-4" size={24} />
                <h3 className="font-semibold">Clerk Auth</h3>
                <p className="mt-2 text-sm text-neutral-600">Login and signup pages are ready.</p>
              </div>
              <div className="rounded-2xl bg-neutral-100 p-5">
                <BookOpen className="mb-4" size={24} />
                <h3 className="font-semibold">Supabase DB</h3>
                <p className="mt-2 text-sm text-neutral-600">Tables for users and posts are planned.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="blogs" className="border-t border-neutral-200 bg-white py-14">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mb-8">
            <p className="text-sm font-semibold text-neutral-500">Latest posts</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight">Blogs from Supabase</h2>
          </div>
          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {posts.map((post) => (
                <BlogCard
                  key={post.id}
                  title={post.title}
                  content={post.content}
                  imageUrl={post.image_url}
                  createdAt={post.created_at}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center">
              <h3 className="text-lg font-bold">No blog posts yet</h3>
              <p className="mt-2 text-sm text-neutral-600">Create your first post and it will appear here.</p>
              <Link
                href="/create"
                className="mt-5 inline-flex rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Create post
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
