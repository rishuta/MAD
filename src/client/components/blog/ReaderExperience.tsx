"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { Bookmark, Clock, LinkIcon, Mail } from "lucide-react";
import type { BlogComment, BlogPost } from "@/shared/types/blog";
import { BlogCard } from "@/client/components/blog/BlogCard";
import { CommentsSection } from "@/client/components/blog/CommentsSection";
import { LikePostButton } from "@/client/components/blog/LikePostButton";
import { PostOwnerActions } from "@/client/components/blog/PostOwnerActions";

type ReaderExperienceProps = {
  post: BlogPost;
  related: BlogPost[];
  comments: BlogComment[];
  isOwner: boolean;
  isSignedIn: boolean;
  likeCount: number;
  isLiked: boolean;
  addCommentAction: (formData: FormData) => void;
  likeAction: () => void;
  deleteAction: () => void;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

export function ReaderExperience({ post, related, comments, isOwner, isSignedIn, likeCount, isLiked, addCommentAction, likeAction, deleteAction }: ReaderExperienceProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const paragraphs = post.content.split(/\n+/).filter(Boolean);
  const readTime = Math.max(2, Math.ceil(post.content.split(/\s+/).length / 180));

  return (
    <main>
      <motion.div style={{ scaleX }} className="fixed left-0 top-0 z-[60] h-1 origin-left bg-[#3B82F6]" />

      <article className="mx-auto max-w-[46rem] px-4 pb-14 pt-10 sm:px-5 sm:pt-16">
        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/" className="text-sm font-medium text-[#475569] hover:text-[#0F172A]">
            Back to posts
          </Link>
          <h1 className="mt-6 break-words text-4xl font-semibold leading-[1.12] tracking-[-0.02em] text-[#0F172A] sm:text-5xl lg:text-6xl">{post.title}</h1>
          <div className="mt-7 flex flex-wrap items-center gap-4 text-sm text-[#94A3B8]">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#DBEAFE] font-semibold text-[#475569]">{post.title.charAt(0)}</span>
            <span className="font-medium text-[#475569]">Blog author</span>
            <span>{formatDate(post.created_at)}</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={15} /> {readTime} min read
            </span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {post.category ? <span className="rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#475569]">{post.category}</span> : null}
            {(post.tags || []).map((tag) => (
              <span key={tag} className="rounded-full bg-[#F8FAFC] px-3 py-1 text-xs font-medium text-[#475569]">
                #{tag}
              </span>
            ))}
          </div>
          {isOwner ? <PostOwnerActions postId={post.id} deleteAction={deleteAction} /> : null}
        </motion.header>

        <div className="relative mt-10 h-[260px] overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] sm:h-[420px]">
          <Image
            src={post.image_url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80"}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(min-width: 768px) 760px, 100vw"
          />
        </div>

        <div className="mt-6 flex items-center gap-2 border-b border-[#E2E8F0] pb-6">
          <LikePostButton action={likeAction} likeCount={likeCount} isLiked={isLiked} isSignedIn={isSignedIn} />
          {[Bookmark, Mail, LinkIcon].map((Icon, index) => (
            <button key={index} aria-label={Icon === Bookmark ? "Save post" : Icon === Mail ? "Share by email" : "Copy link"} className="grid h-9 w-9 place-items-center rounded-full border border-[#E2E8F0] text-[#94A3B8] transition hover:bg-[#F1F5F9] hover:text-[#0F172A]">
              <Icon size={16} />
            </button>
          ))}
        </div>

        <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }} className="reader-content mt-10 break-words sm:mt-12">
          {paragraphs.map((paragraph, index) => (
            <motion.p key={index} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }} className="mb-7">
              {paragraph}
            </motion.p>
          ))}
        </motion.div>
      </article>

      <CommentsSection comments={comments} action={addCommentAction} isSignedIn={isSignedIn} />

      {related.length > 0 ? (
        <section className="app-container border-t border-[#E2E8F0] py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">More to read</p>
              <h2 className="section-title mt-3">Related posts</h2>
            </div>
            <Link href="/" className="text-sm font-medium text-[#475569] hover:text-[#0F172A]">All posts</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {related.slice(0, 3).map((item) => (
              <BlogCard key={item.id} id={item.id} title={item.title} content={item.content} imageUrl={item.image_url} category={item.category} tags={item.tags} createdAt={item.created_at} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
