export type BlogPost = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  category: string | null;
  tags: string[];
  views: number;
  likes: number;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type BlogComment = {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  author_email: string | null;
  content: string;
  created_at: string;
};
