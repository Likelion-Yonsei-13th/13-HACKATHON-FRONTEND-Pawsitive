"use client";

import PageLayout from "@/app/components/PageLayout";
import React, { useEffect, useMemo, useState } from "react";

type User = {
  name: string;
  username: string;
  phone: string;
  birth: string;
};

export default function SettingsPage() {
  // 더미 회원 데이터
  const initialUser = useMemo<User>(
    () => ({
      name: "이지호",
      username: "jiho_aaa",
      phone: "010-1234-5678",
      birth: "1995-04-12",
    }),
    []
  );

  const [form, setForm] = useState<User>(initialUser);
  const [saved, setSaved] = useState<User>(initialUser);
  const [msg, setMsg] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(true);

  const [verifyPhone, setVerifyPhone] = useState<string>(initialUser.phone);
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [expireAt, setExpireAt] = useState<number | null>(null);
  const [codeExpired, setCodeExpired] = useState<boolean>(false);
  const [hasSent, setHasSent] = useState<boolean>(false);
  const [tick, setTick] = useState<number>(0);

  useEffect(() => {
    if (!expireAt || verified || codeExpired) return;
    const t = setInterval(() => {
      if (Date.now() > expireAt) {
        setCodeExpired(true);
      } else {
        setTick((v) => v + 1);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [expireAt, verified, codeExpired]);

  const digitsOnly = (v: string) => v.replace(/\D/g, "");
  const formatKoreanPhone = (v: string) => {
    const d = digitsOnly(v);
    if (d.length <= 3) return d;
    if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
    if (d.length <= 11)
      return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7, 11)}`;
  };
  const isValidPhone = (v: string) => /^01[016789]-?\d{3,4}-?\d{4}$/.test(v);
  const isChanged = JSON.stringify(form) !== JSON.stringify(saved);

  const saveProfile = () => {
    setSaved(form);
    setMsg("개인정보가 저장되었습니다.");
    setIsEditing(false);
    window.setTimeout(() => setMsg(""), 2200);
  };
  const resetProfile = () => setForm(saved);

  const CODE_WINDOW_SEC = 100;

  const sendCode = () => {
    if (!isValidPhone(verifyPhone)) {
      alert("휴대폰 번호 형식을 확인해 주세요.");
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    setHasSent(true);
    setVerified(false);
    setCodeInput("");
    setCodeExpired(false);
    setExpireAt(Date.now() + CODE_WINDOW_SEC * 1000);
  };

  const confirmCode = () => {
    if (!sentCode) {
      alert("먼저 인증번호를 받아주세요.");
      return;
    }
    if (codeExpired) {
      alert("인증번호가 만료되었습니다. 재전송을 눌러 새 코드를 받으세요.");
      return;
    }
    if (codeInput.trim() === sentCode) {
      setVerified(true);
      setMsg("휴대폰 인증이 완료되었습니다.");
      window.setTimeout(() => setMsg(""), 2200);
    } else {
      alert("인증번호가 올바르지 않습니다.");
    }
  };

  const [pw1, setPw1] = useState<string>("");
  const [pw2, setPw2] = useState<string>("");
  const rules = [
    { label: "8자 이상", ok: (v: string) => v.length >= 8 },
    { label: "영문 포함", ok: (v: string) => /[A-Za-z]/.test(v) },
    { label: "숫자 포함", ok: (v: string) => /\d/.test(v) },
  ];
  const pwValid = rules.every((r) => r.ok(pw1));
  const pwMatch = pw1.length > 0 && pw1 === pw2;

  const changePassword = () => {
    if (!verified) {
      alert("먼저 휴대폰 번호 인증을 완료해주세요.");
      return;
    }
    if (!pwValid || !pwMatch) {
      alert("새 비밀번호 조건을 충족하고, 확인란과 일치해야 합니다.");
      return;
    }
    setPw1("");
    setPw2("");
    setVerified(false);
    setSentCode(null);
    setExpireAt(null);
    setCodeExpired(false);
    setMsg("비밀번호가 변경되었습니다.");
    window.setTimeout(() => setMsg(""), 2200);
  };

  const remainingSec = expireAt
    ? Math.max(0, Math.ceil((expireAt - Date.now()) / 1000))
    : 0;

  return (
    <PageLayout pageTitle="마이페이지 > 개인정보 관리">
      <div className="min-h-screen pb-20 px-5 py-5">
        <div className="mx-auto w-full max-w-3xl px-4">
          {msg && (
            <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              {msg}
            </div>
          )}

          {/* 기본 정보 */}
          <section className="mt-6">
            <div className="space-y-3">
              {/* 이름 */}
              <label htmlFor="name" className="block">
                <div className="flex h-11 w-full items-center rounded-md border bg-white">
                  <span className="w-20 shrink-0 whitespace-nowrap px-3 text-sm text-gray-600 border-r">
                    이름
                  </span>
                  <input
                    id="name"
                    className="flex-1 px-3 outline-none bg-transparent
                   disabled:bg-gray-50 disabled:text-gray-500"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="이름"
                    disabled={!isEditing}
                  />
                </div>
              </label>

              {/* 아이디 */}
              <label htmlFor="username" className="block">
                <div className="flex h-11 w-full items-center rounded-md border bg-white">
                  <span className="w-20 shrink-0 whitespace-nowrap px-3 text-sm text-gray-600 border-r">
                    아이디
                  </span>

                  <input
                    id="username"
                    className="flex-1 px-3 outline-none bg-transparent
                   disabled:bg-gray-50 disabled:text-gray-500"
                    value={form.username}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, username: e.target.value }))
                    }
                    placeholder="아이디"
                    disabled={!isEditing}
                  />
                </div>
              </label>

              {/* 연락처 */}
              <label htmlFor="phone" className="block">
                <div className="flex h-11 w-full items-center rounded-md border bg-white">
                  <span className="w-20 shrink-0 whitespace-nowrap px-3 text-sm text-gray-600 border-r">
                    연락처
                  </span>
                  <input
                    id="phone"
                    inputMode="tel"
                    className="flex-1 px-3 outline-none bg-transparent
                   disabled:bg-gray-50 disabled:text-gray-500"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    placeholder="010-0000-0000"
                    disabled={!isEditing}
                  />
                </div>
              </label>

              {/* 생년월일 */}
              <label htmlFor="birth" className="block">
                <div className="flex h-11 w-full items-center rounded-md border bg-white">
                  <span className="w-20 shrink-0 whitespace-nowrap px-3 text-sm text-gray-600 border-r">
                    생년월일
                  </span>
                  <input
                    id="birth"
                    type="date"
                    className="flex-1 px-3 outline-none bg-transparent
                   disabled:bg-gray-50 disabled:text-gray-500"
                    value={form.birth}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, birth: e.target.value }))
                    }
                    disabled={!isEditing}
                  />
                </div>
              </label>
            </div>

            {/* 버튼 영역 */}
            {isEditing ? (
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  onClick={saveProfile}
                  disabled={!isChanged || !isValidPhone(form.phone)}
                  className={`rounded-md px-4 py-2 text-sm transition shadow-md ${
                    !isChanged || !isValidPhone(form.phone)
                      ? "bg-gray-300 text-white"
                      : "bg-[#DBFFEA] text-black"
                  }`}
                >
                  변경사항 저장
                </button>
                <button
                  onClick={resetProfile}
                  disabled={!isChanged}
                  className={`rounded-md border px-4 py-2 text-sm transition shadow-md ${
                    !isChanged
                      ? "bg-gray-100 text-gray-400"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  되돌리기
                </button>
              </div>
            ) : (
              <div className="mt-6">
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-md px-4 py-2 text-sm transition shadow-md bg-[#DBFFEA] text-black"
                >
                  다시 변경하기
                </button>
              </div>
            )}
          </section>

          {/* 비밀번호 변경 */}
          <section className="mt-10">
            <h2 className="text-lg font-medium">비밀번호 변경</h2>
            <p className="mt-1 text-xs text-gray-500">
              비밀번호 변경 전 본인 확인을 위해 휴대폰 번호 인증이 필요합니다.
            </p>

            {/* 휴대폰 인증 */}
            <div className="mt-4 grid grid-cols-1 gap-3">
              <div>
                <label className="text-sm text-gray-800">휴대폰 번호</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    className={`flex-1 h-11 rounded-md border border-gray-300 bg-white px-3
                outline-none focus:ring-1 ${
                  isValidPhone(verifyPhone)
                    ? "focus:ring-gray-300"
                    : "border-red-300"
                }`}
                    value={verifyPhone}
                    onChange={(e) =>
                      setVerifyPhone(formatKoreanPhone(e.target.value))
                    }
                    inputMode="tel"
                    placeholder="010-0000-0000"
                  />

                  <button
                    onClick={sendCode}
                    className="h-11 inline-flex items-center justify-center rounded-md px-4 text-sm bg-[#DBFFEA] text-black
               shadow-md focus:outline-none "
                  >
                    {hasSent ? "재전송" : "인증번호 받기"}
                  </button>
                </div>
                {!isValidPhone(verifyPhone) && (
                  <p className="text-xs text-red-500">
                    휴대폰 번호 형식을 확인해 주세요.
                  </p>
                )}
                {hasSent && (
                  <p className="mt-2 text-xs text-gray-500">
                    인증번호: <span className="font-mono">{sentCode}</span>
                    {expireAt && !codeExpired && (
                      <span className="ml-1">— {remainingSec}초 내 입력</span>
                    )}
                    {codeExpired && (
                      <span className="ml-1 text-red-500">
                        — 만료됨, 재전송을 눌러 새 코드를 받으세요
                      </span>
                    )}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-800">인증번호 입력</label>
                <div className="mt-1 flex gap-2">
                  <input
                    className="flex-1 h-11 rounded-md border border-gray-300 bg-white px-3
                outline-none focus:ring-1 focus:ring-gray-300"
                    value={codeInput}
                    onChange={(e) =>
                      setCodeInput(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    inputMode="numeric"
                    placeholder="6자리"
                    disabled={codeExpired}
                  />
                  <button
                    onClick={confirmCode}
                    className="h-11 inline-flex items-center justify-center rounded-md px-4 text-sm bg-[#DBFFEA] text-black
               shadow-md focus:outline-none"
                    disabled={codeExpired}
                  >
                    확인
                  </button>
                </div>
                {verified ? (
                  <p className="mt-2 text-xs text-emerald-700">인증 완료</p>
                ) : (
                  <p className="mt-2 text-xs text-gray-500">
                    인증 완료 후에만 비밀번호를 변경할 수 있습니다.
                  </p>
                )}
              </div>
            </div>

            {/* 새 비밀번호 */}
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-800">새 비밀번호</span>
                <input
                  type="password"
                  className="rounded-md border px-3 py-2 border-gray-300 bg-white
                outline-none focus:ring-1 focus:ring-gray-300"
                  value={pw1}
                  onChange={(e) => setPw1(e.target.value)}
                  disabled={!verified}
                  placeholder="영문+숫자 포함, 8자 이상"
                />
                <div className="mt-1 flex flex-wrap gap-2 text-xs">
                  {rules.map((r) => (
                    <span
                      key={r.label}
                      className={`rounded-full px-2 py-0.5 ${
                        r.ok(pw1)
                          ? "bg-emerald-100 text-black"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {r.label}
                    </span>
                  ))}
                </div>
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm text-gray-800">새 비밀번호 확인</span>
                <input
                  type="password"
                  className="rounded-md border px-3 py-2 border-gray-300 bg-white
                outline-none focus:ring-1 focus:ring-gray-300"
                  value={pw2}
                  onChange={(e) => setPw2(e.target.value)}
                  disabled={!verified}
                  placeholder="한번 더 입력"
                />
                {pw2.length > 0 && !pwMatch && (
                  <span className="text-xs text-red-500">
                    비밀번호가 일치하지 않습니다.
                  </span>
                )}
              </label>
            </div>

            <button
              onClick={changePassword}
              disabled={!verified || !pwValid || !pwMatch}
              className={`mt-6 w-full rounded-md px-4 py-2 text-sm shadow-md transition ${
                !verified || !pwValid || !pwMatch
                  ? "bg-gray-100 text-gray-500"
                  : "bg-[#DBFFEA] text-black"
              }`}
            >
              비밀번호 변경
            </button>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}
