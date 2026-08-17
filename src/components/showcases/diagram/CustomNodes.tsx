"use client";

import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  AppWindow,
  Cloud,
  Database,
  GitFork,
  Layers,
  Server,
  StickyNote,
} from "lucide-react";
import type { AppNode } from "./types";
import { cn } from "@/lib/utils";

const handleStyle =
  "!size-3 !border-2 !border-background !bg-primary transition-all hover:!scale-125 hover:!bg-primary/80";

/** Client / Frontend Node */
export const ClientNode = memo(function ClientNode({
  data,
  selected,
}: NodeProps<AppNode>) {
  return (
    <div
      className={cn(
        "group relative min-w-[180px] max-w-[260px] rounded-xl border bg-card p-3.5 text-card-foreground shadow-sm transition-all duration-200",
        selected
          ? "border-primary ring-2 ring-primary/30 shadow-md"
          : "border-border hover:border-border/80 hover:shadow-md",
      )}
    >
      <Handle type="target" position={Position.Top} className={handleStyle} />
      <Handle type="target" position={Position.Left} className={handleStyle} />

      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
          <AppWindow className="size-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span className="truncate text-sm font-semibold text-foreground">
              {data.label || "Client UI"}
            </span>
            {data.badge && (
              <span className="shrink-0 rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
                {data.badge}
              </span>
            )}
          </div>
          {data.subtext && (
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
              {data.subtext}
            </p>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className={handleStyle} />
      <Handle type="source" position={Position.Right} className={handleStyle} />
    </div>
  );
});

/** Server / API Node */
export const ServerNode = memo(function ServerNode({
  data,
  selected,
}: NodeProps<AppNode>) {
  return (
    <div
      className={cn(
        "group relative min-w-[180px] max-w-[260px] rounded-xl border bg-card p-3.5 text-card-foreground shadow-sm transition-all duration-200",
        selected
          ? "border-emerald-500 ring-2 ring-emerald-500/30 shadow-md"
          : "border-border hover:border-border/80 hover:shadow-md",
      )}
    >
      <Handle type="target" position={Position.Top} className={handleStyle} />
      <Handle type="target" position={Position.Left} className={handleStyle} />

      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
          <Server className="size-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span className="truncate text-sm font-semibold text-foreground">
              {data.label || "Backend API"}
            </span>
            {data.badge && (
              <span className="shrink-0 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                {data.badge}
              </span>
            )}
          </div>
          {data.subtext && (
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
              {data.subtext}
            </p>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className={handleStyle} />
      <Handle type="source" position={Position.Right} className={handleStyle} />
    </div>
  );
});

/** Database / Storage Node */
export const DatabaseNode = memo(function DatabaseNode({
  data,
  selected,
}: NodeProps<AppNode>) {
  return (
    <div
      className={cn(
        "group relative min-w-[180px] max-w-[260px] rounded-xl border bg-card p-3.5 text-card-foreground shadow-sm transition-all duration-200",
        selected
          ? "border-purple-500 ring-2 ring-purple-500/30 shadow-md"
          : "border-border hover:border-border/80 hover:shadow-md",
      )}
    >
      <Handle type="target" position={Position.Top} className={handleStyle} />
      <Handle type="target" position={Position.Left} className={handleStyle} />

      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
          <Database className="size-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span className="truncate text-sm font-semibold text-foreground">
              {data.label || "Database"}
            </span>
            {data.badge && (
              <span className="shrink-0 rounded bg-purple-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-purple-600 dark:bg-purple-500/20 dark:text-purple-400">
                {data.badge}
              </span>
            )}
          </div>
          {data.subtext && (
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
              {data.subtext}
            </p>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className={handleStyle} />
      <Handle type="source" position={Position.Right} className={handleStyle} />
    </div>
  );
});

/** Cloud / Gateway / Queue Node */
export const CloudNode = memo(function CloudNode({
  data,
  selected,
}: NodeProps<AppNode>) {
  return (
    <div
      className={cn(
        "group relative min-w-[180px] max-w-[260px] rounded-xl border bg-card p-3.5 text-card-foreground shadow-sm transition-all duration-200",
        selected
          ? "border-amber-500 ring-2 ring-amber-500/30 shadow-md"
          : "border-border hover:border-border/80 hover:shadow-md",
      )}
    >
      <Handle type="target" position={Position.Top} className={handleStyle} />
      <Handle type="target" position={Position.Left} className={handleStyle} />

      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
          <Cloud className="size-4.5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span className="truncate text-sm font-semibold text-foreground">
              {data.label || "Cloud Gateway"}
            </span>
            {data.badge && (
              <span className="shrink-0 rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
                {data.badge}
              </span>
            )}
          </div>
          {data.subtext && (
            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
              {data.subtext}
            </p>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className={handleStyle} />
      <Handle type="source" position={Position.Right} className={handleStyle} />
    </div>
  );
});

/** Decision / Condition Node */
export const DecisionNode = memo(function DecisionNode({
  data,
  selected,
}: NodeProps<AppNode>) {
  return (
    <div
      className={cn(
        "group relative min-w-[160px] max-w-[220px] rounded-xl border bg-card p-3 text-card-foreground shadow-sm transition-all duration-200",
        selected
          ? "border-rose-500 ring-2 ring-rose-500/30 shadow-md"
          : "border-border hover:border-border/80 hover:shadow-md",
      )}
    >
      <Handle type="target" position={Position.Top} className={handleStyle} />
      <Handle type="target" position={Position.Left} className={handleStyle} />

      <div className="flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
          <GitFork className="size-4" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="truncate text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            {data.badge || "Condition"}
          </span>
          <p className="text-sm font-semibold text-foreground truncate">
            {data.label || "Valid token?"}
          </p>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className={handleStyle} />
      <Handle type="source" position={Position.Right} className={handleStyle} />
    </div>
  );
});

/** Sticky Note / Annotation Node */
export const NoteNode = memo(function NoteNode({
  data,
  selected,
}: NodeProps<AppNode>) {
  return (
    <div
      className={cn(
        "group relative min-w-[180px] max-w-[280px] rounded-xl border bg-muted/70 p-3 text-muted-foreground shadow-xs transition-all duration-200 backdrop-blur-xs",
        selected
          ? "border-primary ring-2 ring-primary/30"
          : "border-border/60 hover:border-border",
      )}
    >
      <Handle type="target" position={Position.Top} className={handleStyle} />
      <div className="flex items-start gap-2">
        <StickyNote className="size-4 shrink-0 text-muted-foreground/80 mt-0.5" />
        <div className="min-w-0 flex-1">
          <span className="block text-xs font-semibold text-foreground">
            {data.label || "Note"}
          </span>
          {data.subtext && (
            <p className="mt-1 text-xs text-muted-foreground whitespace-pre-wrap">
              {data.subtext}
            </p>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className={handleStyle} />
    </div>
  );
});

export const nodeTypes = {
  clientNode: ClientNode,
  serverNode: ServerNode,
  databaseNode: DatabaseNode,
  cloudNode: CloudNode,
  decisionNode: DecisionNode,
  noteNode: NoteNode,
};
