"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ImagePlus, Loader2, Send, Sparkles } from "lucide-react";
import { createPost } from "@/server/actions/createPost";
import type { WritingAssistantMode, WritingAssistantResult, WritingAssistantTone } from "@/shared/types/writingAssistant";

const toneOptions: { label: string; value: WritingAssistantTone }[] = [
  { label: "Professional", value: "professional" },
  { label: "Casual", value: "casual" },
  { label: "Academic", value: "academic" },
  { label: "Creative", value: "creative" }
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestWritingAssistance(input: {
  mode: WritingAssistantMode;
  title: string;
  content: string;
  category: string;
  tags: string;
  tone: WritingAssistantTone;
}) {
  const response = await fetch("/api/ai-assistant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error("Assistant request failed.");
  }

  const data = (await response.json()) as { ok: boolean; result: WritingAssistantResult };
  return data.result;
}

export function CreatePostExperience() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [summary, setSummary] = useState("");
  const [tone, setTone] = useState<WritingAssistantTone>("professional");
  const [isPublishing, setIsPublishing] = useState(false);
  const [assistantResult, setAssistantResult] = useState<WritingAssistantResult | null>(null);
  const [assistantLoading, setAssistantLoading] = useState<WritingAssistantMode | null>(null);
  const [activeAction, setActiveAction] = useState<WritingAssistantMode | null>(null);
  const [assistantMessage, setAssistantMessage] = useState("");

  const preview = useMemo(() => {
    return {
      title: title || "Untitled post",
      content: content || "Your post preview will appear here as you write.",
      readTime: Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 180)),
      chars: content.length
    };
  }, [content, title]);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageUrl(URL.createObjectURL(file));
  }

  async function runAssistant(mode: WritingAssistantMode) {
    if (!content.trim()) {
      setAssistantMessage("Write some content first to get suggestions.");
      setAssistantResult(null);
      setActiveAction(null);
      return;
    }

    setAssistantMessage("");
    setAssistantResult(null);
    setActiveAction(mode);
    setAssistantLoading(mode);

    try {
      const [result] = await Promise.all([requestWritingAssistance({ mode, title, content, category, tags, tone }), wait(1000)]);
      setAssistantResult(result);
      setAssistantMessage(result.fallback && result.error ? result.error : "");
    } catch {
      setAssistantMessage("The assistant could not generate suggestions. Please try again.");
    } finally {
      setAssistantLoading(null);
    }
  }

  function applyTitleSuggestion(nextTitle: string) {
    setTitle(nextTitle);
  }

  function addTag(nextTag: string) {
    const existingTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (existingTags.some((tag) => tag.toLowerCase() === nextTag.toLowerCase())) {
      return;
    }

    setTags([...existingTags, nextTag].join(", "));
  }

  function insertSummary() {
    if (assistantResult?.summary && !assistantResult.summary.includes("Write some content first")) {
      setSummary(assistantResult.summary);
    }
  }

  function applyImprovedWriting() {
    if (assistantResult?.improvedText && !assistantResult.improvedText.includes("Write some content first")) {
      setContent(assistantResult.improvedText);
    }
  }

  return (
    <main className="app-container grid gap-8 py-10 sm:py-14 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="eyebrow">Create post</p>
          <h1 className="page-title mt-3">Write a new post.</h1>
          <p className="body-copy mt-4 max-w-2xl">Add a title, cover image, and content. Your post will be saved when you publish.</p>
        </motion.div>

        <form action={createPost} onSubmit={() => setIsPublishing(true)} className="surface-card space-y-6 rounded-2xl p-5 sm:p-7">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#0F172A]">Title</span>
            <input
              name="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              placeholder="Post title"
              className="field-control px-4 py-3 text-base placeholder:text-[#94A3B8]"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#0F172A]">Category</span>
              <input
                name="category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="Example: Technology"
                className="field-control px-4 py-3 text-sm placeholder:text-[#94A3B8]"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#0F172A]">Tags</span>
              <input
                name="tags"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
                placeholder="react, writing, ideas"
                className="field-control px-4 py-3 text-sm placeholder:text-[#94A3B8]"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#0F172A]">Summary</span>
            <textarea
              name="summary"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              rows={3}
              placeholder="Optional short description for your draft"
              className="field-control resize-y px-4 py-3 text-sm leading-6 placeholder:text-[#94A3B8]"
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-[#0F172A]"><ImagePlus size={16} /> Cover image</span>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                name="imageUrl"
                value={imageUrl.startsWith("blob:") ? "" : imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="Paste an image URL"
                className="field-control px-4 py-3 text-sm placeholder:text-[#94A3B8]"
              />
              <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] px-5 py-3 text-sm font-medium text-[#475569] transition hover:bg-[#F1F5F9]">
                Upload
                <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
              </label>
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#0F172A]">Content</span>
            <textarea
              name="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              required
              rows={15}
              placeholder="Write your post..."
              className="field-control min-h-[440px] resize-y px-4 py-4 text-base leading-8 placeholder:text-[#94A3B8]"
            />
          </label>

          <div className="flex flex-col justify-between gap-4 border-t border-[#DBEAFE] pt-5 sm:flex-row sm:items-center">
            <div className="text-sm text-[#94A3B8]">
              {preview.chars} characters - {preview.readTime} min read
            </div>
            <button type="submit" disabled={isPublishing} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-[#FFFFFF] transition hover:bg-[#475569] disabled:cursor-wait disabled:opacity-70">
              {isPublishing ? <Loader2 className="animate-spin" size={18} /> : <Send size={17} />}
              {isPublishing ? "Publishing..." : "Publish post"}
            </button>
          </div>
        </form>
      </section>

      <aside className="w-full min-w-0 max-w-2xl xl:sticky xl:top-24 xl:h-fit xl:max-w-none">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="surface-card mb-5 overflow-hidden rounded-2xl p-4 sm:p-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#DBEAFE] text-[#475569]">
              <Sparkles size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0F172A]">Writing Assistant</p>
              <p className="mt-1 text-xs leading-5 text-[#94A3B8]">Uses Gemini when configured, with a local fallback.</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">Tone</p>
            <div className="grid grid-cols-2 gap-1.5">
              {toneOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setTone(option.value)}
                  className={`rounded-full border px-2.5 py-1.5 text-[11px] font-medium transition ${
                    tone === option.value ? "border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A]" : "border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-1.5 sm:grid-cols-2 xl:grid-cols-1">
            {[
              ["title", "Suggest Title"],
              ["summary", "Generate Summary"],
              ["tags", "Suggest Tags"],
              ["improve", "Improve Writing"]
            ].map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => runAssistant(mode as WritingAssistantMode)}
                disabled={Boolean(assistantLoading)}
                className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-[#E2E8F0] px-3 py-2 text-xs font-medium text-[#475569] transition hover:bg-[#F1F5F9] disabled:cursor-wait disabled:opacity-70"
              >
                {assistantLoading === mode ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                {assistantLoading === mode ? "Generating..." : label}
              </button>
            ))}
          </div>

          {assistantMessage ? (
            <p className="mt-3 rounded-xl border border-[#60A5FA]/35 bg-[#DBEAFE] px-3 py-2 text-xs leading-5 text-[#475569]">{assistantMessage}</p>
          ) : null}

          {assistantLoading ? (
            <div className="mt-4 space-y-2.5 border-t border-[#DBEAFE] pt-4">
              <div className="h-3 w-28 animate-pulse rounded-full bg-[#F8FAFC]" />
              <div className="h-8 animate-pulse rounded-xl bg-[#F8FAFC]" />
              <div className="h-8 animate-pulse rounded-xl bg-[#F8FAFC]" />
              <div className="h-16 animate-pulse rounded-xl bg-[#F8FAFC]" />
            </div>
          ) : null}

          {assistantResult && activeAction && !assistantLoading ? (
            <div className="mt-4 max-h-[360px] overflow-y-auto border-t border-[#DBEAFE] pt-4 pr-1 xl:max-h-[calc(100vh-380px)]">
              {activeAction === "title" && assistantResult.titleSuggestions.length ? (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">Title ideas</p>
                  <div className="space-y-1.5">
                    {assistantResult.titleSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => applyTitleSuggestion(suggestion)}
                        className="block w-full rounded-xl bg-[#F1F5F9] px-3 py-2 text-left text-xs font-medium leading-5 text-[#0F172A] transition hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeAction === "summary" ? (
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">Summary</p>
                    <button type="button" onClick={insertSummary} className="shrink-0 text-xs font-semibold text-[#475569] hover:text-[#0F172A]">
                      Insert
                    </button>
                  </div>
                  <p className="break-words rounded-xl bg-[#F1F5F9] p-3 text-xs leading-5 text-[#475569]">{assistantResult.summary}</p>
                </div>
              ) : null}

              {activeAction === "tags" && assistantResult.tags.length ? (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">Suggested tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {assistantResult.tags.slice(0, 5).map((tag) => (
                      <button key={tag} type="button" onClick={() => addTag(tag)} className="max-w-full truncate rounded-full bg-[#DBEAFE] px-2.5 py-1 text-[11px] font-medium text-[#475569] transition hover:bg-[#F8FAFC]">
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeAction === "improve" ? (
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8]">Improved draft</p>
                    <button type="button" onClick={applyImprovedWriting} className="shrink-0 text-xs font-semibold text-[#475569] hover:text-[#0F172A]">
                      Apply
                    </button>
                  </div>
                  <p className="max-h-52 overflow-y-auto whitespace-pre-line break-words rounded-xl bg-[#F1F5F9] p-3 text-xs leading-5 text-[#475569]">{assistantResult.improvedText}</p>
                </div>
              ) : null}
            </div>
          ) : null}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="surface-card overflow-hidden rounded-2xl">
          <div className="relative h-48 bg-[#F8FAFC] bg-cover bg-center" style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}>
            {!imageUrl ? <div className="flex h-full items-center justify-center text-sm text-[#94A3B8]">Cover preview</div> : null}
          </div>
          <div className="p-5">
            <p className="text-xs font-medium text-[#475569]">Preview</p>
            <h2 className="card-title mt-2">{preview.title}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {category ? <span className="rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#475569]">{category}</span> : null}
              {tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
                .map((tag) => (
                  <span key={tag} className="rounded-full bg-[#F8FAFC] px-3 py-1 text-xs font-medium text-[#475569]">
                    #{tag}
                  </span>
                ))}
            </div>
            <p className="body-copy mt-4 line-clamp-6 text-sm">{preview.content}</p>
          </div>
        </motion.div>
      </aside>
    </main>
  );
}
