"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, BarChart3, BookOpenText, Edit3, FolderOpen, MessageSquare, PenLine, Search, ShieldCheck, Tags, X } from "lucide-react";
import type { BlogPost } from "@/shared/types/blog";
import { BlogCard } from "@/client/components/blog/BlogCard";

type HomeExperienceProps = {
  posts: BlogPost[];
  query: string;
};

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }
};

const features = [
  {
    title: "Write and publish",
    description: "Create posts with covers, categories, and tags in a clean writing workspace.",
    icon: Edit3
  },
  {
    title: "Organize your posts",
    description: "Use categories and tags to help readers find related writing.",
    icon: Tags
  },
  {
    title: "Manage your blog",
    description: "Edit, delete, and review your posts from a simple dashboard.",
    icon: FolderOpen
  },
  {
    title: "Join the conversation",
    description: "Readers can leave comments below each post when they are signed in.",
    icon: MessageSquare
  }
];

const testimonials = [
  {
    quote: "The app feels simple and familiar. I can write a post, organize it, and publish without getting distracted.",
    name: "Ananya Rao",
    role: "Student writer"
  },
  {
    quote: "The layout is clean, and the reading page is comfortable. It feels like a real blog product.",
    name: "Rahul Mehta",
    role: "Frontend developer"
  },
  {
    quote: "I like that the dashboard shows the essentials without making the interface feel busy.",
    name: "Priya Nair",
    role: "Content editor"
  }
];

const footerLinks = ["Home", "Dashboard", "Write", "Recent posts"];
const socialLinks = [
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "X", href: "https://x.com" }
];

