import { UserCheck } from "lucide-react";
import { FollowRecord } from "@/lib/types/profile/types";
import FollowerItem from "./FollowerItem";

interface FollowersListProps {
  total: number;
  items: FollowRecord[];
}

export default function FollowersList({ total, items }: FollowersListProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Followers</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {total} {total === 1 ? "person follows" : "people follow"} you on DevSolve.
        </p>
      </div>

      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => <FollowerItem key={item.id} record={item} />)
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 px-6 text-center shadow-2xs">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mb-3">
              <UserCheck size={24} />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No followers yet</h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              When other community members follow your profile, they will show up here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
