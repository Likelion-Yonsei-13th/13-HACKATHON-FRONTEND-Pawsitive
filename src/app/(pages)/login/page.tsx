"use client";

import PageLayout from "@/app/components/PageLayout";
import { useRouter } from "next/navigation";

const AUTH_KEY = "neston_auth_v1";

export default function LoginPage() {
  const router = useRouter();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const userId = String(fd.get("userId") || "").trim();
    const password = String(fd.get("password") || "").trim();
    if (!userId || !password) return;

    // 요구사항: 로컬에 저장 (데모 용도)
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({ userId, password, ts: Date.now() })
    );

    // 메인으로 이동 → / 에서 인트로만 잠깐 보이고 바로 메인 표시
    router.replace("/");
  };

  return (
    <PageLayout>
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-4">
        <div className="w-full rounded-2xl border bg-white p-6 shadow">
          <h1 className="mb-6 text-center text-xl font-bold">로그인</h1>
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-sm text-gray-600">아이디</span>
              <input
                name="userId"
                type="text"
                placeholder="아이디를 입력하세요"
                className="w-full rounded-xl border px-4 py-3 outline-none"
                required
                autoComplete="username"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-gray-600">비밀번호</span>
              <input
                name="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                className="w-full rounded-xl border px-4 py-3 outline-none"
                required
                autoComplete="current-password"
              />
            </label>
            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-mainMint py-3 font-semibold shadow"
            >
              로그인
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-500">
            * 데모용으로 브라우저에 아이디/비밀번호를 저장합니다. 실제
            서비스에서는 서버 인증(세션/토큰)을 사용하세요.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
