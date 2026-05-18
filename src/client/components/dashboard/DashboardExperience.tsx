"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, ArrowUpRight, BarChart3, Clock, Edit3, Eye, FileText, Heart, MessageCircle, Plus, Trash2, type LucideIcon } from "lucide-react";
import type { DashboardAnalytics, DashboardPostMetric } from "@/shared/types/analytics";
import { deletePost } from "@/server/actions/postActions";

type DashboardExperienceProps = {
  analytics: DashboardAnalytics;
};

type SummaryItem = {
  label: string;
  value: string | number;
  icon: LucideIcon;
};

type DashboardTab = "overview" | "analytics" | "activity" | "posts";

const tabs: { id: DashboardTab; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "analytics", label: "Analytics", icon: Activity },
  { id: "activity", label: "Activity", icon: Clock },
  { id: "posts", label: "Posts", icon: FileText }
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function StatCard({ label, value, helper, icon: Icon }: { label: string; value: string; helper: string; icon: LucideIcon }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="surface-card rounded-2xl p-5">
      <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-[#F1F5F9] text-[#475569]">
        <Icon size={19} />
      </div>
      <p className="text-sm font-medium text-[#94A3B8]">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-3xl">{value}</p>
      <p className="mt-2 text-xs text-[#94A3B8]">{helper}</p>
    </motion.div>
  );
}

