"use client";

import { Button, Card } from "@kidcenter/ui";
import { signInWithGoogle } from "@/lib/session";

export function LoginScreen({ unauthorized = false }: { unauthorized?: boolean }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 p-6 text-center">
      <div>
        <div className="text-5xl">🏆</div>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink">Family Quest</h1>
        <p className="mt-2 text-ink/70">
          Làm nhiệm vụ, ghi điểm, đổi phần thưởng cho cả nhà.
        </p>
      </div>

      <Card className="w-full">
        {unauthorized ? (
          <div className="space-y-3">
            <p className="font-semibold text-ink">Tài khoản chưa được cấp quyền</p>
            <p className="text-sm text-ink/70">
              Email này không nằm trong danh sách gia đình. Hãy đăng nhập bằng email
              đã được thêm, hoặc nhờ bố/mẹ thêm email của bạn.
            </p>
            <Button variant="ghost" onClick={() => void signInWithGoogle()} className="w-full">
              Thử email khác
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-ink/70">Đăng nhập bằng tài khoản Google của gia đình.</p>
            <Button onClick={() => void signInWithGoogle()} className="w-full" size="lg">
              Đăng nhập với Google
            </Button>
          </div>
        )}
      </Card>
    </main>
  );
}
