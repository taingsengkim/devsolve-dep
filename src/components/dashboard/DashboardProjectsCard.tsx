"use client";

import { motion } from "motion/react";
import {
  ChevronDown,
  Columns3,
  ExternalLink,
  ListFilter,
  Search,
} from "lucide-react";

import {
  DASHBOARD_COLUMNS,
  DASHBOARD_STATUS_OPTIONS,
} from "@/components/dashboard/mock-data";
import type {
  DashboardProject,
  DashboardStatusFilter,
  DashboardVisibleColumn,
} from "@/components/dashboard/types";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type DashboardProjectsCardProps = {
  projects: DashboardProject[];
  totalProjects: number;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  statusFilter: DashboardStatusFilter;
  onStatusFilterChange: (value: DashboardStatusFilter) => void;
  visibleColumns: Set<DashboardVisibleColumn>;
  onToggleColumn: (column: DashboardVisibleColumn) => void;
};

function statusBadgeClass(status: DashboardProject["status"]["variant"]) {
  if (status === "active") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (status === "reviewing") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-100 text-slate-700";
}

export function DashboardProjectsCard({
  projects,
  totalProjects,
  searchTerm,
  onSearchTermChange,
  statusFilter,
  onStatusFilterChange,
  visibleColumns,
  onToggleColumn,
}: DashboardProjectsCardProps) {
  const activeStatusLabel =
    DASHBOARD_STATUS_OPTIONS.find((option) => option.value === statusFilter)
      ?.label ?? "All statuses";

  return (
    <Card className="border border-slate-200/80 bg-white shadow-sm">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-2">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-950">
            Project workspace table
          </CardTitle>
          <CardDescription className="text-base text-slate-500">
            Filter work by repository, stack, and squad ownership while keeping
            the most important columns visible.
          </CardDescription>
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(event) => onSearchTermChange(event.target.value)}
              placeholder="Filter by stack, team, or repository..."
              className="h-11 rounded-full border-slate-200 bg-white pl-10 text-base shadow-none focus-visible:ring-2 focus-visible:ring-blue-600/20"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    className="justify-between rounded-full border-slate-300 bg-white"
                  />
                }
              >
                <ListFilter data-icon="inline-start" />
                {activeStatusLabel}
                <ChevronDown data-icon="inline-end" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuRadioGroup
                    value={statusFilter}
                    onValueChange={(value) =>
                      onStatusFilterChange(value as DashboardStatusFilter)
                    }
                  >
                    {DASHBOARD_STATUS_OPTIONS.map((option) => (
                      <DropdownMenuRadioItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    className="justify-between rounded-full border-slate-300 bg-white"
                  />
                }
              >
                <Columns3 data-icon="inline-start" />
                Columns
                <ChevronDown data-icon="inline-end" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Toggle visible columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {DASHBOARD_COLUMNS.map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.key}
                      checked={visibleColumns.has(column.key)}
                      closeOnClick={false}
                      onCheckedChange={() => onToggleColumn(column.key)}
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow className="border-slate-200/80 hover:bg-slate-50/80">
              {DASHBOARD_COLUMNS.filter((column) =>
                visibleColumns.has(column.key)
              ).map((column) => (
                <TableHead
                  key={column.key}
                  className="px-6 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500"
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={visibleColumns.size}
                  className="h-32 px-6 text-center text-base text-slate-500"
                >
                  No workspaces match the current filters.
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project, index) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50/70"
                >
                  {visibleColumns.has("name") && (
                    <TableCell className="px-6 py-4 align-top">
                      <div className="flex min-w-[220px] flex-col gap-1">
                        <span className="text-base font-semibold text-slate-950">
                          {project.name}
                        </span>
                        <span className="text-sm text-slate-500">
                          Workspace {project.id}
                        </span>
                      </div>
                    </TableCell>
                  )}

                  {visibleColumns.has("repository") && (
                    <TableCell className="px-6 py-4 align-top">
                      <a
                        href={`https://${project.repository}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex max-w-[260px] items-center gap-2 text-sm text-slate-600 transition-colors hover:text-blue-700"
                      >
                        <span className="truncate">{project.repository}</span>
                        <ExternalLink className="size-3.5 shrink-0" />
                      </a>
                    </TableCell>
                  )}

                  {visibleColumns.has("team") && (
                    <TableCell className="px-6 py-4 text-sm font-medium text-slate-700">
                      {project.team}
                    </TableCell>
                  )}

                  {visibleColumns.has("tech") && (
                    <TableCell className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className="border-slate-200 bg-slate-50 text-slate-700"
                      >
                        {project.tech}
                      </Badge>
                    </TableCell>
                  )}

                  {visibleColumns.has("createdAt") && (
                    <TableCell className="px-6 py-4 text-sm text-slate-600">
                      {project.createdAt}
                    </TableCell>
                  )}

                  {visibleColumns.has("contributors") && (
                    <TableCell className="px-6 py-4">
                      <AvatarGroup>
                        {project.contributors.slice(0, 3).map((contributor) => (
                          <Avatar key={contributor.name} size="sm">
                            <AvatarFallback
                              className={`text-xs font-semibold ${contributor.tone}`}
                            >
                              {contributor.fallback}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {project.contributors.length > 3 ? (
                          <AvatarGroupCount>
                            +{project.contributors.length - 3}
                          </AvatarGroupCount>
                        ) : null}
                      </AvatarGroup>
                    </TableCell>
                  )}

                  {visibleColumns.has("status") && (
                    <TableCell className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={statusBadgeClass(project.status.variant)}
                      >
                        {project.status.text}
                      </Badge>
                    </TableCell>
                  )}
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <CardFooter className="justify-between border-t border-slate-100 pt-4">
        <p className="text-sm text-slate-500">
          Showing {projects.length} of {totalProjects} workspaces
        </p>
        <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
          Minimal operations list
        </Badge>
      </CardFooter>
    </Card>
  );
}
