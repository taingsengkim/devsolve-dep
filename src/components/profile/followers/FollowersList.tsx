import { FollowRecord } from "@/lib/types/profile/types";
import FollowerItem from "./FollowerItem";

interface FollowersListProps {
  total: number;
  items: FollowRecord[];
}

export default function FollowersList({ total, items }: FollowersListProps) {
  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Followers</h2>
        <p className="mt-1 text-sm text-slate-500">
          {total} {total === 1 ? "person follows" : "people follow"} you on DevSolve.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {items.length > 0 ? (
          items.map((item) => <FollowerItem key={item.id} record={item} />)
        ) : (
          <p className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-400">
            No followers yet.
          </p>
        )}
      </div>
    </div>
  );
}
