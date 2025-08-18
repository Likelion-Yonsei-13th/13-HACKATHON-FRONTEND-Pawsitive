"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReportVerifyCodePage() {
  const [code, setCode] = useState("");
  const router = useRouter();

  return (
    <section className="px-6 py-4">
      <h2 className="mb-3 text-lg font-semibold">인증코드 입력</h2>

      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="6자리 코드"
        className="w-full rounded-lg border px-3 py-2 text-center text-lg tracking-widest"
        inputMode="numeric"
      />

      <button
        disabled={code.length < 4}
        onClick={() => router.push("../../success")}
        className="mt-4 w-full rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        신고 접수하기
      </button>
    </section>
  );
}
