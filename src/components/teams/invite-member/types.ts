export type InviteRoleOption = {
  role: "MANAGER" | "MEMBER" | "VIEWER";
  title: string;
  description: string;
  access: string;
  caution?: string;
};
