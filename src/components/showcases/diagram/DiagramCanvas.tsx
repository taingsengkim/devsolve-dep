"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Connection,
  type Edge,
  type OnConnect,
  type Node,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  AppWindow,
  Cloud,
  Database,
  GitFork,
  Layers,
  Maximize2,
  Plus,
  RotateCcw,
  Server,
  Sparkles,
  StickyNote,
  Trash2,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { nodeTypes } from "./CustomNodes";
import { DIAGRAM_TEMPLATES } from "./templates";
import type { AppNode, CustomNodeType } from "./types";
import { cn } from "@/lib/utils";

interface DiagramCanvasProps {
  initialNodes?: AppNode[];
  initialEdges?: Edge[];
  onStateChange?: (nodes: AppNode[], edges: Edge[]) => void;
}

export function DiagramCanvas({
  initialNodes = [],
  initialEdges = [],
  onStateChange,
}: DiagramCanvasProps) {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Sync state changes to parent if callback provided
  useEffect(() => {
    onStateChange?.(nodes, edges);
  }, [nodes, edges, onStateChange]);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        animated: true,
        type: "smoothstep",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges],
  );

  const addNode = (type: CustomNodeType) => {
    const id = `node-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const defaultLabels: Record<
      CustomNodeType,
      { label: string; subtext: string; badge: string }
    > = {
      clientNode: {
        label: "Client App",
        subtext: "Web or Mobile Client",
        badge: "Frontend",
      },
      serverNode: {
        label: "API Service",
        subtext: "Handles requests & logic",
        badge: "Backend",
      },
      databaseNode: {
        label: "Database",
        subtext: "Stores application state",
        badge: "Database",
      },
      cloudNode: {
        label: "Cloud Gateway",
        subtext: "Routing & Infrastructure",
        badge: "Cloud",
      },
      decisionNode: {
        label: "Condition?",
        subtext: "",
        badge: "Check",
      },
      noteNode: {
        label: "Step Note",
        subtext: "Key implementation details",
        badge: "Note",
      },
    };

    const config = defaultLabels[type];
    const newNode: AppNode = {
      id,
      type,
      position: {
        x: 250 + Math.random() * 60,
        y: 180 + Math.random() * 60,
      },
      data: {
        label: config.label,
        subtext: config.subtext,
        badge: config.badge,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(id);
  };

  const updateSelectedNode = (key: "label" | "subtext" | "badge", value: string) => {
    if (!selectedNodeId) return;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              [key]: value,
            },
          };
        }
        return node;
      }),
    );
  };

  const deleteSelected = () => {
    if (!selectedNodeId) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
    setEdges((eds) =>
      eds.filter(
        (e) => e.source !== selectedNodeId && e.target !== selectedNodeId,
      ),
    );
    setSelectedNodeId(null);
  };

  const applyTemplate = (templateId: string | null) => {
    if (!templateId) return;
    if (templateId === "blank") {
      clearCanvas();
      return;
    }
    const tpl = DIAGRAM_TEMPLATES.find((t) => t.id === templateId);
    if (tpl) {
      setNodes(tpl.nodes);
      setEdges(tpl.edges);
      setSelectedNodeId(null);
      setTimeout(() => {
        fitView({ padding: 0.25, duration: 300 });
      }, 50);
    }
  };

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background">
      {/* ── Top Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/90 px-4 py-2.5 backdrop-blur-xs">
        {/* Node Creation Palette */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Add Node:
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addNode("clientNode")}
            className="h-8 gap-1.5 rounded-lg border-border bg-background px-2.5 text-xs font-semibold text-foreground hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <AppWindow className="size-3.5 text-blue-500" />
            Client
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addNode("serverNode")}
            className="h-8 gap-1.5 rounded-lg border-border bg-background px-2.5 text-xs font-semibold text-foreground hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400"
          >
            <Server className="size-3.5 text-emerald-500" />
            Server/API
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addNode("databaseNode")}
            className="h-8 gap-1.5 rounded-lg border-border bg-background px-2.5 text-xs font-semibold text-foreground hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400"
          >
            <Database className="size-3.5 text-purple-500" />
            Database
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addNode("cloudNode")}
            className="h-8 gap-1.5 rounded-lg border-border bg-background px-2.5 text-xs font-semibold text-foreground hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400"
          >
            <Cloud className="size-3.5 text-amber-500" />
            Cloud/Gateway
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addNode("decisionNode")}
            className="h-8 gap-1.5 rounded-lg border-border bg-background px-2.5 text-xs font-semibold text-foreground hover:bg-rose-500/10 hover:text-rose-600 dark:hover:text-rose-400"
          >
            <GitFork className="size-3.5 text-rose-500" />
            Decision
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addNode("noteNode")}
            className="h-8 gap-1.5 rounded-lg border-border bg-background px-2.5 text-xs font-semibold text-foreground hover:bg-muted hover:text-foreground"
          >
            <StickyNote className="size-3.5 text-muted-foreground" />
            Note
          </Button>
        </div>

        {/* Template & Reset Actions */}
        <div className="flex items-center gap-2">
          <div className="w-48">
            <Select onValueChange={applyTemplate}>
              <SelectTrigger className="h-8 rounded-lg border-border bg-background text-xs font-semibold">
                <Sparkles className="mr-1.5 size-3.5 text-primary" />
                <SelectValue placeholder="Load template..." />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover">
                <SelectItem value="blank" className="text-xs font-medium text-muted-foreground">
                  Blank Canvas (Clean)
                </SelectItem>
                {DIAGRAM_TEMPLATES.map((tpl) => (
                  <SelectItem key={tpl.id} value={tpl.id} className="text-xs">
                    {tpl.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fitView({ padding: 0.25, duration: 300 })}
            className="h-8 gap-1 rounded-lg px-2 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Fit diagram to viewport"
          >
            <Maximize2 className="size-3.5" />
            Fit View
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearCanvas}
            className="h-8 gap-1 rounded-lg px-2 text-xs font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            title="Clear all nodes"
          >
            <RotateCcw className="size-3.5" />
            Clear
          </Button>
        </div>
      </div>

      {/* ── Main Canvas Viewport ── */}
      <div className="relative flex-1 w-full h-full min-h-0" id="react-flow-diagram-viewport">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => setSelectedNodeId(node.id)}
          onPaneClick={() => setSelectedNodeId(null)}
          fitView={nodes.length > 0}
          className="bg-background"
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: true,
            style: { strokeWidth: 2 },
          }}
        >
          <Background gap={18} size={1.2} className="opacity-40" />
          <Controls
            className="!border-border !bg-card !shadow-md !rounded-xl overflow-hidden [&>button]:!border-border [&>button]:!bg-card [&>button]:!text-foreground hover:[&>button]:!bg-muted"
            showInteractive={false}
          />
          <MiniMap
            zoomable
            pannable
            className="!border-border !bg-card/80 !shadow-md rounded-xl backdrop-blur-xs"
            nodeColor={(n) => {
              if (n.type === "databaseNode") return "#a855f7";
              if (n.type === "serverNode") return "#10b981";
              if (n.type === "cloudNode") return "#f59e0b";
              if (n.type === "decisionNode") return "#f43f5e";
              if (n.type === "clientNode") return "#3b82f6";
              return "#64748b";
            }}
          />
        </ReactFlow>

        {/* ── Empty State Watermark & Quick Actions ── */}
        {nodes.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="pointer-events-auto flex max-w-md flex-col items-center gap-3 rounded-3xl border border-border/80 bg-card/85 p-6 shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">
                  Blank Diagram Canvas
                </h3>
                <p className="text-xs text-muted-foreground">
                  Add nodes using the toolbar above, or load a pre-built architecture template to get started:
                </p>
              </div>
              <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
                {DIAGRAM_TEMPLATES.map((tpl) => (
                  <Button
                    key={tpl.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyTemplate(tpl.id)}
                    className="h-8 rounded-xl border-border bg-background px-3 text-xs font-semibold text-foreground hover:border-primary/50 hover:bg-muted"
                  >
                    {tpl.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Floating Node Inspector ── */}
        {selectedNode && (
          <div className="absolute right-4 top-4 z-20 w-72 rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur-md animate-in fade-in-0 slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Edit Node Properties
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={deleteSelected}
                className="size-7 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                title="Delete node"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>

            <div className="mt-3 space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Label
                </label>
                <Input
                  value={selectedNode.data.label || ""}
                  onChange={(e) => updateSelectedNode("label", e.target.value)}
                  className="h-8 rounded-lg border-border bg-background text-xs"
                  placeholder="Node title"
                />
              </div>

              {selectedNode.type !== "decisionNode" && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Description / Subtext
                  </label>
                  <Input
                    value={selectedNode.data.subtext || ""}
                    onChange={(e) =>
                      updateSelectedNode("subtext", e.target.value)
                    }
                    className="h-8 rounded-lg border-border bg-background text-xs"
                    placeholder="Details or tech stack"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Badge / Tag
                </label>
                <Input
                  value={selectedNode.data.badge || ""}
                  onChange={(e) => updateSelectedNode("badge", e.target.value)}
                  className="h-8 rounded-lg border-border bg-background text-xs"
                  placeholder="e.g. REST, Redis, Auth"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
