// Hand-written row types mirroring the SQL schema (snake_case, as stored).
// The camelCase domain layer (src/domain/types.ts) is deliberately separate;
// data wrappers translate at the boundary.

import type { Role, Recurrence, TaskStatus, TxnSource } from "@/domain/types";

export type RedemptionStatus = "requested" | "approved" | "fulfilled" | "rejected";

export interface Family {
  id: string;
  name: string;
  created_at: string;
}

export interface Member {
  id: string;
  family_id: string;
  role: Role;
  display_name: string;
  avatar_url: string | null;
  auth_user_id: string | null;
  pin_hash: string | null;
  pin_salt: string | null;
  birth_year: number | null;
  active: boolean;
  created_at: string;
}

export interface AllowlistEmail {
  id: string;
  family_id: string;
  email: string;
  role: Role;
}

export interface ActivityType {
  id: string;
  family_id: string;
  name: string;
  icon: string | null;
  color: string | null;
  sort: number;
}

export interface Activity {
  id: string;
  family_id: string;
  type_id: string | null;
  title: string;
  description: string | null;
  points: number;
  recurrence: Recurrence;
  schedule: { days?: number[] } | null;
  start_date: string | null;
  assignee_member_id: string | null;
  requires_approval: boolean;
  active: boolean;
  created_at: string;
}

export interface TaskInstance {
  id: string;
  activity_id: string;
  member_id: string;
  due_date: string;
  status: TaskStatus;
  submitted_at: string | null;
  decided_by: string | null;
  decided_at: string | null;
  points_awarded: number | null;
}

export interface PointTransaction {
  id: string;
  family_id: string;
  member_id: string;
  delta: number;
  reason: string | null;
  source: TxnSource;
  ref_id: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Reward {
  id: string;
  family_id: string;
  title: string;
  description: string | null;
  cost_points: number;
  icon: string | null;
  stock: number | null;
  active: boolean;
  created_at: string;
}

export interface RewardRedemption {
  id: string;
  reward_id: string;
  member_id: string;
  cost_points: number;
  status: RedemptionStatus;
  created_at: string;
  decided_by: string | null;
  decided_at: string | null;
}

export interface MemberBalance {
  member_id: string;
  balance: number;
}
