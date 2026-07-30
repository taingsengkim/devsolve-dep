import { ChevronUp, Eye, MessageSquare, MoreVertical } from "lucide-react";
import { CommunityPost } from "@/lib/types/profile/types";  

interface CommunityPostCardProps {
  post: CommunityPost;
}

const TAG_STYLES: Record<CommunityPost["tag"], string> = {
  Problem: "bg-red-100 text-red-600",
  Solutions: "bg-emerald-100 text-emerald-700",
  Discussion: "bg-blue-100 text-blue-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function CommunityPostCard({ post }: CommunityPostCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex w-8 shrink-0 flex-col items-center gap-0.5 pt-1 text-blue-600">
          <ChevronUp size={18} />
          <span className="text-sm font-semibold">{post.votes}</span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold text-slate-900">{post.title}</h3>
            <div className="flex shrink-0 items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${TAG_STYLES[post.tag]}`}>{post.tag}</span>
              <button className="text-slate-400 hover:text-slate-600" aria-label="More options">
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{post.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <MessageSquare size={13} />
              {post.answers} answers
            </span>
            {post.views !== undefined && (
              <span className="inline-flex items-center gap-1">
                <Eye size={13} />
                {post.views.toLocaleString()}
              </span>
            )}
            {post.isSolved && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-700">Solved</span>
            )}
            <span className="ml-auto">{formatDate(post.date)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}