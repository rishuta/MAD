"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import type { BlogComment } from "@/shared/types/blog";

type CommentsSectionProps = {
  comments: BlogComment[];
  action: (formData: FormData) => void;
  isSignedIn: boolean;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className="rounded-full bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-[#FFFFFF] transition hover:bg-[#475569] disabled:cursor-wait disabled:opacity-70">
      {pending ? "Posting..." : "Post comment"}
    </button>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export function CommentsSection({ comments, action, isSignedIn }: CommentsSectionProps) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <section className="mx-auto max-w-[46rem] border-t border-[#E2E8F0] px-4 py-10 sm:px-5 sm:py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="card-title">Comments</h2>
          <p className="mt-2 text-sm text-[#94A3B8]">{comments.length} {comments.length === 1 ? "comment" : "comments"}</p>
        </div>
      </div>

      {isSignedIn ? (
        <form
          ref={formRef}
          action={async (formData) => {
            await action(formData);
            formRef.current?.reset();
          }}
          className="surface-card mt-6 rounded-2xl p-4"
        >
          <label className="block">
            <span className="sr-only">Add a comment</span>
            <textarea name="comment" required rows={4} placeholder="Write a comment..." className="field-control resize-y px-4 py-3 text-sm leading-6 placeholder:text-[#94A3B8]" />
          </label>
          <div className="mt-3 flex justify-end">
            <SubmitButton />
          </div>
        </form>
      ) : (
        <div className="mt-6 rounded-2xl border border-[#E2E8F0] bg-[#F1F5F9] p-5 text-sm text-[#475569]">
          Login to add a comment.
        </div>
      )}

      <div className="mt-8 space-y-4">
        {comments.map((comment) => (
          <article key={comment.id} className="surface-card rounded-2xl p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-[#DBEAFE] text-sm font-semibold text-[#475569]">
                {comment.author_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0F172A]">{comment.author_name}</p>
                <p className="text-xs text-[#94A3B8]">{formatDate(comment.created_at)}</p>
              </div>
            </div>
            <p className="body-copy mt-4 break-words text-sm">{comment.content}</p>
          </article>
        ))}
        {!comments.length ? <p className="rounded-2xl border border-dashed border-[#E2E8F0] bg-[#F1F5F9] p-6 text-center text-sm text-[#94A3B8]">No comments yet. Be the first to respond.</p> : null}
      </div>
    </section>
  );
}
