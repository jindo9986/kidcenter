"use client";

import { useAuth } from "../providers";
import { Spinner } from "@/components/Spinner";
import { LoginScreen } from "@/features/auth/LoginScreen";
import { ChildHome } from "@/features/child/ChildHome";

// Shared-device kid mode: a signed-in parent (or child) hands over the device.
export default function KidPage() {
  const { member, loading } = useAuth();
  if (loading) return <Spinner label="Đang tải…" />;
  if (!member) return <LoginScreen />;
  return <ChildHome />;
}
