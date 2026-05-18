import "server-only";

import { createSupabaseClient } from "@/lib/supabase";

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
};

export async function getPosts() {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select("id, title, content, image_url, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as BlogPost[];
}
