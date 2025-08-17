// src/app/reports/[category]/[id]/comments/page.tsx
"use client";

import { useState } from "react";

export default function ReportCommentsPage() {
  const [list, setList] = useState<string[]>([
    "좋은 제보 감사합니다.",
    "현장 확인 필요해 보입니다.",
  ]);
  const [text, setText] = useState("");

  return (
    <section className="px-6 py-4">
      <h2 className="mb-3 text-lg font-semibold">댓글</h2>

      <ul className="space-y-2">
        {list.map((c, i) => (
          <li
            key={i}
            className="rounded-lg border bg-white p-3 text-sm shadow-sm"
          >
            {c}
          </li>
        ))}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          setList((prev) => [...prev, text.trim()]);
          setText("");
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="flex-1 rounded-lg border px-3 py-2 text-sm"
        />
        <button className="rounded-lg bg-black px-4 py-2 text-sm text-white">
          등록
        </button>
      </form>
    </section>
  );
}
