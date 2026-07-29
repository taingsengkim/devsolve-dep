
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Eye,
  MessageSquare,
  ArrowUp,
} from "lucide-react";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DiscussionDetailPage({
  params,
}: Props) {
  const { id } = await params;

  const discussion = {
    id,
    title:
      "JWT token leaks via Referer header on OAuth redirect",
    author: "Alex Mercer",
    date: "Jun 12, 2026",
    category: "Authentication",
    votes: 142,
    comments: 23,
    views: 2841,
    description: `
When using OAuth authentication, some applications include
the JWT token inside the callback URL.

Browsers may send this URL as a Referer header,
which can unintentionally expose sensitive tokens
to third-party resources.
`,
    tags: [
      "jwt",
      "oauth",
      "security",
      "referer",
    ],
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-10">

        <Link
          href="/discussions"
          className="mb-8 inline-flex items-center gap-2 text-blue-600 hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Discussions
        </Link>

        <article className="rounded-2xl border bg-white p-8 shadow-sm">

          <div className="mb-5 flex flex-wrap items-center gap-3">

            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
              {discussion.category}
            </span>

            <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
              Solved
            </span>

          </div>

          <h1 className="text-4xl font-bold">
            {discussion.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-gray-500">

            <span>{discussion.author}</span>

            <span className="flex items-center gap-1">
              <Calendar size={16} />
              {discussion.date}
            </span>

            <span className="flex items-center gap-1">
              <ArrowUp size={16} />
              {discussion.votes}
            </span>

            <span className="flex items-center gap-1">
              <MessageSquare size={16} />
              {discussion.comments}
            </span>

            <span className="flex items-center gap-1">
              <Eye size={16} />
              {discussion.views}
            </span>

          </div>

          <div className="mt-8 whitespace-pre-line leading-8 text-gray-700">
            {discussion.description}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {discussion.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-3 py-1 text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

        </article>
      </div>
    </main>
  );
}