export function HomeExperience({ posts, query }: HomeExperienceProps) {
  const normalizedQuery = query.trim().toLowerCase();
  const displayPosts = normalizedQuery
    ? posts.filter((post) => [post.title, post.content, post.category || "", ...(post.tags || [])].join(" ").toLowerCase().includes(normalizedQuery))
    : posts;
  const words = displayPosts.reduce((total, post) => total + post.content.split(/\s+/).length, 0);
  const trendingPosts = displayPosts.slice(0, 3);
  const estimatedReads = Math.max(0, displayPosts.reduce((total, post) => total + Math.ceil(post.content.split(/\s+/).length / 180), 0));

  return (
    <main>
      <section className="border-b border-[#E2E8F0] bg-[#FFFFFF]">
        <div className="app-container grid items-center gap-14 py-16 md:py-24 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
            <motion.p variants={fadeIn} className="eyebrow mb-4">
              Simple blogging platform
            </motion.p>
            <motion.h1 variants={fadeIn} className="page-title max-w-3xl">
              Publish your ideas and stories.
            </motion.h1>
            <motion.p variants={fadeIn} className="body-copy mt-6 max-w-2xl text-lg">
              Create posts, organize your writing, and share it with readers from one clean workspace.
            </motion.p>
            <motion.div variants={fadeIn} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/create" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-[#FFFFFF] transition hover:bg-[#475569]">
                Write a new post <ArrowRight size={17} />
              </Link>
              <Link href="#blogs" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E2E8F0] px-5 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F1F5F9]">
                View posts <BookOpenText size={17} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }} className="rounded-2xl border border-[#E2E8F0] bg-[#F1F5F9] p-4">
            <div className="surface-card rounded-2xl p-6 sm:p-7">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#94A3B8]">Draft preview</p>
                  <h2 className="card-title mt-1">A better way to write</h2>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#DBEAFE] text-[#475569]">
                  <PenLine size={18} />
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-3 w-3/4 rounded-full bg-[#E2E8F0]" />
                <div className="h-3 w-full rounded-full bg-[#F8FAFC]" />
                <div className="h-3 w-2/3 rounded-full bg-[#F8FAFC]" />
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["Posts", displayPosts.length],
                  ["Words", words],
                  ["Read time", `${estimatedReads}m`]
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-4">
                    <p className="text-xs font-medium text-[#94A3B8]">{label}</p>
                    <p className="mt-1 text-2xl font-semibold text-[#0F172A]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="app-container section-block">
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow">Features</p>
          <h2 className="section-title mt-3">Everything needed for a simple blog</h2>
          <p className="body-copy mt-4">A focused set of tools for writing, organizing, and managing posts.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.04, duration: 0.3 }}
              className="surface-card rounded-2xl p-6 transition hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(15,23,42,0.05)]"
            >
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-[#DBEAFE] text-[#475569]">
                <feature.icon size={20} />
              </div>
              <h3 className="card-title">{feature.title}</h3>
              <p className="body-copy mt-3 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="border-y border-[#E2E8F0] bg-[#F1F5F9]">
        <div className="app-container grid gap-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Published posts", displayPosts.length],
            ["Words written", words.toLocaleString("en-IN")],
            ["Reading minutes", estimatedReads],
            ["Categories", new Set(displayPosts.map((post) => post.category).filter(Boolean)).size]
          ].map(([label, value]) => (
            <div key={label} className="surface-card rounded-2xl p-6">
              <p className="text-sm font-medium text-[#94A3B8]">{label}</p>
              <p className="mt-2 text-3xl font-semibold text-[#0F172A]">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {trendingPosts.length > 0 ? (
        <section className="app-container section-block">
          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Trending blogs</p>
              <h2 className="section-title mt-3">Recent posts</h2>
            </div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-[#475569] hover:text-[#0F172A]">
              Dashboard <BarChart3 size={16} />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {trendingPosts.map((post) => (
              <BlogCard key={post.id} id={post.id} title={post.title} content={post.content} imageUrl={post.image_url} category={post.category} tags={post.tags} createdAt={post.created_at} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="app-container section-block">
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow">Testimonials</p>
          <h2 className="section-title mt-3">Writers appreciate the simple workflow</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.figure
              key={testimonial.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.04, duration: 0.3 }}
              className="surface-card rounded-2xl p-6"
            >
              <blockquote className="body-copy text-sm">{testimonial.quote}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#DBEAFE] text-sm font-semibold text-[#475569]">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0F172A]">{testimonial.name}</p>
                  <p className="text-xs text-[#94A3B8]">{testimonial.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      <section id="blogs" className="app-container section-block">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">All posts</p>
            <h2 className="section-title mt-3">Latest writing</h2>
          </div>
          <form action="/" className="flex w-full max-w-md items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#FFFFFF] px-3 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.05)] md:w-auto">
            <Search size={16} className="text-[#94A3B8]" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search posts"
              className="min-w-0 flex-1 bg-transparent text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8]"
            />
            {query ? (
              <Link href="/" aria-label="Clear search" className="rounded-full p-1 text-[#94A3B8] transition hover:bg-[#F8FAFC] hover:text-[#475569]">
                <X size={15} />
              </Link>
            ) : null}
            <button className="rounded-full bg-[#3B82F6] px-3 py-1.5 text-xs font-semibold text-[#FFFFFF] transition hover:bg-[#475569]">Search</button>
          </form>
        </div>

        {displayPosts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {displayPosts.map((post, index) => (
              <BlogCard
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                imageUrl={post.image_url}
                category={post.category}
                tags={post.tags}
                createdAt={post.created_at}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-[#E2E8F0] bg-[#FFFFFF] p-8 text-center shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[#DBEAFE] text-[#475569]">
              <PenLine size={24} />
            </div>
            <h3 className="text-2xl font-semibold text-[#0F172A]">{query ? "No matching posts" : "No posts yet"}</h3>
            <p className="mx-auto mt-3 max-w-md text-[#475569]">{query ? "Try searching by title, content, category, or tag." : "Write your first post and it will appear here."}</p>
            <Link href="/create" className="mt-6 inline-flex rounded-full bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-[#FFFFFF] transition hover:bg-[#475569]">
              Write a new post
            </Link>
          </div>
        )}
      </section>

      <section className="app-container section-block">
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#F1F5F9] p-8 text-center shadow-[0_1px_2px_rgba(15,23,42,0.05)] md:p-14">
          <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#DBEAFE] text-[#475569]">
            <ShieldCheck size={22} />
          </div>
          <h2 className="section-title">Start writing today.</h2>
          <p className="body-copy mx-auto mt-4 max-w-2xl">
            Keep your blog simple, organized, and easy to read.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/create" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-[#FFFFFF] transition hover:bg-[#475569]">
              Write a new post <ArrowRight size={17} />
            </Link>
            <Link href="#blogs" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#E2E8F0] bg-[#FFFFFF] px-5 py-3 text-sm font-semibold text-[#0F172A] transition hover:bg-[#F1F5F9]">
              Read posts <BookOpenText size={17} />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E2E8F0] bg-[#FFFFFF]">
        <div className="app-container grid gap-8 py-10 md:grid-cols-[1fr_auto_auto]">
          <div>
            <div className="flex items-center gap-2 text-[#0F172A]">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#3B82F6] text-[#FFFFFF]">
                <PenLine size={17} />
              </span>
              <span className="text-lg font-semibold tracking-tight">BlogSpace</span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-[#475569]">
              A clean place to publish ideas, stories, and notes.
            </p>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-[#0F172A]">Links</p>
            <div className="grid gap-2 text-sm text-[#475569]">
              {footerLinks.map((label) => (
                <Link key={label} href={label === "Dashboard" ? "/dashboard" : label === "Write" ? "/create" : label === "Recent posts" ? "#blogs" : "/"} className="hover:text-[#0F172A]">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold text-[#0F172A]">Social</p>
            <div className="grid gap-2 text-sm text-[#475569]">
              {socialLinks.map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="hover:text-[#0F172A]">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-[#DBEAFE] px-5 py-5 text-center text-xs text-[#94A3B8]">
          (c) 2026 BlogSpace. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
