import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { ReaderExperience } from "@/client/components/blog/ReaderExperience";
import { addComment, deletePost, toggleLike } from "@/server/actions/postActions";
import { getPostLikeState } from "@/server/db/analytics";
import { getComments, getPost, getPosts } from "@/server/db/posts";

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, posts, comments, user] = await Promise.all([getPost(id), getPosts(), getComments(id), currentUser()]);

  if (!post) {
    notFound();
  }

  const likeState = await getPostLikeState(id);

  return (
    <ReaderExperience
      post={post}
      related={posts.filter((item) => item.id !== post.id)}
      comments={comments}
      isOwner={user?.id === post.user_id}
      isSignedIn={Boolean(user)}
      likeCount={likeState.likeCount}
      isLiked={likeState.isLiked}
      addCommentAction={addComment.bind(null, id)}
      likeAction={toggleLike.bind(null, id)}
      deleteAction={deletePost.bind(null, id)}
    />
  );
}
