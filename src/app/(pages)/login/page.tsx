"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AUTH_KEY = "neston_auth_v1";

type LoginSuccess = {
  status: number;
  success: true;
  message: string;
  data: { access: string };
};
type LoginFail = {
  status: number;
  success: false;
  message: string;
  data: null;
};
type LoginResp = LoginSuccess | LoginFail;

export default function LoginPage() {
  const router = useRouter();
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const username = String(fd.get("userId") || "").trim();
    const password = String(fd.get("password") || "").trim();
    if (!username || !password) {
      setErr("아이디와 비밀번호를 입력해 주세요.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        // Same-origin 이므로 credentials 없어도 Set-Cookie 수신 가능하지만,
        // 일부 브라우저 호환성 위해 포함
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const json = (await res.json().catch(() => ({}))) as LoginResp;

      if (!res.ok || !("success" in json) || !json.success) {
        throw new Error(json?.message || "로그인에 실패했습니다.");
      }

      const access = json.data?.access;
      if (!access) throw new Error("액세스 토큰을 받지 못했습니다.");

      // 토큰 저장 (호환을 위해 두 군데 저장)
      localStorage.setItem("access_token", access);
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({
          userId: username,
          access_token: access,
          ts: Date.now(),
        })
      );

      // 이동
      router.replace("/interest-myarea");
    } catch (e: any) {
      setErr(e?.message || "로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex-col justify-start items-center px-6 max-w-md pt-[30%]">
      {/* 로그인 */}
      <div className="flex flex-col items-center">
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
            {/* 에러 메시지 */}
            {err && <p className="text-center text-sm text-red-600">{err}</p>}

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
                disabled={loading}
                className="mt-2 px-34 rounded-[10px] bg-mainMint py-3 font-semibold shadow-md"
              >
                {loading ? "로그인 중..." : "로그인"}
              </button>
            </div>
          </form>
        </div>

        {/* 회원가입 이동 */}
        <div className="text-md text-black flex flex-col items-end gap-1 mt-10 ml-45">
          <p>계정이 없으신가요?</p>
          <Link href={"/consent"}>
            <button className="underline underline-offset-3">
              회원가입하기
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
