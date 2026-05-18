import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { EditPostExperience } from "@/client/components/blog/EditPostExperience";
import { updatePost } from "@/server/actions/postActions";
import { getPost } from "@/server/db/posts";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, user] = await Promise.all([getPost(id), currentUser()]);

  if (!post) {
    notFound();
  }

  if (!user || post.user_id !== user.id) {
    redirect(`/posts/${id}`);
  }

  const action = updatePost.bind(null, id);

  return <EditPostExperience post={post} action={action} />;
}
