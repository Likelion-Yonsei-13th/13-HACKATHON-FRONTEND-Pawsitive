"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReportVerifyPhonePage() {
  const [phone, setPhone] = useState("");
  const router = useRouter();

  return (
    <section className="px-6 py-4">
      <h2 className="mb-3 text-lg font-semibold">제보자 연락처 인증하기</h2>

      <label className="block text-sm text-neutral-700">
        휴대폰 번호
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="010-1234-5678"
          className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
        />
      </label>

      <button
        disabled={phone.replace(/\D/g, "").length < 10}
        onClick={() => router.push("code")}
        className="mt-4 w-full rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        인증코드 받기
      </button>
    </section>
  );
}
