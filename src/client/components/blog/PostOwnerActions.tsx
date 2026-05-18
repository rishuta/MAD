"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";

type PostOwnerActionsProps = {
  postId: string;
  deleteAction: () => void;
};

export function PostOwnerActions({ postId, deleteAction }: PostOwnerActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link href={`/edit/${postId}`} className="inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] px-4 py-2 text-sm font-medium text-[#475569] transition hover:bg-[#F1F5F9]">
        <Pencil size={16} />
        Edit post
      </Link>
      <form
        action={deleteAction}
        onSubmit={(event) => {
          if (!confirm("Delete this post? This action cannot be undone.")) {
            event.preventDefault();
            return;
          }

          setIsDeleting(true);
        }}
      >
        <button type="submit" disabled={isDeleting} className="inline-flex items-center gap-2 rounded-full border border-[#EF4444]/35 px-4 py-2 text-sm font-medium text-[#EF4444] transition hover:bg-[#EF4444]/10 disabled:cursor-wait disabled:opacity-70">
          {isDeleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
          {isDeleting ? "Deleting..." : "Delete post"}
        </button>
      </form>
    </div>
  );
}
