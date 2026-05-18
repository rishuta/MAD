import Image from "next/image";

type BlogCardProps = {
  title: string;
  content: string;
  imageUrl?: string | null;
  createdAt?: string;
};

function createPreview(content: string) {
  if (content.length <= 120) {
    return content;
  }

  return `${content.slice(0, 120)}...`;
}

function formatDate(date?: string) {
  if (!date) {
    return "";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

export function BlogCard({ title, content, imageUrl, createdAt }: BlogCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-48 w-full">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover" sizes="(min-width: 768px) 33vw, 100vw" />
        ) : (
          <div className="flex h-full items-center justify-center bg-neutral-100 text-sm font-semibold text-neutral-500">
            No cover image
          </div>
        )}
      </div>
      <div className="p-5">
        {createdAt ? <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">{formatDate(createdAt)}</p> : null}
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-neutral-600">{createPreview(content)}</p>
      </div>
    </article>
  );
}
