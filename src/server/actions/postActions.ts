"use server";

import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseAdmin } from "@/server/db/supabaseAdmin";

function parseTags(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

async function requireUser() {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in.");
  }

  return user;
}

export async function updatePost(postId: string, formData: FormData) {
  const user = await requireUser();
  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const imageUrl = String(formData.get("imageUrl") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const tags = parseTags(formData.get("tags"));

  if (!title || !content) {
    throw new Error("Title and content are required.");
  }

  const supabaseAdmin = createSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("posts")
    .update({
      title,
      content,
      image_url: imageUrl || null,
      category: category || null,
      tags,
      updated_at: new Date().toISOString()
    })
    .eq("id", postId)
    .eq("user_id", user.id)
    .select("id")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("You can only edit your own posts.");
  }

  revalidatePath("/");
  revalidatePath(`/posts/${postId}`);
  revalidatePath("/dashboard");
  redirect(`/posts/${postId}`);
}

export async function deletePost(postId: string) {
  const user = await requireUser();
  const supabaseAdmin = createSupabaseAdmin();

  const { data, error } = await supabaseAdmin.from("posts").delete().eq("id", postId).eq("user_id", user.id).select("id").single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("You can only delete your own posts.");
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  redirect("/");
}

export async function addComment(postId: string, formData: FormData) {
  const user = await requireUser();
  const content = String(formData.get("comment") || "").trim();

  if (!content) {
    throw new Error("Comment cannot be empty.");
  }

  const email = user.emailAddresses[0]?.emailAddress || "";
  const supabaseAdmin = createSupabaseAdmin();

  const { error } = await supabaseAdmin.from("comments").insert({
    post_id: postId,
    user_id: user.id,
    author_name: user.fullName || user.username || "Blog User",
    author_email: email || null,
    content
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/posts/${postId}`);
  revalidatePath("/dashboard");
}

export async function toggleLike(postId: string) {
  await requireUser();
  const supabaseAdmin = createSupabaseAdmin();

  const { data: post, error: readError } = await supabaseAdmin.from("posts").select("likes").eq("id", postId).single();

  if (readError) {
    throw new Error(readError.message);
  }

  const { error } = await supabaseAdmin
    .from("posts")
    .update({ likes: Number(post.likes || 0) + 1, updated_at: new Date().toISOString() })
    .eq("id", postId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/posts/${postId}`);
  revalidatePath("/dashboard");
}
