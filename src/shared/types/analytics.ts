import type { BlogPost } from "@/shared/types/blog";

export type DashboardPostMetric = BlogPost & {
  comments: number;
  readTime: number;
};

export type WeeklyMetric = {
  label: string;
  date: string;
  count: number;
};

export type RecentActivityItem = {
  id: string;
  type: "post" | "comment" | "update";
  label: string;
  detail: string;
  href: string;
  createdAt: string;
};

export type DashboardAnalytics = {
  posts: DashboardPostMetric[];
  totalBlogs: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  mostPopular: DashboardPostMetric | null;
  weeklyPosts: WeeklyMetric[];
  recentActivity: RecentActivityItem[];
};