function PopularPost({ post, href }: { post: DashboardPostMetric | null; href: string }) {
  if (!post) {
    return (
      <div className="rounded-2xl border border-dashed border-[#E2E8F0] bg-[#F1F5F9] p-6 text-sm leading-6 text-[#94A3B8]">
        Publish a post to see your most popular blog here.
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-2xl border border-[#E2E8F0] bg-[#F1F5F9] p-5">
        <p className="text-xs font-medium text-[#475569]">{post.category || "Article"}</p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight text-[#0F172A]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#475569]">{post.content}</p>
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-[#FFFFFF] p-3">
            <p className="text-lg font-semibold text-[#0F172A]">{post.views || 0}</p>
            <p className="text-xs text-[#94A3B8]">Views</p>
          </div>
          <div className="rounded-2xl bg-[#FFFFFF] p-3">
            <p className="text-lg font-semibold text-[#0F172A]">{post.likes || 0}</p>
            <p className="text-xs text-[#94A3B8]">Likes</p>
          </div>
          <div className="rounded-2xl bg-[#FFFFFF] p-3">
            <p className="text-lg font-semibold text-[#0F172A]">{post.comments || 0}</p>
            <p className="text-xs text-[#94A3B8]">Comments</p>
          </div>
        </div>
      </div>
      <Link href={href} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[#475569] hover:text-[#0F172A]">
        View post <ArrowUpRight size={15} />
      </Link>
    </div>
  );
}

function DeletePostForm({ postId }: { postId: string }) {
  return (
    <form
      action={deletePost.bind(null, postId)}
      onSubmit={(event) => {
        if (!confirm("Delete this post? This action cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <button type="submit" className="inline-flex items-center gap-1 rounded-full border border-[#EF4444]/35 px-3 py-1.5 text-xs font-medium text-[#EF4444] transition hover:bg-[#EF4444]/10">
        <Trash2 size={13} />
        Delete
      </button>
    </form>
  );
}

export function DashboardExperience({ analytics }: DashboardExperienceProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const posts = analytics.posts;
  const totalBlogs = analytics.totalBlogs;
  const totalViews = analytics.totalViews;
  const totalLikes = analytics.totalLikes;
  const totalComments = analytics.totalComments;
  const mostPopular = analytics.mostPopular;
  const weeklyPosts = analytics.weeklyPosts;
  const recentActivity = analytics.recentActivity;
  const maxWeekly = Math.max(...weeklyPosts.map((item) => item.count), 1);
  const averageReadTime = Math.max(0, Math.ceil(posts.reduce((sum, post) => sum + post.readTime, 0) / Math.max(totalBlogs, 1)));

  const statCards = [
    { label: "Total blogs", value: totalBlogs.toLocaleString("en-IN"), helper: "From posts table", icon: FileText },
    { label: "Total views", value: totalViews.toLocaleString("en-IN"), helper: "Sum of posts.views", icon: Eye },
    { label: "Total likes", value: totalLikes.toLocaleString("en-IN"), helper: "Sum of posts.likes", icon: Heart },
    { label: "Comments", value: totalComments.toLocaleString("en-IN"), helper: "From comments table", icon: MessageCircle }
  ];

  const summaryItems: SummaryItem[] = [
    { label: "Average read time", value: totalBlogs ? `${averageReadTime} min` : "No posts", icon: Clock },
    { label: "Posts with category", value: posts.filter((post) => post.category).length, icon: FileText },
    { label: "Posts with tags", value: posts.filter((post) => post.tags?.length).length, icon: BarChart3 }
  ];

  return (
    <main className="app-container grid gap-7 py-8 sm:py-10 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="surface-card min-w-0 rounded-2xl p-4 lg:sticky lg:top-24 lg:h-fit">
        <div className="mb-7 flex items-center gap-3 px-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#DBEAFE] text-[#475569]">
            <BarChart3 size={19} />
          </div>
          <div>
            <p className="font-semibold text-[#0F172A]">Dashboard</p>
            <p className="text-xs text-[#94A3B8]">Blog overview</p>
          </div>
        </div>
        <div className="grid gap-1 overflow-x-auto sm:grid-cols-4 lg:grid-cols-1 lg:overflow-visible">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex min-w-32 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition sm:min-w-0 ${
                activeTab === tab.id ? "bg-[#F8FAFC] text-[#0F172A]" : "text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </aside>

      <section className="space-y-6">
        <div className="surface-card rounded-2xl p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="eyebrow">Dashboard</p>
              <h1 className="section-title mt-3">Blog analytics</h1>
              <p className="body-copy mt-4 max-w-2xl">Review real post, view, like, and comment activity from the database.</p>
            </div>
            <Link href="/create" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-[#FFFFFF] transition hover:bg-[#475569]">
              <Plus size={18} /> New post
            </Link>
          </div>
        </div>

        {activeTab === "overview" ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {statCards.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <div className="surface-card rounded-2xl p-5 sm:p-6">
                <p className="text-sm font-medium text-[#94A3B8]">Summary</p>
                <h2 className="card-title mb-5 mt-1">Content health</h2>
                <div className="space-y-3">
                  {summaryItems.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex flex-col gap-3 rounded-2xl bg-[#F1F5F9] p-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFFFFF] text-[#475569]">
                          <Icon size={17} />
                        </div>
                        <p className="text-sm font-medium text-[#475569]">{label}</p>
                      </div>
                      <p className="text-lg font-semibold text-[#0F172A]">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-card rounded-2xl p-5 sm:p-6">
                <p className="text-sm font-medium text-[#94A3B8]">Most popular blog</p>
                <div className="mt-4">
                  <PopularPost post={mostPopular} href={mostPopular ? `/posts/${mostPopular.id}` : "/create"} />
                </div>
              </div>
            </div>
          </>
        ) : null}

        {activeTab === "analytics" ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="surface-card rounded-2xl p-5 sm:p-6">
              <div className="mb-7">
                <p className="text-sm font-medium text-[#94A3B8]">Weekly graph</p>
                <h2 className="card-title">Posts this week</h2>
              </div>
              {weeklyPosts.some((item) => item.count > 0) ? (
                <div className="flex h-64 min-w-0 items-end gap-2 sm:gap-3">
                  {weeklyPosts.map((item, index) => (
                    <div key={item.date} className="flex flex-1 flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(8, (item.count / maxWeekly) * 100)}%` }}
                        transition={{ delay: index * 0.04, duration: 0.35 }}
                        className="w-full rounded-t-xl bg-[#60A5FA]"
                        title={`${item.count} posts`}
                      />
                      <span className="text-xs text-[#94A3B8]">{item.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-[#E2E8F0] bg-[#F1F5F9] text-center text-sm text-[#94A3B8]">
                  No posts published this week.
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <StatCard label="Total views" value={totalViews.toLocaleString("en-IN")} helper="Sum of posts.views" icon={Eye} />
                <StatCard label="Total likes" value={totalLikes.toLocaleString("en-IN")} helper="Sum of posts.likes" icon={Heart} />
              </div>
              <div className="surface-card rounded-2xl p-5 sm:p-6">
                <p className="text-sm font-medium text-[#94A3B8]">Most popular blog</p>
                <div className="mt-4">
                  <PopularPost post={mostPopular} href={mostPopular ? `/posts/${mostPopular.id}` : "/create"} />
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "activity" ? (
          <div className="surface-card rounded-2xl p-5 sm:p-6">
            <p className="text-sm font-medium text-[#94A3B8]">Recent activity</p>
            <h2 className="card-title mb-5 mt-1">Latest updates</h2>
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <Link key={item.id} href={item.href} className="flex items-start justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-4 transition hover:bg-[#F1F5F9]">
                  <div className="min-w-0">
                    <p className="font-medium text-[#0F172A]">{item.label}</p>
                    <p className="mt-1 break-words text-xs text-[#94A3B8]">{item.detail}</p>
                  </div>
                  <p className="hidden shrink-0 text-xs text-[#94A3B8] sm:block">{formatDate(item.createdAt)}</p>
                </Link>
              ))}
              {!recentActivity.length ? <p className="rounded-2xl border border-dashed border-[#E2E8F0] p-6 text-center text-sm text-[#94A3B8]">No activity recorded yet.</p> : null}
            </div>
          </div>
        ) : null}

        {activeTab === "posts" ? (
          <div className="surface-card rounded-2xl p-5 sm:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm font-medium text-[#94A3B8]">Posts</p>
                <h2 className="card-title">All published posts</h2>
              </div>
              <Link href="/create" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-[#FFFFFF] transition hover:bg-[#475569]">
                <Plus size={16} /> New post
              </Link>
            </div>

            <div className="space-y-3">
              {posts.map((post) => (
                <article key={post.id} className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-4">
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div className="min-w-0">
                      <p className="break-words font-medium text-[#0F172A]">{post.title}</p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-[#94A3B8]">
                        <span>{post.category || "Uncategorized"}</span>
                        <span>{post.views || 0} views</span>
                        <span>{post.likes || 0} likes</span>
                        <span>{post.comments || 0} comments</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/posts/${post.id}`} className="inline-flex items-center gap-1 rounded-full border border-[#E2E8F0] px-3 py-1.5 text-xs font-medium text-[#475569] transition hover:bg-[#F1F5F9]">
                        <Eye size={13} /> View
                      </Link>
                      <Link href={`/edit/${post.id}`} className="inline-flex items-center gap-1 rounded-full border border-[#E2E8F0] px-3 py-1.5 text-xs font-medium text-[#475569] transition hover:bg-[#F1F5F9]">
                        <Edit3 size={13} /> Edit
                      </Link>
                      <DeletePostForm postId={post.id} />
                    </div>
                  </div>
                </article>
              ))}
              {!posts.length ? <p className="rounded-2xl border border-dashed border-[#E2E8F0] p-6 text-center text-sm text-[#94A3B8]">No posts yet.</p> : null}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
