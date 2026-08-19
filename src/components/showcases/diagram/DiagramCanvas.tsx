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
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  AppWindow,
  Cloud,
  Database,
  GitFork,
  Key,
  Link2,
  Maximize2,
  Plus,
  RotateCcw,
  Server,
  Sparkles,
  StickyNote,
  Table2,
  Trash2,
  Workflow,
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
import type { AppNode, CustomNodeType, ErdColumn } from "./types";
import { cn } from "@/lib/utils";

const SQL_DATA_TYPES = [
  "UUID",
  "VARCHAR(255)",
  "BIGINT",
  "INTEGER",
  "BOOLEAN",
  "TIMESTAMP",
  "TEXT",
  "JSONB",
  "NUMERIC(10,2)",
  "DATE",
];

const COLOR_THEMES: Array<{
  id: "emerald" | "blue" | "purple" | "amber" | "indigo" | "cyan" | "rose" | "slate";
  label: string;
  bgClass: string;
}> = [
  { id: "emerald", label: "Emerald", bgClass: "bg-emerald-500" },
  { id: "blue", label: "Blue", bgClass: "bg-blue-500" },
  { id: "purple", label: "Purple", bgClass: "bg-purple-500" },
  { id: "amber", label: "Amber", bgClass: "bg-amber-500" },
  { id: "indigo", label: "Indigo", bgClass: "bg-indigo-500" },
  { id: "cyan", label: "Cyan", bgClass: "bg-cyan-500" },
  { id: "rose", label: "Rose", bgClass: "bg-rose-500" },
  { id: "slate", label: "Slate", bgClass: "bg-slate-500" },
];

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
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // Sync state changes to parent if callback provided
  useEffect(() => {
    onStateChange?.(nodes, edges);
  }, [nodes, edges, onStateChange]);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId],
  );

  const selectedEdge = useMemo(
    () => edges.find((e) => e.id === selectedEdgeId) ?? null,
    [edges, selectedEdgeId],
  );

  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        animated: false,
        type: "smoothstep",
        label: "",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
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
      tableNode: {
        label: "new_table",
        subtext: "Database table entity",
        badge: "TABLE",
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
        ...(type === "tableNode"
          ? {
              tableName: config.label,
              colorTheme: "emerald",
              columns: [
                { id: `col-${Date.now()}-1`, name: "id", type: "UUID", isPk: true },
                { id: `col-${Date.now()}-2`, name: "created_at", type: "TIMESTAMP" },
              ],
            }
          : {}),
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
  };

  const addErdTable = (preset?: "users" | "orders" | "products" | "custom") => {
    const id = `tbl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    let tableName = "new_table";
    let subtext = "Entity schema table";
    let colorTheme: "emerald" | "blue" | "purple" | "amber" | "indigo" | "cyan" = "emerald";
    let columns: ErdColumn[] = [
      { id: `c-${Date.now()}-1`, name: "id", type: "UUID", isPk: true },
      { id: `c-${Date.now()}-2`, name: "created_at", type: "TIMESTAMP" },
    ];

    if (preset === "users") {
      tableName = "users";
      subtext = "User authentication and profile entity";
      colorTheme = "blue";
      columns = [
        { id: `c-${Date.now()}-1`, name: "id", type: "UUID", isPk: true },
        { id: `c-${Date.now()}-2`, name: "email", type: "VARCHAR(255)", isUnique: true },
        { id: `c-${Date.now()}-3`, name: "username", type: "VARCHAR(60)", isUnique: true },
        { id: `c-${Date.now()}-4`, name: "created_at", type: "TIMESTAMP" },
      ];
    } else if (preset === "orders") {
      tableName = "orders";
      subtext = "Customer checkout orders";
      colorTheme = "indigo";
      columns = [
        { id: `c-${Date.now()}-1`, name: "id", type: "UUID", isPk: true },
        { id: `c-${Date.now()}-2`, name: "user_id", type: "UUID", isFk: true },
        { id: `c-${Date.now()}-3`, name: "total_amount", type: "NUMERIC(12,2)" },
        { id: `c-${Date.now()}-4`, name: "status", type: "VARCHAR(50)" },
        { id: `c-${Date.now()}-5`, name: "created_at", type: "TIMESTAMP" },
      ];
    } else if (preset === "products") {
      tableName = "products";
      subtext = "Store catalog items";
      colorTheme = "emerald";
      columns = [
        { id: `c-${Date.now()}-1`, name: "id", type: "UUID", isPk: true },
        { id: `c-${Date.now()}-2`, name: "title", type: "VARCHAR(200)" },
        { id: `c-${Date.now()}-3`, name: "price", type: "NUMERIC(10,2)" },
        { id: `c-${Date.now()}-4`, name: "stock_quantity", type: "INTEGER" },
        { id: `c-${Date.now()}-5`, name: "created_at", type: "TIMESTAMP" },
      ];
    }

    const newNode: AppNode = {
      id,
      type: "tableNode",
      position: {
        x: 220 + Math.random() * 80,
        y: 150 + Math.random() * 80,
      },
      data: {
        label: tableName,
        tableName,
        subtext,
        badge: "TABLE",
        colorTheme,
        columns,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
  };

  const updateSelectedNode = (key: string, value: unknown) => {
    if (!selectedNodeId) return;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          const updatedData = {
            ...node.data,
            [key]: value,
          };
          if (key === "tableName" && typeof value === "string") {
            updatedData.label = value;
          }
          return {
            ...node,
            data: updatedData,
          };
        }
        return node;
      }),
    );
  };

  const updateColumn = (colId: string, patch: Partial<ErdColumn>) => {
    if (!selectedNodeId) return;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          const cols = node.data.columns || [];
          const nextCols = cols.map((col) =>
            col.id === colId ? { ...col, ...patch } : col,
          );
          return {
            ...node,
            data: {
              ...node.data,
              columns: nextCols,
            },
          };
        }
        return node;
      }),
    );
  };

  const addColumnToSelectedNode = () => {
    if (!selectedNodeId) return;
    const newCol: ErdColumn = {
      id: `col-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      name: "new_field",
      type: "VARCHAR(255)",
    };
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          const cols = node.data.columns || [];
          return {
            ...node,
            data: {
              ...node.data,
              columns: [...cols, newCol],
            },
          };
        }
        return node;
      }),
    );
  };

  const addPresetColumn = (preset: { name: string; type: string; isPk?: boolean; isFk?: boolean }) => {
    if (!selectedNodeId) return;
    const newCol: ErdColumn = {
      id: `col-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      name: preset.name,
      type: preset.type,
      isPk: preset.isPk,
      isFk: preset.isFk,
    };
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          const cols = node.data.columns || [];
          return {
            ...node,
            data: {
              ...node.data,
              columns: [...cols, newCol],
            },
          };
        }
        return node;
      }),
    );
  };

  const removeColumn = (colId: string) => {
    if (!selectedNodeId) return;
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          const cols = node.data.columns || [];
          return {
            ...node,
            data: {
              ...node.data,
              columns: cols.filter((c) => c.id !== colId),
            },
          };
        }
        return node;
      }),
    );
  };

  const updateSelectedEdge = (patch: Partial<Edge>) => {
    if (!selectedEdgeId) return;
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === selectedEdgeId) {
          return { ...edge, ...patch };
        }
        return edge;
      }),
    );
  };

  const deleteSelected = () => {
    if (selectedNodeId) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
      setEdges((eds) =>
        eds.filter(
          (e) => e.source !== selectedNodeId && e.target !== selectedNodeId,
        ),
      );
      setSelectedNodeId(null);
    } else if (selectedEdgeId) {
      setEdges((eds) => eds.filter((e) => e.id !== selectedEdgeId));
      setSelectedEdgeId(null);
    }
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
      setSelectedEdgeId(null);
      setTimeout(() => {
        fitView({ padding: 0.25, duration: 300 });
      }, 50);
    }
  };

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background">
      {/* ── Top Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/90 px-4 py-2.5 backdrop-blur-xs">
        {/* Node Creation Palette */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Add:
          </span>

          {/* ERD Table Node Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addErdTable()}
            className="h-8 gap-1.5 rounded-lg border-emerald-500/40 bg-emerald-500/10 px-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-300 shadow-xs"
          >
            <Table2 className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            + Table (ERD)
          </Button>

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
          <div className="w-56">
            <Select onValueChange={applyTemplate}>
              <SelectTrigger className="h-8 rounded-lg border-border bg-background text-xs font-semibold">
                <Sparkles className="mr-1.5 size-3.5 text-primary" />
                <SelectValue placeholder="Load template..." />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover">
                <SelectItem value="blank" className="text-xs font-medium text-muted-foreground">
                  Blank Canvas (Clean)
                </SelectItem>
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                  Database ERD Schemas
                </div>
                {DIAGRAM_TEMPLATES.filter((t) => t.id.startsWith("erd-")).map((tpl) => (
                  <SelectItem key={tpl.id} value={tpl.id} className="text-xs">
                    {tpl.name}
                  </SelectItem>
                ))}
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
                  Architecture & Flows
                </div>
                {DIAGRAM_TEMPLATES.filter((t) => !t.id.startsWith("erd-")).map((tpl) => (
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
          onNodeClick={(_, node) => {
            setSelectedNodeId(node.id);
            setSelectedEdgeId(null);
          }}
          onEdgeClick={(_, edge) => {
            setSelectedEdgeId(edge.id);
            setSelectedNodeId(null);
          }}
          onPaneClick={() => {
            setSelectedNodeId(null);
            setSelectedEdgeId(null);
          }}
          fitView={nodes.length > 0}
          className="bg-background"
          defaultEdgeOptions={{
            type: "smoothstep",
            animated: false,
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
              if (n.type === "tableNode") return "#10b981";
              if (n.type === "databaseNode") return "#a855f7";
              if (n.type === "serverNode") return "#3b82f6";
              if (n.type === "cloudNode") return "#f59e0b";
              if (n.type === "decisionNode") return "#f43f5e";
              if (n.type === "clientNode") return "#06b6d4";
              return "#64748b";
            }}
          />
        </ReactFlow>

        {/* ── Empty State Watermark & Quick Actions ── */}
        {nodes.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="pointer-events-auto flex max-w-lg flex-col items-center gap-3.5 rounded-3xl border border-border/80 bg-card/85 p-6 shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-200">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Workflow className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">
                  Diagram & ERD Schema Builder
                </h3>
                <p className="text-xs text-muted-foreground">
                  Draw database schemas (ERD) with relational tables and columns, or construct system architecture diagrams:
                </p>
              </div>

              {/* Quick ERD Presets */}
              <div className="w-full pt-1 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-left">
                  ERD Database Templates:
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyTemplate("erd-ecommerce")}
                    className="h-8 rounded-xl border-emerald-500/30 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20"
                  >
                    🛒 E-Commerce ERD
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => applyTemplate("erd-devsolve")}
                    className="h-8 rounded-xl border-blue-500/30 bg-blue-500/10 px-3 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-500/20"
                  >
                    💡 DevSolve Platform ERD
                  </Button>
                </div>

                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-left pt-1">
                  Architecture Templates:
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {DIAGRAM_TEMPLATES.filter((t) => !t.id.startsWith("erd-")).map((tpl) => (
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
          </div>
        )}

        {/* ── Floating ERD Table Node Inspector ── */}
        {selectedNode && selectedNode.type === "tableNode" && (
          <div className="absolute right-4 top-4 z-20 w-84 max-h-[calc(100%-2rem)] overflow-y-auto rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur-md animate-in fade-in-0 slide-in-from-right-4 duration-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Table2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  ERD Table Properties
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={deleteSelected}
                className="size-7 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                title="Delete table"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>

            {/* Table Name & Comment */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase font-mono">
                  Table Name
                </label>
                <Input
                  value={selectedNode.data.tableName || selectedNode.data.label || ""}
                  onChange={(e) => updateSelectedNode("tableName", e.target.value)}
                  className="h-8 rounded-lg border-border bg-background font-mono text-xs font-bold"
                  placeholder="e.g. users, orders"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Description / Table Comment
                </label>
                <Input
                  value={selectedNode.data.subtext || ""}
                  onChange={(e) => updateSelectedNode("subtext", e.target.value)}
                  className="h-8 rounded-lg border-border bg-background text-xs"
                  placeholder="e.g. Store customer checkout details"
                />
              </div>

              {/* Color Theme Selector */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Header Color Theme
                </label>
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {COLOR_THEMES.map((th) => (
                    <button
                      key={th.id}
                      type="button"
                      onClick={() => updateSelectedNode("colorTheme", th.id)}
                      className={cn(
                        "size-5 rounded-full transition-transform hover:scale-110",
                        th.bgClass,
                        (selectedNode.data.colorTheme || "emerald") === th.id
                          ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110"
                          : "opacity-80 hover:opacity-100",
                      )}
                      title={th.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Columns Manager */}
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
                  Columns ({(selectedNode.data.columns || []).length})
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addColumnToSelectedNode}
                  className="h-7 gap-1 rounded-lg border-border bg-background px-2 text-[11px] font-semibold hover:bg-muted"
                >
                  <Plus className="size-3" />
                  Add Column
                </Button>
              </div>

              {/* Column list items */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {(selectedNode.data.columns || []).map((col) => (
                  <div
                    key={col.id}
                    className="rounded-xl border border-border/80 bg-background/80 p-2 space-y-2"
                  >
                    <div className="flex items-center gap-1.5">
                      <Input
                        value={col.name}
                        onChange={(e) => updateColumn(col.id, { name: e.target.value })}
                        placeholder="column_name"
                        className="h-7 min-w-0 flex-1 font-mono text-xs"
                      />
                      <div className="w-28 shrink-0">
                        <Select
                          value={col.type}
                          onValueChange={(val: string | null) =>
                            updateColumn(col.id, { type: val ?? "VARCHAR(255)" })
                          }
                        >
                          <SelectTrigger className="h-7 rounded-lg border-border bg-background font-mono text-[11px]">
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent className="border-border bg-popover">
                            {SQL_DATA_TYPES.map((t) => (
                              <SelectItem key={t} value={t} className="font-mono text-xs">
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeColumn(col.id)}
                        className="size-7 shrink-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        title="Remove column"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>

                    {/* Column flags (PK, FK, Nullable, Unique) */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => updateColumn(col.id, { isPk: !col.isPk })}
                        className={cn(
                          "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold font-mono transition-colors",
                          col.isPk
                            ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted",
                        )}
                        title="Toggle Primary Key"
                      >
                        <Key className="size-2.5" />
                        PK
                      </button>

                      <button
                        type="button"
                        onClick={() => updateColumn(col.id, { isFk: !col.isFk })}
                        className={cn(
                          "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold font-mono transition-colors",
                          col.isFk
                            ? "bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/40"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted",
                        )}
                        title="Toggle Foreign Key"
                      >
                        <Link2 className="size-2.5" />
                        FK
                      </button>

                      <button
                        type="button"
                        onClick={() => updateColumn(col.id, { isNullable: !col.isNullable })}
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-mono transition-colors",
                          col.isNullable
                            ? "bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/40 font-bold"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted",
                        )}
                        title="Toggle Nullable"
                      >
                        NULL
                      </button>

                      <button
                        type="button"
                        onClick={() => updateColumn(col.id, { isUnique: !col.isUnique })}
                        className={cn(
                          "rounded-md px-1.5 py-0.5 text-[10px] font-mono transition-colors",
                          col.isUnique
                            ? "bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 font-bold"
                            : "bg-muted/60 text-muted-foreground hover:bg-muted",
                        )}
                        title="Toggle Unique constraint"
                      >
                        UQ
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Field Presets */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Quick Add Common Fields:
                </span>
                <div className="flex flex-wrap gap-1">
                  <button
                    type="button"
                    onClick={() => addPresetColumn({ name: "id", type: "UUID", isPk: true })}
                    className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground hover:bg-primary/15 hover:text-primary"
                  >
                    + id (PK)
                  </button>
                  <button
                    type="button"
                    onClick={() => addPresetColumn({ name: "user_id", type: "UUID", isFk: true })}
                    className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground hover:bg-primary/15 hover:text-primary"
                  >
                    + user_id (FK)
                  </button>
                  <button
                    type="button"
                    onClick={() => addPresetColumn({ name: "created_at", type: "TIMESTAMP" })}
                    className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground hover:bg-primary/15 hover:text-primary"
                  >
                    + created_at
                  </button>
                  <button
                    type="button"
                    onClick={() => addPresetColumn({ name: "updated_at", type: "TIMESTAMP" })}
                    className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground hover:bg-primary/15 hover:text-primary"
                  >
                    + updated_at
                  </button>
                  <button
                    type="button"
                    onClick={() => addPresetColumn({ name: "status", type: "VARCHAR(50)" })}
                    className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground hover:bg-primary/15 hover:text-primary"
                  >
                    + status
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Floating Architecture Node Inspector ── */}
        {selectedNode && selectedNode.type !== "tableNode" && (
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
                    onChange={(e) => updateSelectedNode("subtext", e.target.value)}
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

        {/* ── Floating Edge / Relationship Inspector ── */}
        {selectedEdge && (
          <div className="absolute right-4 top-4 z-20 w-72 rounded-2xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur-md animate-in fade-in-0 slide-in-from-right-4 duration-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Relationship Properties
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={deleteSelected}
                className="size-7 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                title="Delete connector"
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                Relation Label / Cardinality
              </label>
              <Input
                value={(selectedEdge.label as string) || ""}
                onChange={(e) => updateSelectedEdge({ label: e.target.value })}
                className="h-8 rounded-lg border-border bg-background text-xs"
                placeholder="e.g. 1 : N (user orders)"
              />

              {/* Quick Cardinality Presets */}
              <div className="flex flex-wrap gap-1 pt-1">
                {["1 : N", "1 : 1", "N : M", "FK Reference", "has_many", "belongs_to"].map(
                  (card) => (
                    <button
                      key={card}
                      type="button"
                      onClick={() => updateSelectedEdge({ label: card })}
                      className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground hover:bg-primary/15 hover:text-primary"
                    >
                      {card}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="space-y-2 pt-1 border-t border-border">
              <label className="text-[11px] font-semibold text-muted-foreground uppercase">
                Connector Style
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => updateSelectedEdge({ type: "smoothstep" })}
                  className={cn(
                    "flex-1 rounded-lg py-1 text-xs font-semibold border transition-colors",
                    selectedEdge.type === "smoothstep" || !selectedEdge.type
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  Smooth
                </button>
                <button
                  type="button"
                  onClick={() => updateSelectedEdge({ type: "step" })}
                  className={cn(
                    "flex-1 rounded-lg py-1 text-xs font-semibold border transition-colors",
                    selectedEdge.type === "step"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  Step
                </button>
                <button
                  type="button"
                  onClick={() => updateSelectedEdge({ type: "straight" })}
                  className={cn(
                    "flex-1 rounded-lg py-1 text-xs font-semibold border transition-colors",
                    selectedEdge.type === "straight"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:bg-muted",
                  )}
                >
                  Straight
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
