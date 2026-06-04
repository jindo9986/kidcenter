"use client";

import { useState } from "react";
import { useAuth } from "../providers";
import { Spinner } from "@/components/Spinner";
import { LoginScreen } from "@/features/auth/LoginScreen";
import { KidSelect } from "@/features/child/KidSelect";
import { ChildShell } from "@/features/child/ChildHome";
import type { Member } from "@/data/db-types";

// Parent kid-mode on a shared device: pick a child, then drive their view.
export default function KidPage() {
  const { member, loading } = useAuth();
  const [selected, setSelected] = useState<Member | null>(null);

  if (loading) return <Spinner label="Đang tải…" />;
  if (!member) return <LoginScreen />;
  if (!selected) return <KidSelect familyId={member.family_id} onSelect={setSelected} />;
  return <ChildShell child={selected} onExit={() => setSelected(null)} exitLabel="Đổi bé" />;
}
