import type { DiagramTemplate } from "./types";

export const DIAGRAM_TEMPLATES: DiagramTemplate[] = [
  {
    id: "system-architecture",
    name: "System Architecture",
    description: "Standard web app stack: Client → API Gateway → Server → DB & Cache",
    nodes: [
      {
        id: "client-1",
        type: "clientNode",
        position: { x: 50, y: 150 },
        data: {
          label: "Next.js Web Client",
          subtext: "App Router & RTK Query",
          badge: "Frontend",
        },
      },
      {
        id: "gateway-1",
        type: "cloudNode",
        position: { x: 340, y: 150 },
        data: {
          label: "API Gateway / Proxy",
          subtext: "Auth verification & routing",
          badge: "Gateway",
        },
      },
      {
        id: "server-1",
        type: "serverNode",
        position: { x: 630, y: 150 },
        data: {
          label: "Spring Boot Core API",
          subtext: "Business logic & services",
          badge: "Backend",
        },
      },
      {
        id: "db-1",
        type: "databaseNode",
        position: { x: 920, y: 80 },
        data: {
          label: "PostgreSQL Database",
          subtext: "Primary persistent store",
          badge: "SQL DB",
        },
      },
      {
        id: "cache-1",
        type: "databaseNode",
        position: { x: 920, y: 220 },
        data: {
          label: "Redis Cache",
          subtext: "Session & query caching",
          badge: "Cache",
        },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "client-1",
        target: "gateway-1",
        animated: true,
        label: "HTTPS / REST",
      },
      {
        id: "e2",
        source: "gateway-1",
        target: "server-1",
        animated: true,
        label: "Internal gRPC",
      },
      {
        id: "e3",
        source: "server-1",
        target: "db-1",
        label: "Read / Write",
      },
      {
        id: "e4",
        source: "server-1",
        target: "cache-1",
        label: "Cache Hit / Miss",
      },
    ],
  },
  {
    id: "auth-oauth-flow",
    name: "Auth & OAuth Flow",
    description: "PKCE OIDC sequence: User → Better Auth → Keycloak → Protected API",
    nodes: [
      {
        id: "auth-client",
        type: "clientNode",
        position: { x: 50, y: 150 },
        data: {
          label: "Client App",
          subtext: "better-auth PKCE initiate",
          badge: "Client",
        },
      },
      {
        id: "auth-idp",
        type: "cloudNode",
        position: { x: 340, y: 70 },
        data: {
          label: "Keycloak OIDC Server",
          subtext: "Issues JWT access & refresh tokens",
          badge: "IdP",
        },
      },
      {
        id: "auth-decision",
        type: "decisionNode",
        position: { x: 340, y: 230 },
        data: {
          label: "Bearer token valid?",
          badge: "Verify JWT",
        },
      },
      {
        id: "auth-api",
        type: "serverNode",
        position: { x: 630, y: 230 },
        data: {
          label: "Protected API Service",
          subtext: "Returns user data & records",
          badge: "Resource Server",
        },
      },
    ],
    edges: [
      {
        id: "ea-1",
        source: "auth-client",
        target: "auth-idp",
        animated: true,
        label: "1. Login (PKCE)",
      },
      {
        id: "ea-2",
        source: "auth-idp",
        target: "auth-client",
        label: "2. Session & Token",
      },
      {
        id: "ea-3",
        source: "auth-client",
        target: "auth-decision",
        animated: true,
        label: "3. Request with Bearer",
      },
      {
        id: "ea-4",
        source: "auth-decision",
        target: "auth-api",
        label: "Yes: Allow request",
      },
    ],
  },
  {
    id: "microservices-pipeline",
    name: "Microservices & Queue",
    description: "Event-driven workflow with Message Queue & Async Workers",
    nodes: [
      {
        id: "ms-client",
        type: "clientNode",
        position: { x: 50, y: 140 },
        data: {
          label: "Web / Mobile Client",
          subtext: "Uploads payload / dispatches job",
          badge: "Frontend",
        },
      },
      {
        id: "ms-api",
        type: "serverNode",
        position: { x: 330, y: 140 },
        data: {
          label: "Ingestion API",
          subtext: "Validates and enqueues task",
          badge: "API",
        },
      },
      {
        id: "ms-queue",
        type: "cloudNode",
        position: { x: 610, y: 140 },
        data: {
          label: "RabbitMQ / Kafka Queue",
          subtext: "Asynchronous task queue",
          badge: "Event Broker",
        },
      },
      {
        id: "ms-worker",
        type: "serverNode",
        position: { x: 890, y: 80 },
        data: {
          label: "Processing Worker",
          subtext: "Executes heavy background task",
          badge: "Worker",
        },
      },
      {
        id: "ms-db",
        type: "databaseNode",
        position: { x: 890, y: 220 },
        data: {
          label: "Storage & State",
          subtext: "Saves results & status",
          badge: "Database",
        },
      },
    ],
    edges: [
      {
        id: "em-1",
        source: "ms-client",
        target: "ms-api",
        animated: true,
        label: "POST /jobs",
      },
      {
        id: "em-2",
        source: "ms-api",
        target: "ms-queue",
        animated: true,
        label: "Publish Event",
      },
      {
        id: "em-3",
        source: "ms-queue",
        target: "ms-worker",
        animated: true,
        label: "Consume Event",
      },
      {
        id: "em-4",
        source: "ms-worker",
        target: "ms-db",
        label: "Persist Result",
      },
    ],
  },
];
