import { supabase } from "@/lib/supabase";
import type { Reward, RewardRedemption } from "./db-types";

export async function listRewards(familyId: string): Promise<Reward[]> {
  const { data, error } = await supabase
    .from("rewards")
    .select("*")
    .eq("family_id", familyId)
    .order("cost_points");
  if (error) throw error;
  return (data ?? []) as Reward[];
}

export async function listActiveRewards(familyId: string): Promise<Reward[]> {
  return (await listRewards(familyId)).filter((r) => r.active);
}

export type RewardInput = Omit<Reward, "id" | "created_at">;

export async function insertReward(input: RewardInput): Promise<Reward> {
  const { data, error } = await supabase.from("rewards").insert(input).select("*").single();
  if (error) throw error;
  return data as Reward;
}

export async function updateReward(id: string, patch: Partial<RewardInput>): Promise<void> {
  const { error } = await supabase.from("rewards").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteReward(id: string): Promise<void> {
  const { error } = await supabase.from("rewards").delete().eq("id", id);
  if (error) throw error;
}

// A child requests a redemption (parent approves later via approveRedemption).
export async function requestRedemption(input: {
  rewardId: string;
  memberId: string;
  costPoints: number;
}): Promise<RewardRedemption> {
  const { data, error } = await supabase
    .from("reward_redemptions")
    .insert({
      reward_id: input.rewardId,
      member_id: input.memberId,
      cost_points: input.costPoints,
      status: "requested",
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as RewardRedemption;
}

export type RedemptionWithReward = RewardRedemption & { rewards: Reward | null };

export async function listRequestedRedemptions(
  familyId: string,
): Promise<RedemptionWithReward[]> {
  const { data, error } = await supabase
    .from("reward_redemptions")
    .select("*, rewards!inner(*)")
    .eq("status", "requested")
    .eq("rewards.family_id", familyId)
    .order("created_at");
  if (error) throw error;
  return (data ?? []) as RedemptionWithReward[];
}

export async function rejectRedemption(id: string, deciderId: string): Promise<void> {
  const { error } = await supabase
    .from("reward_redemptions")
    .update({ status: "rejected", decided_by: deciderId, decided_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}
