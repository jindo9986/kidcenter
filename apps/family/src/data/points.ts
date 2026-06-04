import { supabase } from "@/lib/supabase";
import type { PointTransaction } from "./db-types";

export async function balanceOf(memberId: string): Promise<number> {
  const { data, error } = await supabase
    .from("member_balances")
    .select("balance")
    .eq("member_id", memberId)
    .maybeSingle();
  if (error) throw error;
  return (data?.balance as number | undefined) ?? 0;
}

export async function listLedger(memberId: string, limit = 50): Promise<PointTransaction[]> {
  const { data, error } = await supabase
    .from("point_transactions")
    .select("*")
    .eq("member_id", memberId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as PointTransaction[];
}

// Approve a submitted task: set status + write exactly one ledger entry.
export async function approveTask(opts: {
  instanceId: string;
  familyId: string;
  memberId: string;
  points: number;
  deciderId: string;
}): Promise<void> {
  const { error: u } = await supabase
    .from("task_instances")
    .update({
      status: "approved",
      decided_by: opts.deciderId,
      decided_at: new Date().toISOString(),
      points_awarded: opts.points,
    })
    .eq("id", opts.instanceId);
  if (u) throw u;
  const { error: t } = await supabase.from("point_transactions").insert({
    family_id: opts.familyId,
    member_id: opts.memberId,
    delta: opts.points,
    source: "task",
    reason: "Task approved",
    ref_id: opts.instanceId,
    created_by: opts.deciderId,
  });
  if (t) throw t;
}

// Approve a redemption: set status + write one negative ledger entry.
export async function approveRedemption(opts: {
  redemptionId: string;
  familyId: string;
  memberId: string;
  cost: number;
  deciderId: string;
}): Promise<void> {
  const { error: u } = await supabase
    .from("reward_redemptions")
    .update({
      status: "fulfilled",
      decided_by: opts.deciderId,
      decided_at: new Date().toISOString(),
    })
    .eq("id", opts.redemptionId);
  if (u) throw u;
  const { error: t } = await supabase.from("point_transactions").insert({
    family_id: opts.familyId,
    member_id: opts.memberId,
    delta: -Math.abs(opts.cost),
    source: "reward",
    reason: "Reward redeemed",
    ref_id: opts.redemptionId,
    created_by: opts.deciderId,
  });
  if (t) throw t;
}

// Manual +/- adjustment (bonus for good behaviour / penalty for a rule break).
export async function addManualTxn(opts: {
  familyId: string;
  memberId: string;
  delta: number;
  reason: string;
  deciderId: string;
}): Promise<void> {
  const { error } = await supabase.from("point_transactions").insert({
    family_id: opts.familyId,
    member_id: opts.memberId,
    delta: opts.delta,
    source: opts.delta >= 0 ? "bonus" : "penalty",
    reason: opts.reason,
    created_by: opts.deciderId,
  });
  if (error) throw error;
}
