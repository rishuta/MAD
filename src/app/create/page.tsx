import { createPost } from "@/app/create/actions";

export default function CreatePostPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <div className="mb-8">
        <p className="text-sm font-semibold text-neutral-500">Protected page</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Create a new blog post</h1>
        <p className="mt-3 text-neutral-600">
          Only logged-in users can open this page. Your post will be saved in the Supabase posts table.
        </p>
      </div>

      <form action={createPost} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="space-y-5">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-semibold">
              Blog title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="Example: My first blog post"
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label htmlFor="content" className="mb-2 block text-sm font-semibold">
              Blog content
            </label>
            <textarea
              id="content"
              name="content"
              required
              rows={10}
              placeholder="Write your blog content here..."
              className="w-full resize-y rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-black"
            />
          </div>

          <button
            type="submit"
            className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Publish post
          </button>
        </div>
      </form>
    </main>
  );
}
