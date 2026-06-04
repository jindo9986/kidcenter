"use client";

// Fleshed out in Milestone 6 (kid mode: Today, points, store, leaderboard).
import type { Member } from "@/data/db-types";

export function ChildHome({ member }: { member: Member }) {
  return (
    <main className="mx-auto max-w-md p-8 text-center">
      <p className="text-ink/70">Xin chào {member.display_name} — chế độ trẻ em đang được xây dựng.</p>
    </main>
  );
}
