"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SharedReportCardBadgeTone =
  | "type-bounty"
  | "type-response"
  | "status-open"
  | "status-closed"
  | "severity-critical"
  | "severity-high"
  | "severity-medium"
  | "severity-low"
  | "queue-pending"
  | "queue-review"
  | "queue-ready";

type SharedReportCardBadge = {
  label: string;
  tone: SharedReportCardBadgeTone;
};

type SharedReportCardProps = {
  href: string;
  title: string;
  submitter: string;
  reportId: string;
  submittedAt: string;
  summary: string;
  badges: SharedReportCardBadge[];
  assets?: string[];
  logoSrc?: string;
  logoAlt: string;
  fallbackLabel: string;
  variant?: "default" | "compact";
  severity?: "Critical" | "High" | "Medium" | "Low";
  showSeverityAccent?: boolean;
};

function severityAccentClass(severity?: "Critical" | "High" | "Medium" | "Low") {
  if (severity === "Critical") return "bg-red-400";
  if (severity === "High") return "bg-orange-400";
  if (severity === "Medium") return "bg-amber-400";
  if (severity === "Low") return "bg-blue-400";
  return "bg-transparent";
}

function badgeToneClass(tone: SharedReportCardBadgeTone) {
  switch (tone) {
    case "type-bounty":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "type-response":
      return "border-slate-200 bg-slate-100 text-slate-700";
    case "status-open":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "status-closed":
      return "border-slate-200 bg-slate-100 text-slate-600";
    case "severity-critical":
      return "border-red-200 bg-red-50 text-red-700";
    case "severity-high":
      return "border-orange-200 bg-orange-50 text-orange-700";
    case "severity-medium":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "severity-low":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "queue-pending":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "queue-review":
      return "border-blue-200 bg-blue-50 text-blue-700";
    case "queue-ready":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    default:
      return "border-slate-200 bg-slate-100 text-slate-700";
  }
}

export function SharedReportCard({
  href,
  title,
  submitter,
  reportId,
  submittedAt,
  summary,
  badges,
  assets = [],
  logoSrc,
  logoAlt,
  fallbackLabel,
  variant = "default",
  severity,
  showSeverityAccent = true,
}: SharedReportCardProps) {
  const visibleAssets = assets.slice(0, 2);
  const hiddenAssetCount = Math.max(0, assets.length - visibleAssets.length);
  const isCompact = variant === "compact";
  const hasAccent = Boolean(severity) && showSeverityAccent;

  return (
    <Link
      href={href}
      aria-label={`Open report ${title}`}
      className="group block cursor-pointer rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2"
      onKeyDown={(event) => {
        if (event.key === " ") {
          event.preventDefault();
          event.currentTarget.click();
        }
      }}
    >
      <motion.div
        whileHover={{ y: -1.5 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <Card
          className={cn(
            "relative overflow-hidden rounded-[14px] border border-[#E2E8F0] bg-white py-0 shadow-[0_2px_8px_rgba(15,23,42,0.03)] transition-all duration-200 group-hover:border-blue-200 group-hover:shadow-[0_10px_22px_rgba(15,23,42,0.06)] group-focus-visible:border-blue-300",
            isCompact && "shadow-none"
          )}
        >
          {hasAccent ? (
            <span
              className={cn(
                "absolute inset-y-4 left-0 w-[3px] rounded-full",
                severityAccentClass(severity)
              )}
            />
          ) : null}
          <CardContent
            className={cn(
              "px-5 sm:px-6",
              isCompact ? "py-4 sm:py-[18px]" : "py-5 sm:py-5"
            )}
          >
            <div
              className={cn(
                "grid min-w-0 gap-4",
                isCompact
                  ? "lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-5"
                  : "lg:grid-cols-[auto_minmax(0,1fr)_minmax(180px,220px)_auto] lg:items-start"
              )}
            >
              {isCompact ? (
                <>
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
                        {logoSrc ? (
                          <Image
                            src={logoSrc}
                            alt={logoAlt}
                            width={44}
                            height={44}
                            className="size-10 object-contain"
                          />
                        ) : (
                          <span className="text-sm font-semibold text-slate-700">{fallbackLabel}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="space-y-1">
                          <h3 className="truncate text-[17px] font-semibold leading-6 text-[#0F172A]">
                            {title}
                          </h3>
                          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-slate-500">
                            <span>{reportId}</span>
                            <span className="text-slate-300">&bull;</span>
                            <span className="truncate">{submitter}</span>
                            <span className="text-slate-300">&bull;</span>
                            <span>{submittedAt}</span>
                          </p>
                        </div>

                        <p className="line-clamp-1 text-sm leading-6 text-slate-500">{summary}</p>

                        {visibleAssets.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-2">
                            {visibleAssets.map((asset) => (
                              <span
                                key={asset}
                                className="inline-flex max-w-[170px] truncate rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                                title={asset}
                              >
                                {asset}
                              </span>
                            ))}
                            {hiddenAssetCount > 0 ? (
                              <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                                +{hiddenAssetCount} more
                              </span>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 lg:justify-end">
                    <div className="flex flex-wrap items-center justify-end gap-2 lg:max-w-[250px]">
                      {badges.map((badge) => (
                        <Badge
                          key={`${badge.tone}-${badge.label}`}
                          variant="outline"
                          className={cn(
                            "h-6 rounded-full px-2.5 text-[11px] font-medium",
                            badgeToneClass(badge.tone)
                          )}
                        >
                          {badge.label}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex shrink-0 items-center justify-end">
                      <ChevronRight className="size-5 text-slate-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#2563EB]" />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className={cn(
                      "flex shrink-0 items-center justify-center overflow-hidden bg-white",
                      "size-11 rounded-full border border-slate-200 bg-slate-50"
                    )}
                  >
                    {logoSrc ? (
                      <Image
                        src={logoSrc}
                        alt={logoAlt}
                        width={44}
                        height={44}
                        className="size-10 object-contain"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-slate-700">{fallbackLabel}</span>
                    )}
                  </div>

                  <div className="min-w-0 space-y-2">
                    <div className="space-y-1.5">
                      <h3
                        className={cn(
                          "truncate font-semibold leading-6 text-[#0F172A]",
                          "text-[17px] sm:text-[18px]"
                        )}
                      >
                        {title}
                      </h3>
                      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-slate-500">
                        <span>{reportId}</span>
                        <span className="text-slate-300">&bull;</span>
                        <span className="truncate">{submitter}</span>
                        <span className="text-slate-300">&bull;</span>
                        <span>{submittedAt}</span>
                      </p>
                    </div>

                    <p className="line-clamp-2 text-sm leading-6 text-slate-500">{summary}</p>

                    {visibleAssets.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {visibleAssets.map((asset) => (
                          <span
                            key={asset}
                            className="inline-flex max-w-[170px] truncate rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                            title={asset}
                          >
                            {asset}
                          </span>
                        ))}
                        {hiddenAssetCount > 0 ? (
                          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                            +{hiddenAssetCount} more
                          </span>
                        ) : null}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 lg:max-w-[220px] lg:justify-end">
                    {badges.map((badge) => (
                      <Badge
                        key={`${badge.tone}-${badge.label}`}
                        variant="outline"
                        className={cn(
                          "h-6 rounded-full px-2.5 text-[11px] font-medium",
                          badgeToneClass(badge.tone)
                        )}
                      >
                        {badge.label}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex shrink-0 items-center justify-end lg:pl-1">
                    <ChevronRight className="size-5 text-slate-300 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#2563EB]" />
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
