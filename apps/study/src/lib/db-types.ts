// Slim row types for the auth surface this app needs. The Family app owns the full
// schema; here we only read the signed-in member to gate access (parents only).
export type Role = "parent" | "child";

export interface Member {
  id: string;
  family_id: string;
  role: Role;
  display_name: string;
  auth_user_id: string | null;
}
