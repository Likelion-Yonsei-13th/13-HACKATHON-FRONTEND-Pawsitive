"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

const REASONS = [
  "스팸/홍보",
  "부적절한 내용",
  "개인정보 노출",
  "기타",
] as const;

export default function ComplaintReasonPage() {
  const [reason, setReason] = useState("");
  const router = useRouter();

  // ✅ 현재 경로의 동적 파라미터를 읽는다
  const { category, id } = useParams<{ category: string; id: string }>();

  // ✅ 한글/특수문자 안전하게 인코딩해서 절대 경로 만든다
  const base = `/reports/${encodeURIComponent(category)}/${encodeURIComponent(
    id
  )}/complaints`;

  return (
    <section className="px-6 py-4">
      <h2 className="mb-3 text-lg font-semibold">제보 신고 사유 선택</h2>
      <ul className="space-y-2">
        {REASONS.map((r) => (
          <li key={r}>
            <label className="flex items-center gap-3 rounded-lg border bg-white p-3 text-sm shadow-sm">
              <input
                type="radio"
                name="reason"
                value={r}
                checked={reason === r}
                onChange={() => setReason(r)}
              />
              <span>{r}</span>
            </label>
          </li>
        ))}
      </ul>

      <button
        disabled={!reason}
        onClick={() => router.push(`${base}/verify`)} // ← 여기!
        className="mt-4 w-full rounded-lg bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        다음 (연락처 인증)
      </button>
    </section>
  );
}
