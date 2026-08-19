import type { Node, Edge } from "@xyflow/react";

export interface ErdColumn {
  id: string;
  name: string;
  type: string; // e.g. "UUID", "VARCHAR(255)", "BIGINT", "TIMESTAMP", "BOOLEAN", "TEXT", "INTEGER", "JSONB", "NUMERIC(10,2)"
  isPk?: boolean;
  isFk?: boolean;
  isNullable?: boolean;
  isUnique?: boolean;
}

export type CustomNodeType =
  | "clientNode"
  | "serverNode"
  | "databaseNode"
  | "cloudNode"
  | "decisionNode"
  | "noteNode"
  | "tableNode";

export interface CustomNodeData extends Record<string, unknown> {
  label: string;
  subtext?: string;
  badge?: string;
  iconName?: string;
  colorTheme?: "blue" | "emerald" | "purple" | "amber" | "rose" | "slate" | "indigo" | "cyan";
  tableName?: string;
  columns?: ErdColumn[];
}

export type AppNode = Node<CustomNodeData, CustomNodeType>;
export type AppEdge = Edge;

export interface DiagramTemplate {
  id: string;
  name: string;
  description: string;
  nodes: AppNode[];
  edges: AppEdge[];
}

