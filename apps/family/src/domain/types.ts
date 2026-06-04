export type Role = "parent" | "child";
export type Recurrence = "once" | "daily" | "weekly" | "custom";
export type TaskStatus = "pending" | "submitted" | "approved" | "rejected" | "missed";
export type TxnSource = "task" | "penalty" | "reward" | "manual" | "bonus";

export interface PointTxn {
  delta: number;
}

export interface ActivitySchedule {
  days?: number[]; // 0=Sun..6=Sat for weekly/custom
}

export interface ActivityLite {
  id: string;
  points: number;
  recurrence: Recurrence;
  schedule: ActivitySchedule | null;
  assigneeMemberId: string | null;
  active: boolean;
  startDate?: string; // ISO yyyy-mm-dd, for "once"
}
