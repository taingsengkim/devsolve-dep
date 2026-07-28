export type DashboardStatusVariant = "active" | "reviewing" | "onHold";

export type DashboardContributor = {
  name: string;
  fallback: string;
  tone: string;
};

export type DashboardProject = {
  id: string;
  name: string;
  repository: string;
  team: string;
  tech: string;
  createdAt: string;
  contributors: DashboardContributor[];
  status: {
    text: string;
    variant: DashboardStatusVariant;
  };
};

export type DashboardStatusFilter = "all" | DashboardStatusVariant;

export type DashboardVisibleColumn =
  | "name"
  | "repository"
  | "team"
  | "tech"
  | "createdAt"
  | "contributors"
  | "status";
