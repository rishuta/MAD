import "server-only";

import { createSupabaseClient } from "@/server/db/supabase";
import { getPosts } from "@/server/db/posts";
import type { DashboardAnalytics, RecentActivityItem } from "@/shared/types/analytics";

type CommentMetricRow = {
  post_id: string;
  author_name: string;
  created_at: string;
};

function getReadTime(content: string) {
  return Math.max(1, Math.ceil(content.split(/\s+/).filter(Boolean).length / 180));
}

function startOfDay(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1);
}

function countCommentsByPost(comments: CommentMetricRow[]) {
  return comments.reduce<Record<string, number>>((counts, comment) => {
    counts[comment.post_id] = (counts[comment.post_id] || 0) + 1;
    return counts;
  }, {});
}

function getEmptyWeeklyPosts() {
  return Array.from({ length: 7 }, (_, index) => {
    const date = startOfDay(new Date());
    date.setDate(date.getDate() - (6 - index));

    return {
      label: formatDayLabel(date),
      date: date.toISOString(),
      count: 0
    };
  });
}

export async function getPostLikeState(postId: string) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase.from("posts").select("likes").eq("id", postId).single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    likeCount: Number(data?.likes || 0),
    isLiked: false
  };
}

export async function getDashboardAnalytics(): Promise<DashboardAnalytics> {
  const supabase = createSupabaseClient();
  const posts = await getPosts();
  const postIds = posts.map((post) => post.id);
  const emptyWeeklyPosts = getEmptyWeeklyPosts();

  if (!postIds.length) {
    return {
      posts: [],
      totalBlogs: 0,
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      mostPopular: null,
      weeklyPosts: emptyWeeklyPosts,
      recentActivity: []
    };
  }

  const { data: commentsData, error: commentsError } = await supabase
    .from("comments")
    .select("post_id, author_name, created_at")
    .in("post_id", postIds);

  if (commentsError) {
    throw new Error(commentsError.message);
  }

  const comments = (commentsData || []) as CommentMetricRow[];
  const commentCounts = countCommentsByPost(comments);
  const postById = new Map(posts.map((post) => [post.id, post]));

  const postsWithMetrics = posts.map((post) => ({
    ...post,
    views: Number(post.views || 0),
    likes: Number(post.likes || 0),
    comments: commentCounts[post.id] || 0,
    readTime: getReadTime(post.content)
  }));

  const mostPopular = [...postsWithMetrics].sort((a, b) => b.views - a.views || b.likes - a.likes)[0] || null;

  const weeklyPosts = emptyWeeklyPosts.map((day) => {
    const dayStart = startOfDay(new Date(day.date));
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    return {
      ...day,
      count: posts.filter((post) => {
        const postDate = new Date(post.created_at);
        return postDate >= dayStart && postDate < dayEnd;
      }).length
    };
  });

  const postActivity: RecentActivityItem[] = posts.map((post) => ({
    id: `post-${post.id}`,
    type: "post",
    label: "Published post",
    detail: post.title,
    href: `/posts/${post.id}`,
    createdAt: post.created_at
  }));

  const updateActivity: RecentActivityItem[] = posts
    .filter((post) => new Date(post.updated_at).getTime() > new Date(post.created_at).getTime())
    .map((post) => ({
      id: `update-${post.id}-${post.updated_at}`,
      type: "update",
      label: "Updated post",
      detail: post.title,
      href: `/posts/${post.id}`,
      createdAt: post.updated_at
    }));

  const commentActivity: RecentActivityItem[] = comments.map((comment) => {
    const post = postById.get(comment.post_id);
    return {
      id: `comment-${comment.post_id}-${comment.created_at}`,
      type: "comment",
      label: "New comment",
      detail: post ? `${comment.author_name} commented on ${post.title}` : `${comment.author_name} commented`,
      href: `/posts/${comment.post_id}`,
      createdAt: comment.created_at
    };
  });

  return {
    posts: postsWithMetrics,
    totalBlogs: posts.length,
    totalViews: postsWithMetrics.reduce((sum, post) => sum + post.views, 0),
    totalLikes: postsWithMetrics.reduce((sum, post) => sum + post.likes, 0),
    totalComments: comments.length,
    mostPopular,
    weeklyPosts,
    recentActivity: [...postActivity, ...updateActivity, ...commentActivity]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)
  };
}
