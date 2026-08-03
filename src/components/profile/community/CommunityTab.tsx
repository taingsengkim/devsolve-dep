import { CommunityPost } from "@/lib/types/profile/types";
import CommunityPostCard from "./CommunityPostCard";

interface CommunityTabProps {
  posts: CommunityPost[];
}

export default function CommunityTab({ posts }: CommunityTabProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
        No discussions or write-ups yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <CommunityPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}