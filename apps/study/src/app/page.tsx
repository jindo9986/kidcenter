"use client";

import { useAuth } from "./providers";
import { Spinner } from "@/components/Spinner";
import { LoginScreen } from "@/features/auth/LoginScreen";
import { Dashboard } from "@/components/Dashboard";
import { useAsync } from "@/lib/useAsync";
import { fetchStudyData } from "@/lib/study-data";

export default function Home() {
  const { member, loading } = useAuth();

  if (loading) return <Spinner label="Đang tải…" />;
  if (!member) return <LoginScreen />;
  if (member.role !== "parent") return <LoginScreen reason="not-parent" />;

  return <DashboardGate familyId={member.family_id} />;
}

function DashboardGate({ familyId }: { familyId: string }) {
  const { data, loading, error } = useAsync(() => fetchStudyData(familyId), [familyId]);

  if (loading) return <Spinner label="Đang tải dữ liệu…" />;
  if (error)
    return (
      <p className="mx-auto max-w-md p-10 text-center text-sm text-red-600">
        Không tải được dữ liệu: {error}
      </p>
    );
  if (!data)
    return (
      <div className="mx-auto max-w-md p-10 text-center text-sm text-ink/60">
        <p className="font-semibold text-ink">Chưa có dữ liệu</p>
        <p className="mt-2">
          Bảng <code>study_docs</code> chưa được seed. Chạy <code>node scripts/seed.mjs</code> để nạp
          dữ liệu từ <code>content/*.json</code>.
        </p>
      </div>
    );

  return <Dashboard data={data} />;
}
