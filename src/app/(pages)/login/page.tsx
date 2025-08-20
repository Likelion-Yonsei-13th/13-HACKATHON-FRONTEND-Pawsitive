"use client";

import PageLayout from "@/app/components/PageLayout";
import Image from "next/image";
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

    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({ userId, password, ts: Date.now() })
    );

    // 로그인 성공 후 홈으로 이동
    router.replace("/");
  };

  return (
    <div>
      {/* 로그인 */}
      <div className="flex w-full min-h-screen flex-col justify-start items-center px-6 max-w-md pt-50">
        <Image
          src="/svg/mainLogo.svg"
          alt="NestOn"
          width={202.747}
          height={174.87}
          priority
          className="mb-20"
        />
        <div className="w-full">
          <form onSubmit={onSubmit} className="space-y-4">
            <label className="block">
              <div className="text-gray-600 text-center font-semibold flex flex-row items-center gap-4 bg-white pl-5 mx-8 mb-5 rounded-[10px] border border-gray-200 shadow-md">
                ID
                <input
                  name="userId"
                  type="text"
                  placeholder="아이디를 입력하세요"
                  className="w-full pl-2 pr-8 py-3 outline-none font-normal"
                  required
                  autoComplete="username"
                />
              </div>
            </label>
            <label className="block">
              <div className="text-md text-gray-600 text-center font-semibold flex flex-row items-center gap-4 bg-white pl-5 mx-8 mb-5 rounded-[10px] border border-gray-200 shadow-md">
                PW
                <input
                  name="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  className="w-full pr-8 py-3 outline-none"
                  required
                  autoComplete="current-password"
                />
              </div>
            </label>
            <div className="flex flex-col items-center">
              <button
                type="submit"
                className="mt-2 px-34 rounded-[10px] bg-mainMint py-3 font-semibold shadow-md"
              >
                로그인
              </button>
            </div>
          </form>
        </div>

        {/* 회원가입 이동 */}
        <div className="text-md text-black flex flex-col items-end gap-1 mt-10 ml-45">
          <p>계정이 없으신가요?</p>
          <p className="underline underline-offset-3">회원가입하기</p>
        </div>
      </div>
    </div>
  );
}
