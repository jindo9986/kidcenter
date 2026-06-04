import type { PointTxn } from "./types";

export function computeBalance(txns: PointTxn[]): number {
  return txns.reduce((sum, t) => sum + t.delta, 0);
}

export function canAfford(balance: number, cost: number): boolean {
  return cost >= 0 && balance - cost >= 0;
}
