"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Save } from "lucide-react";
import type { BlogPost } from "@/shared/types/blog";

type EditPostExperienceProps = {
  post: BlogPost;
  action: (formData: FormData) => void;
};

export function EditPostExperience({ post, action }: EditPostExperienceProps) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [imageUrl, setImageUrl] = useState(post.image_url || "");
  const [category, setCategory] = useState(post.category || "");
  const [tags, setTags] = useState((post.tags || []).join(", "));
  const [isSaving, setIsSaving] = useState(false);

  const readTime = useMemo(() => Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 180)), [content]);

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-5 sm:py-14">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <p className="eyebrow">Edit post</p>
        <h1 className="page-title mt-3">Update your post.</h1>
        <p className="body-copy mt-4">Only the post owner can make changes.</p>
      </motion.div>

      <form action={action} onSubmit={() => setIsSaving(true)} className="surface-card space-y-6 rounded-2xl p-5 sm:p-7">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#0F172A]">Title</span>
          <input name="title" value={title} onChange={(event) => setTitle(event.target.value)} required className="field-control px-4 py-3 text-base" />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#0F172A]">Cover image URL</span>
          <input name="imageUrl" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="Paste an image URL" className="field-control px-4 py-3 text-sm" />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#0F172A]">Category</span>
            <input name="category" value={category} onChange={(event) => setCategory(event.target.value)} className="field-control px-4 py-3 text-sm" />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#0F172A]">Tags</span>
            <input name="tags" value={tags} onChange={(event) => setTags(event.target.value)} placeholder="react, writing, ideas" className="field-control px-4 py-3 text-sm" />
          </label>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#0F172A]">Content</span>
          <textarea name="content" value={content} onChange={(event) => setContent(event.target.value)} required rows={16} className="field-control min-h-[460px] resize-y px-4 py-4 text-base leading-8" />
        </label>

        <div className="flex flex-col justify-between gap-4 border-t border-[#DBEAFE] pt-5 sm:flex-row sm:items-center">
          <div className="text-sm text-[#94A3B8]">{content.length} characters - {readTime} min read</div>
          <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-[#FFFFFF] transition hover:bg-[#475569] disabled:cursor-wait disabled:opacity-70">
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={17} />}
            {isSaving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </main>
  );
}
