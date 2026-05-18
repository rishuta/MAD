"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function createPost(formData: FormData) {
  const user = await currentUser();

  if (!user) {
    throw new Error("You must be logged in to create a post.");
  }

  const title = String(formData.get("title") || "").trim();
  const content = String(formData.get("content") || "").trim();

  if (!title || !content) {
    throw new Error("Title and content are required.");
  }

  const email = user.emailAddresses[0]?.emailAddress || "";
  const supabaseAdmin = createSupabaseAdmin();

  await supabaseAdmin.from("users").upsert(
    {
      clerk_id: user.id,
      email,
      name: user.fullName || user.username || "Blog User"
    },
    { onConflict: "clerk_id" }
  );

  const { error } = await supabaseAdmin.from("posts").insert({
    title,
    content,
    image_url: null,
    user_id: user.id
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/");
}
