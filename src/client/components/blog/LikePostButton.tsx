"use client";

import { useFormStatus } from "react-dom";
import { Heart } from "lucide-react";

type LikePostButtonProps = {
  action: () => void;
  likeCount: number;
  isLiked: boolean;
  isSignedIn: boolean;
};

function LikeButtonInner({ likeCount, isLiked, isSignedIn }: Omit<LikePostButtonProps, "action">) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={!isSignedIn || pending}
      className={`inline-flex h-9 items-center gap-2 rounded-full border px-3 text-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
        isLiked ? "border-[#E2E8F0] bg-[#F8FAFC] text-[#0F172A]" : "border-[#E2E8F0] text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
      }`}
    >
      <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
      {pending ? "Saving..." : likeCount}
    </button>
  );
}

export function LikePostButton({ action, likeCount, isLiked, isSignedIn }: LikePostButtonProps) {
  return (
    <form action={action}>
      <LikeButtonInner likeCount={likeCount} isLiked={isLiked} isSignedIn={isSignedIn} />
    </form>
  );
}
