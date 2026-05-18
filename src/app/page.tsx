import { HomeExperience } from "@/client/components/home/HomeExperience";
import { getPosts } from "@/server/db/posts";

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const posts = await getPosts(q);

  return <HomeExperience posts={posts} query={q || ""} />;
}
