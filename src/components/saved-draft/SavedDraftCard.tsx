import Image from "next/image";
import { Clock3 } from "lucide-react";

import type { SavedDraftItem } from "@/components/saved-draft/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SavedDraftCardProps = {
  item: SavedDraftItem;
};

function getDraftMeta(item: SavedDraftItem) {
  if (item.category === "problem") {
    return {
      label: "Problem draft",
      badgeClassName: "bg-blue-50 text-blue-600",
    };
  }

  if (item.category === "solution") {
    return {
      label: "Solution draft",
      badgeClassName: "bg-emerald-50 text-emerald-600",
    };
  }

  return {
    label: item.programDraftKind === "response" ? "Response draft" : "Bounty draft",
    badgeClassName:
      item.programDraftKind === "response"
        ? "bg-orange-50 text-orange-600"
        : "bg-violet-50 text-violet-600",
  };
}

export function SavedDraftCard({ item }: SavedDraftCardProps) {
  const meta = getDraftMeta(item);

  return (
    <Card className="rounded-[28px] border border-slate-200 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_18px_rgba(15,23,42,0.07)]">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <Badge className={cn("rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold shadow-none", meta.badgeClassName)}>
            {meta.label}
          </Badge>
          <span className="text-xs font-semibold lowercase tracking-wide text-amber-500">
            draft
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-[0_1px_4px_rgba(15,23,42,0.06)]">
            <Image
              src={item.logoSrc}
              alt={item.logoAlt}
              width={26}
              height={26}
              className="size-6 object-contain"
            />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Clock3 className="size-3.5" />
              Updated {item.updatedAt}
            </p>
          </div>
        </div>

        <p className="line-clamp-3 min-h-[72px] text-sm leading-6 text-slate-500">
          {item.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
