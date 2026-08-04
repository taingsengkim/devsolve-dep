"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, Crown, Medal, Users } from "lucide-react";
import { LeaderboardEntry } from "@/lib/types/leaderboard/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ResearcherAvatar from "./ResearcherAvatar";
import RankMovement from "./RankMovement";
import { MEDALS, SEVERITY_STYLES, formatNumber, profileHref } from "./leaderboard-ui";

const PAGE_SIZES = [10, 25, 50];

type Props = {
  entries: LeaderboardEntry[];
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

function RankBadge({ rank }: { rank: number }) {
  const medal = rank <= 3 ? MEDALS[rank - 1] : null;

  if (!medal) {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center text-base font-bold tabular-nums text-slate-400">
        {rank}
      </span>
    );
  }

  const Icon = rank === 1 ? Crown : Medal;

  return (
    <span
      className="inline-flex h-9 w-9 items-center justify-center gap-0.5 rounded-xl text-sm font-bold tabular-nums"
      style={{ backgroundColor: medal.soft, color: medal.ink }}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {rank}
    </span>
  );
}

function ReputationPill({ value, isCurrentUser }: { value: number; isCurrentUser?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums tracking-tight ${
        isCurrentUser ? "bg-blue-600 text-white" : "bg-[#1E293B] text-white"
      }`}
    >
      {formatNumber(value)}
    </span>
  );
}

function Identity({ entry, size = 40 }: { entry: LeaderboardEntry; size?: number }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <ResearcherAvatar
        username={entry.username}
        displayName={entry.displayName}
        avatarUrl={entry.avatarUrl}
        initials={entry.avatarInitials}
        size={size}
      />
      <div className="min-w-0">
        <Link
          href={profileHref(entry.username)}
          className="block truncate text-base font-semibold tracking-tight text-[#1E293B] underline-offset-4 hover:text-blue-700 hover:underline"
        >
          {entry.displayName}
          {entry.isCurrentUser && (
            <span className="ml-2 rounded-md bg-blue-50 px-1.5 py-0.5 align-middle text-xs font-bold uppercase tracking-wide text-blue-700">
              You
            </span>
          )}
        </Link>
        <p className="truncate text-sm text-slate-500">@{entry.username}</p>
      </div>
    </div>
  );
}

export default function LeaderboardTable({
  entries,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(entries.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const visible = entries.slice(start, start + pageSize);

  if (entries.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-[0_0_0_1px_rgba(30,41,59,0.08)]">
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Users className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="text-xl font-bold text-slate-800">No researchers match</h3>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
          Nobody on this board fits the current country, severity and search
          combination. Try widening one of them.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-[0_0_0_1px_rgba(30,41,59,0.08)]">
      {/* ── Desktop table ── */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-225 border-collapse text-left">
          <caption className="sr-only">
            Researchers ranked by reputation points. Aggregate counts only — no
            program or report details are shown.
          </caption>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500">
              <th scope="col" className="py-3 pl-5 pr-3 font-bold">
                Rank
              </th>
              <th scope="col" className="px-3 py-3 font-bold">
                Researcher
              </th>
              <th scope="col" className="hidden px-3 py-3 font-bold xl:table-cell">
                Country
              </th>
              <th scope="col" className="hidden px-3 py-3 font-bold lg:table-cell">
                Top severity
              </th>
              <th scope="col" className="px-3 py-3 text-right font-bold">
                Reports
              </th>
              <th scope="col" className="px-3 py-3 text-right font-bold">
                Valid
              </th>
              <th scope="col" className="px-3 py-3 text-right font-bold">
                Critical
              </th>
              <th scope="col" className="px-3 py-3 text-right font-bold">
                Thanks
              </th>
              <th scope="col" className="px-3 py-3 text-right font-bold">
                Reputation
              </th>
              <th scope="col" className="py-3 pl-3 pr-5">
                <span className="sr-only">Open profile</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((entry, i) => {
              const medal = entry.rank <= 3 ? MEDALS[entry.rank - 1] : null;
              const validRate = Math.round((entry.validReports / entry.totalReports) * 100);

              return (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, delay: Math.min(i, 12) * 0.02, ease: "easeOut" }}
                  className={`group border-b border-slate-100 transition-colors last:border-0 ${
                    entry.isCurrentUser ? "bg-blue-50/60 hover:bg-blue-50" : "hover:bg-slate-50"
                  }`}
                >
                  <td className="py-3.5 pl-5 pr-3">
                    <div className="flex items-center gap-2">
                      {/* Medal accent doubles the rank cue for the top three */}
                      <span
                        aria-hidden
                        className="h-9 w-1 rounded-full"
                        style={{ backgroundColor: medal ? medal.ring : "transparent" }}
                      />
                      <RankBadge rank={entry.rank} />
                      <RankMovement rank={entry.rank} previousRank={entry.previousRank} />
                    </div>
                  </td>

                  <td className="px-3 py-3.5">
                    <Identity entry={entry} />
                  </td>

                  <td className="hidden px-3 py-3.5 xl:table-cell">
                    <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-bold tracking-wide text-slate-600">
                        {entry.countryCode}
                      </span>
                      {entry.countryName}
                    </span>
                  </td>

                  <td className="hidden px-3 py-3.5 lg:table-cell">
                    <span
                      className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-bold ring-1 ring-inset ${
                        SEVERITY_STYLES[entry.topSeverity].chip
                      }`}
                    >
                      {entry.topSeverity}
                    </span>
                  </td>

                  <td className="px-3 py-3.5 text-right text-base font-medium tabular-nums text-slate-600">
                    {formatNumber(entry.totalReports)}
                  </td>

                  <td className="px-3 py-3.5 text-right">
                    <span className="text-base font-semibold tabular-nums text-[#1E293B]">
                      {formatNumber(entry.validReports)}
                    </span>
                    <span className="ml-1.5 text-xs font-medium tabular-nums text-slate-400">
                      {validRate}%
                    </span>
                  </td>

                  <td className="px-3 py-3.5 text-right text-base font-bold tabular-nums text-rose-700">
                    {formatNumber(entry.criticalReports)}
                  </td>

                  <td className="px-3 py-3.5 text-right text-base font-semibold tabular-nums text-emerald-700">
                    {formatNumber(entry.recognitionCount)}
                  </td>

                  <td className="px-3 py-3.5 text-right">
                    <ReputationPill value={entry.reputation} isCurrentUser={entry.isCurrentUser} />
                  </td>

                  <td className="py-3.5 pl-3 pr-5 text-right">
                    <Link
                      href={profileHref(entry.username)}
                      aria-label={`Open ${entry.displayName}'s profile`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 group-hover:text-slate-600"
                    >
                      <ChevronRight
                        className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile list ── */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {visible.map((entry) => {
          const medal = entry.rank <= 3 ? MEDALS[entry.rank - 1] : null;

          return (
            <li
              key={entry.id}
              className={`p-4 ${entry.isCurrentUser ? "bg-blue-50/60" : ""}`}
              style={medal ? { boxShadow: `inset 3px 0 0 0 ${medal.ring}` } : undefined}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <RankBadge rank={entry.rank} />
                  <Identity entry={entry} size={36} />
                </div>
                <ReputationPill value={entry.reputation} isCurrentUser={entry.isCurrentUser} />
              </div>

              <dl className="mt-3 grid grid-cols-4 gap-2 text-center">
                {[
                  { label: "Reports", value: entry.totalReports, tone: "text-slate-700" },
                  { label: "Valid", value: entry.validReports, tone: "text-[#1E293B]" },
                  { label: "Critical", value: entry.criticalReports, tone: "text-rose-700" },
                  { label: "Thanks", value: entry.recognitionCount, tone: "text-emerald-700" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg bg-slate-50 py-2">
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {stat.label}
                    </dt>
                    <dd className={`text-base font-bold tabular-nums ${stat.tone}`}>
                      {formatNumber(stat.value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          );
        })}
      </ul>

      {/* ── Pagination ── */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/60 px-5 py-3 sm:flex-row">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <span>Rows per page</span>
          <Select
            value={String(pageSize)}
            onValueChange={(next) => onPageSizeChange(Number(next))}
          >
            <SelectTrigger
              aria-label="Rows per page"
              className="h-9 w-20 rounded-xl border-slate-300 bg-white text-sm font-medium text-slate-700"
            >
              <SelectValue>{(selected: string) => selected}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-3">
          <p className="text-sm font-medium text-slate-500 tabular-nums">
            {start + 1}–{Math.min(start + pageSize, entries.length)} of {entries.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onPageChange(safePage - 1)}
              disabled={safePage <= 1}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => onPageChange(safePage + 1)}
              disabled={safePage >= totalPages}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
