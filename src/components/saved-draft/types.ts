export type DraftCategory = "problem" | "solution" | "program";

export type ProgramDraftKind = "bounty" | "response";

export type SavedDraftItem = {
  id: string;
  title: string;
  description: string;
  category: DraftCategory;
  tags: string[];
  updatedAt: string;
  initials: string;
  logoSrc: string;
  logoAlt: string;
  programDraftKind?: ProgramDraftKind;
};
