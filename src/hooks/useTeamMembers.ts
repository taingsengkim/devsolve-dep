import { useMemo, useState } from "react";

import { TEAM_MEMBERS } from "@/components/teams/mock-data";
import type {
  RoleFilter,
  StatusFilter,
  TeamCounts,
} from "@/components/teams/types";

function buildTeamCounts(): TeamCounts {
  const active = TEAM_MEMBERS.filter((member) => member.status === "Active").length;
  const pending = TEAM_MEMBERS.filter((member) => member.status === "Pending").length;
  const managers = TEAM_MEMBERS.filter((member) => member.role === "Manager").length;
  const members = TEAM_MEMBERS.filter((member) => member.role === "Member").length;
  const viewers = TEAM_MEMBERS.filter((member) => member.role === "Viewer").length;

  return {
    total: TEAM_MEMBERS.length,
    active,
    pending,
    managers,
    members,
    viewers,
  };
}

export function useTeamMembers() {
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  const filteredMembers = useMemo(() => {
    return TEAM_MEMBERS.filter((member) => {
      const matchesRole = roleFilter === "All" || member.role === roleFilter;
      const matchesStatus =
        statusFilter === "All" || member.status === statusFilter;

      return matchesRole && matchesStatus;
    });
  }, [roleFilter, statusFilter]);

  const counts = useMemo(() => buildTeamCounts(), []);

  return {
    counts,
    filteredMembers,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
  };
}
