  "use client";

  import { useMemo, useState } from "react";
  import {
    Download,
    FileArchive,
    FileSpreadsheet,
    FileText,
    Filter,
    Link2,
    MoreHorizontal,
    RotateCcw,
    Search,
    Trash2,
  } from "lucide-react";
  import { motion } from "motion/react";

  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";
  import { Card, CardContent } from "@/components/ui/card";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Input } from "@/components/ui/input";
  import { cn } from "@/lib/utils";

  type ExportStatus = "Ready" | "Processing" | "Failed" | "Expired";
  type ExportFormat = "CSV" | "PDF" | "ZIP";

  type RecentExportItem = {
    id: string;
    title: string;
    createdAt: string;
    detail: string;
    format: ExportFormat;
    fileSize: string;
    status: ExportStatus;
  };

  const RECENT_EXPORTS: RecentExportItem[] = [
    {
      id: "queue-summary-csv",
      title: "Queue summary CSV",
      createdAt: "Jul 29, 2026",
      detail: "Generated for moderation standup",
      format: "CSV",
      fileSize: "2.4 MB",
      status: "Ready",
    },
    {
      id: "approval-audit-pdf",
      title: "Approval audit PDF",
      createdAt: "Jul 28, 2026",
      detail: "Prepared for compliance archive",
      format: "PDF",
      fileSize: "5.8 MB",
      status: "Ready",
    },
    {
      id: "evidence-package-zip",
      title: "Evidence package ZIP",
      createdAt: "Jul 28, 2026",
      detail: "Shared with security operations",
      format: "ZIP",
      fileSize: "38.6 MB",
      status: "Processing",
    },
    {
      id: "severity-review-snapshot",
      title: "Severity review snapshot",
      createdAt: "Jul 27, 2026",
      detail: "Used in weekly incident review",
      format: "PDF",
      fileSize: "1.2 MB",
      status: "Expired",
    },
  ];

  function exportIcon(format: ExportFormat) {
    if (format === "CSV") return FileSpreadsheet;
    if (format === "ZIP") return FileArchive;
    return FileText;
  }

  function statusBadgeClass(status: ExportStatus) {
    if (status === "Ready") return "border-emerald-200 bg-emerald-50 text-emerald-700";
    if (status === "Processing") return "border-blue-200 bg-blue-50 text-blue-700";
    if (status === "Failed") return "border-red-200 bg-red-50 text-red-600";
    return "border-slate-200 bg-slate-100 text-slate-600";
  }

  function toTimeValue(dateLabel: string) {
    return new Date(dateLabel).getTime();
  }

  export function RecentExports() {
    const [searchTerm, setSearchTerm] = useState("");
    const [formatFilter, setFormatFilter] = useState<"All" | ExportFormat>("All");
    const [statusFilter, setStatusFilter] = useState<"All" | ExportStatus>("All");
    const [dateFilter, setDateFilter] = useState<"All time" | "Last 7 days" | "Last 30 days">(
      "All time"
    );
    const [sortBy, setSortBy] = useState<"Newest first" | "Oldest first">("Newest first");

    const filteredExports = useMemo(() => {
      const now = new Date("Jul 31, 2026").getTime();

      return RECENT_EXPORTS.filter((item) => {
        const matchesSearch =
          searchTerm.trim().length === 0 ||
          `${item.title} ${item.detail}`.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFormat = formatFilter === "All" || item.format === formatFilter;
        const matchesStatus = statusFilter === "All" || item.status === statusFilter;

        const itemTime = toTimeValue(item.createdAt);
        const matchesDate =
          dateFilter === "All time" ||
          (dateFilter === "Last 7 days" && now - itemTime <= 7 * 24 * 60 * 60 * 1000) ||
          (dateFilter === "Last 30 days" && now - itemTime <= 30 * 24 * 60 * 60 * 1000);

        return matchesSearch && matchesFormat && matchesStatus && matchesDate;
      }).sort((a, b) =>
        sortBy === "Newest first"
          ? toTimeValue(b.createdAt) - toTimeValue(a.createdAt)
          : toTimeValue(a.createdAt) - toTimeValue(b.createdAt)
      );
    }, [dateFilter, formatFilter, searchTerm, sortBy, statusFilter]);

    return (
      <section className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <h2 className="text-[22px] font-semibold tracking-[-0.02em] text-[#0F172A]">
              Recent exports
            </h2>
            <p className="text-sm leading-6 text-[#64748B]">
              Track generated files, download ready packages, and regenerate exports when needed.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <span>{filteredExports.length} results</span>
            <span className="text-slate-300">/</span>
            <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
              Sort by
              <select
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value as "Newest first" | "Oldest first")
                }
                className="bg-transparent text-sm font-medium text-slate-700 outline-none"
              >
                <option>Newest first</option>
                <option>Oldest first</option>
              </select>
            </label>
          </div>
        </div>

        <Card className="rounded-[14px] border border-[#E2E8F0] bg-white py-0 shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
          <CardContent className="space-y-4 p-4 sm:p-5">
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search export name or note..."
                  className="h-11 rounded-xl border border-slate-200 bg-white pr-3 pl-9 text-sm text-slate-700 focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
                />
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <SelectFilter
                    label="File type"
                    value={formatFilter}
                    onChange={(value) => setFormatFilter(value as "All" | ExportFormat)}
                    options={["All", "CSV", "PDF", "ZIP"]}
                  />
                  <SelectFilter
                    label="Status"
                    value={statusFilter}
                    onChange={(value) => setStatusFilter(value as "All" | ExportStatus)}
                    options={["All", "Ready", "Processing", "Failed", "Expired"]}
                  />
                  <SelectFilter
                    label="Date"
                    value={dateFilter}
                    onChange={(value) =>
                      setDateFilter(value as "All time" | "Last 7 days" | "Last 30 days")
                    }
                    options={["All time", "Last 7 days", "Last 30 days"]}
                  />
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  className="h-10 rounded-xl px-3 text-slate-500 hover:bg-blue-50 hover:text-[#2563EB]"
                >
                  <Filter data-icon="inline-start" />
                  Filters
                </Button>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="hidden grid-cols-[minmax(0,2fr)_110px_130px_110px_120px_110px] items-center gap-4 border-b border-slate-200 bg-slate-50/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 lg:grid">
                <span>Export name</span>
                <span>Format</span>
                <span>Created</span>
                <span>File size</span>
                <span>Status</span>
                <span className="text-right">Action</span>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredExports.length === 0 ? (
                  <div className="px-4 py-12 text-center text-sm text-slate-500">
                    No exports match the current search and filter settings.
                  </div>
                ) : (
                  filteredExports.map((item) => {
                    const Icon = exportIcon(item.format);
                    const readyToDownload = item.status === "Ready";

                    return (
                      <motion.div
                        key={item.id}
                        whileHover={{ y: -1 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        className="grid gap-4 px-4 py-4 lg:grid-cols-[minmax(0,2fr)_110px_130px_110px_120px_110px] lg:items-center"
                      >
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                            <Icon className="size-4.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#0F172A] sm:text-[15px]">
                              {item.title}
                            </p>
                            <p className="mt-1 truncate text-sm text-[#64748B]">
                              {item.detail}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 lg:block">
                          <span className="text-xs font-medium uppercase tracking-[0.1em] text-slate-400 lg:hidden">
                            Format
                          </span>
                          <Badge
                            variant="outline"
                            className="rounded-full border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                          >
                            {item.format}
                          </Badge>
                        </div>

                        <DataCell label="Created">{item.createdAt}</DataCell>
                        <DataCell label="File size">{item.fileSize}</DataCell>

                        <div className="flex items-center gap-2 lg:block">
                          <span className="text-xs font-medium uppercase tracking-[0.1em] text-slate-400 lg:hidden">
                            Status
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                              statusBadgeClass(item.status)
                            )}
                          >
                            {item.status}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between gap-2 lg:justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            disabled={!readyToDownload}
                            className="rounded-xl border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB] disabled:opacity-40"
                            aria-label={`Download ${item.title}`}
                          >
                            <Download className="size-4" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger
                              aria-label={`More actions for ${item.title}`}
                              className="inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-[0_1px_3px_rgba(15,23,42,0.03)] transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20"
                            >
                              <MoreHorizontal className="size-4.5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              sideOffset={8}
                              className="w-52 rounded-xl border border-[#E2E8F0] bg-white p-1 shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
                            >
                              <DropdownMenuItem className="rounded-[10px] px-3 py-2.5 text-slate-700 focus:bg-blue-50 focus:text-[#2563EB]">
                                <Download className="size-4" />
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-[10px] px-3 py-2.5 text-slate-700 focus:bg-blue-50 focus:text-[#2563EB]">
                                <RotateCcw className="size-4" />
                                Regenerate
                              </DropdownMenuItem>
                              <DropdownMenuItem className="rounded-[10px] px-3 py-2.5 text-slate-700 focus:bg-blue-50 focus:text-[#2563EB]">
                                <Link2 className="size-4" />
                                Copy link
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="my-1 bg-slate-200" />
                              <DropdownMenuItem
                                variant="destructive"
                                className="rounded-[10px] px-3 py-2.5 text-red-600 focus:bg-red-50 focus:text-red-600"
                              >
                                <Trash2 className="size-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  function SelectFilter({
    label,
    value,
    onChange,
    options,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
  }) {
    return (
      <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <span>{label}</span>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="bg-transparent text-sm font-medium text-slate-700 outline-none"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    );
  }

  function DataCell({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="flex items-center gap-2 text-sm text-[#64748B] lg:block">
        <span className="text-xs font-medium uppercase tracking-[0.1em] text-slate-400 lg:hidden">
          {label}
        </span>
        <span>{children}</span>
      </div>
    );
  }
