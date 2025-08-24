"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { http } from "@/app/lib/https";

type ApiSuccess<T> = {
  status: number;
  success: true;
  message: string;
  data: T;
};
type ApiFail = { status: number; success: false; message: string; data: null };
type ApiResponse<T> = ApiSuccess<T> | ApiFail;

function toErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return "알 수 없는 오류가 발생했습니다.";
  }
}

const EP = {
  checkUsername: `/api/user/check-username`,
  signup: `/api/user/signup`,
  afterSignupRedirect: "/login",
};

export default function SignupPage() {
  const router = useRouter();

  // form states
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameChecked, setUsernameChecked] = useState<null | boolean>(null);
  const [checkingId, setCheckingId] = useState(false);

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [phone, setPhone] = useState("");
  const phoneDigits = useMemo(() => phone.replace(/\D/g, ""), [phone]);

  const [birth, setBirth] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // validators
  const usernameOk = useMemo(
    () => /^[a-z0-9_]{4,20}$/i.test(username),
    [username]
  );
  const passwordOk = useMemo(() => password.length >= 8, [password]);
  const passwordMatch = useMemo(
    () => password !== "" && password === password2,
    [password, password2]
  );
  const phoneOk = useMemo(
    () => /^(01[016789])\d{3,4}\d{4}$/.test(phoneDigits),
    [phoneDigits]
  );
  const birthOk = useMemo(
    () => !birth || /^\d{4}-\d{2}-\d{2}$/.test(birth),
    [birth]
  );

  // ---- 아이디 중복 확인 ----
  type UsernameCheckData = { is_available: boolean };
  const onCheckUsername = async () => {
    setError(null);
    setOkMsg(null);
    if (!usernameOk) {
      setUsernameChecked(false);
      setError("아이디는 4~20자 영문/숫자/언더바만 가능합니다.");
      return;
    }
    setCheckingId(true);
    try {
      const { data: json } = await http.post<ApiResponse<UsernameCheckData>>(
        EP.checkUsername,
        { username }
      );
      if (!json.success || !json.data)
        throw new Error(json.message || "중복 확인 실패");

      const ok = !!json.data.is_available;
      setUsernameChecked(ok);
      if (ok) setOkMsg("사용 가능한 아이디입니다.");
      else setError("이미 사용 중인 아이디입니다.");
    } catch (e) {
      setUsernameChecked(false);
      setError(toErrorMessage(e));
    } finally {
      setCheckingId(false);
    }
  };

  // ---- 제출 ----
  type SignupData = { access?: string } | null;
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setOkMsg(null);

    if (!name.trim()) return setError("이름을 입력해 주세요.");
    if (!usernameOk) return setError("아이디 형식을 확인해 주세요.");
    if (!usernameChecked) return setError("아이디 중복 확인을 완료해 주세요.");
    if (!passwordOk) return setError("비밀번호는 8자 이상이어야 합니다.");
    if (!passwordMatch) return setError("비밀번호가 일치하지 않습니다.");
    if (!phoneOk) return setError("휴대폰 번호 형식을 확인해 주세요.");
    if (!birthOk)
      return setError("생년월일 형식을 확인해 주세요 (YYYY-MM-DD).");

    setSubmitting(true);
    try {
      // 서버 스펙에 맞춰 key 구성
      const body = {
        name: name.trim(),
        username: username.trim(),
        password,
        password2,
        phone_number: phoneDigits, // ← 인증 없이 저장
        birth_date: birth,
      };

      const { data: json } = await http.post<ApiResponse<SignupData>>(
        EP.signup,
        body
      );
      if (!json.success) throw new Error(json.message || "회원가입 실패");

      const access = json.data?.access;
      if (access) {
        localStorage.setItem("access_token", access);
        return router.replace("/mypage");
      }
      router.replace(EP.afterSignupRedirect);
    } catch (e) {
      setError(toErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-start justify-center bg-[linear-gradient(180deg,_#fff_0%,_#DBFFEA_100%)] pt-16 pb-24 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md p-6 space-y-5">
        <h1 className="text-2xl font-semibold text-center">회원가입</h1>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        {okMsg && (
          <p className="text-emerald-700 text-sm text-center">{okMsg}</p>
        )}

        {/* 이름 */}
        <div className="space-y-1">
          <label className="text-sm font-medium">이름</label>
          <input
            type="text"
            className="w-full bg-white rounded-[10px] border px-3 py-3 focus:outline-none focus:ring-1 focus:ring-gray-300"
            placeholder="홍길동"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* 아이디 + 중복확인 */}
        <div className="space-y-1">
          <label className="text-sm font-medium">아이디</label>
          <div className="flex gap-2">
            <input
              type="text"
              className={`flex-1 bg-white rounded-[10px] border px-3 py-3 focus:outline-none focus:ring-1 focus:ring-gray-300 ${
                usernameChecked ? "ring-gray-300" : "focus:ring-gray-300"
              }`}
              placeholder="영문/숫자/언더바, 4~20자"
              value={username}
              required
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameChecked(null);
              }}
            />
            <button
              type="button"
              onClick={onCheckUsername}
              disabled={checkingId || !usernameOk}
              className={`shrink-0 px-4 rounded-[10px] shadow-sm ${
                checkingId || !usernameOk
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-mainMint"
              }`}
            >
              {checkingId ? "확인 중..." : "중복 확인"}
            </button>
          </div>
          {usernameChecked !== null && (
            <p
              className={`text-xs ${
                usernameChecked ? "text-gray-500" : "text-red-600"
              }`}
            >
              {usernameChecked
                ? "사용 가능한 아이디입니다."
                : "이미 사용 중인 아이디입니다."}
            </p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className="space-y-1">
          <label className="text-sm font-medium">비밀번호</label>
          <input
            type="password"
            className="w-full bg-white rounded-[10px] border px-3 py-3 focus:outline-none focus:ring-1 focus:ring-gray-300"
            placeholder="8자 이상"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          {!passwordOk && password.length > 0 && (
            <p className="text-xs text-red-600">
              비밀번호는 8자 이상이어야 합니다.
            </p>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className="space-y-1">
          <label className="text-sm font-medium">비밀번호 확인</label>
          <input
            type="password"
            className="w-full bg-white rounded-[10px] border px-3 py-3 focus:outline-none focus:ring-1 focus:ring-gray-300"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            autoComplete="new-password"
          />
          {password2 && !passwordMatch && (
            <p className="text-xs text-red-600">
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>

        {/* 휴대폰 번호(인증 없이 저장) */}
        <div className="space-y-1">
          <label className="text-sm font-medium">휴대폰 번호</label>
          <input
            type="tel"
            inputMode="numeric"
            className="w-full bg-white rounded-[10px] border px-3 py-3 focus:outline-none focus:ring-1 focus:ring-gray-300"
            placeholder="010-1234-5678"
            value={phone}
            required
            onChange={(e) => setPhone(e.target.value)}
          />
          {!phoneOk && phone && (
            <p className="text-xs text-red-600">
              휴대폰 번호 형식을 확인해 주세요.
            </p>
          )}
        </div>

        {/* 생년월일 */}
        <div className="space-y-1">
          <label className="text-sm font-medium">생년월일</label>
          <input
            type="date"
            className="w-full bg-white rounded-[10px] border px-3 py-3 focus:outline-none focus:ring-1 focus:ring-gray-300"
            value={birth}
            required
            onChange={(e) => setBirth(e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
          />
          {!birthOk && (
            <p className="text-xs text-red-600">
              YYYY-MM-DD 형식으로 입력해 주세요.
            </p>
          )}
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full mt-2 px-4 py-4 rounded-[10px] shadow-md transition ${
            submitting
              ? "bg-gray-200 text-gray-400"
              : "bg-mainMint shadow-lg text-black"
          }`}
        >
          {submitting ? "처리 중..." : "회원가입하기"}
        </button>
      </form>
    </div>
  );
}
