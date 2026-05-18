import "server-only";

import { createSupabaseClient } from "@/server/db/supabase";
import type { BlogComment, BlogPost } from "@/shared/types/blog";

const postSelect = "id, title, content, image_url, category, tags, views, likes, user_id, created_at, updated_at";

export async function getPosts(query?: string) {
  const supabase = createSupabaseClient();
  const search = query?.trim();

  const { data, error } = await supabase
    .from("posts")
    .select(postSelect)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  const posts = (data || []) as BlogPost[];

  if (!search) {
    return posts;
  }

  const normalizedSearch = search.toLowerCase();

  return posts.filter((post) => {
    return [post.title, post.content, post.category || "", ...(post.tags || [])]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch);
  });
}

export async function getPost(id: string) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("posts")
    .select(postSelect)
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data as BlogPost;
}

export async function getComments(postId: string) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("comments")
    .select("id, post_id, user_id, author_name, author_email, content, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as BlogComment[];
}
