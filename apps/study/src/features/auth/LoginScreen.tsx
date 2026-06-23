"use client";

import { Button, Card } from "@kidcenter/ui";
import { signInWithGoogle, signOut } from "@/lib/session";

// Shown when the visitor is not signed in, or is signed in but not a parent
// (the study dashboard holds sensitive assessments — parents only).
export function LoginScreen({ reason }: { reason?: "unauthorized" | "not-parent" }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 p-6 text-center">
      <div>
        <div className="text-5xl">🔒</div>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink">Đánh giá nội bộ</h1>
        <p className="mt-2 text-ink/70">Hồ sơ học tập của con — chỉ bố/mẹ xem được.</p>
      </div>

      <Card className="w-full">
        {reason === "not-parent" ? (
          <div className="space-y-3">
            <p className="font-semibold text-ink">Tài khoản không có quyền xem</p>
            <p className="text-sm text-ink/70">
              Trang này chỉ dành cho bố/mẹ. Hãy đăng nhập bằng tài khoản bố/mẹ.
            </p>
            <Button variant="ghost" onClick={() => void signOut()} className="w-full">
              Đăng xuất & thử tài khoản khác
            </Button>
          </div>
        ) : reason === "unauthorized" ? (
          <div className="space-y-3">
            <p className="font-semibold text-ink">Email chưa được cấp quyền</p>
            <p className="text-sm text-ink/70">
              Email này không nằm trong danh sách gia đình. Hãy đăng nhập bằng email đã
              được thêm.
            </p>
            <Button variant="ghost" onClick={() => void signInWithGoogle()} className="w-full">
              Thử email khác
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-ink/70">Đăng nhập bằng tài khoản Google của bố/mẹ.</p>
            <Button onClick={() => void signInWithGoogle()} className="w-full" size="lg">
              Đăng nhập với Google
            </Button>
          </div>
        )}
      </Card>
    </main>
  );
}
