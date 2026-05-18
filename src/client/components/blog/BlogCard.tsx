"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, Briefcase, Clock, Code2, Palette, PenLine } from "lucide-react";
import { authorProfiles, fallbackImages } from "@/client/data/visualFallbacks";

type BlogCardProps = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  category?: string | null;
  tags?: string[];
  createdAt?: string;
  index?: number;
  href?: string;
  authorName?: string;
  avatarUrl?: string;
};

function createPreview(content: string) {
  if (content.length <= 140) return content;
  return `${content.slice(0, 140)}...`;
}

function formatDate(date?: string) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

function getCategoryIcon(category?: string | null) {
  const value = category?.toLowerCase() || "";
  if (value.includes("design")) return Palette;
  if (value.includes("tech") || value.includes("web")) return Code2;
  if (value.includes("business") || value.includes("product")) return Briefcase;
  return PenLine;
}

function getStableIndex(value: string, length: number) {
  return value.split("").reduce((total, char) => total + char.charCodeAt(0), 0) % length;
}

export function BlogCard({ id, title, content, imageUrl, category, tags = [], createdAt, index, href, authorName, avatarUrl }: BlogCardProps) {
  const readTime = Math.max(2, Math.ceil(content.split(/\s+/).length / 180));
  const stableIndex = index ?? getStableIndex(id || title, fallbackImages.length);
  const fallbackImage = fallbackImages[stableIndex % fallbackImages.length];
  const author = authorProfiles[stableIndex % authorProfiles.length];
  const Icon = getCategoryIcon(category);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="surface-card group overflow-hidden rounded-2xl transition hover:shadow-[0_1px_2px_rgba(15,23,42,0.06),0_14px_30px_rgba(15,23,42,0.06)]"
    >
      <Link href={href || `/posts/${id}`} className="block">
        <div className="relative h-52 w-full overflow-hidden bg-[#F8FAFC]">
          <Image
            src={imageUrl || fallbackImage}
            alt={title}
            fill
            className="object-cover transition duration-300 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        </div>

        <div className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3 text-xs text-[#94A3B8]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F8FAFC] px-2.5 py-1 font-medium text-[#475569]">
              <Icon size={13} />
              {category || "Article"}
            </span>
            <span aria-hidden="true" className="rounded-full p-1.5 text-[#94A3B8] transition group-hover:bg-[#F8FAFC] group-hover:text-[#475569]">
              <Bookmark size={15} />
            </span>
          </div>

          <h3 className="card-title break-words">{title}</h3>
          <p className="body-copy mt-3 break-words text-sm">{createPreview(content)}</p>

          {category || tags.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {category ? <span className="rounded-full bg-[#DBEAFE] px-2.5 py-1 text-xs font-medium text-[#475569]">{category}</span> : null}
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#475569]">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#DBEAFE] pt-4 text-xs text-[#94A3B8]">
            <div className="flex items-center gap-2">
              <span className="relative h-8 w-8 overflow-hidden rounded-full bg-[#DBEAFE]">
                <Image src={avatarUrl || author.avatar} alt={authorName || author.name} fill className="object-cover" sizes="32px" />
              </span>
              <span className="truncate">{authorName || author.name}</span>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1">
              <Clock size={13} />
              {readTime} min - {formatDate(createdAt)}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
