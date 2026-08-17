import type { Node, Edge } from "@xyflow/react";

export type CustomNodeType =
  | "clientNode"
  | "serverNode"
  | "databaseNode"
  | "cloudNode"
  | "decisionNode"
  | "noteNode";

export interface CustomNodeData extends Record<string, unknown> {
  label: string;
  subtext?: string;
  badge?: string;
  iconName?: string;
  colorTheme?: "blue" | "emerald" | "purple" | "amber" | "rose" | "slate" | "indigo";
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
