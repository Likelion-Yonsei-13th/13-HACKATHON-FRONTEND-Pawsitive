// src/app/reports/[category]/[id]/comments/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { SAMPLE } from "../../../_data/sample"; // ← 경로 주의: comments → [id] → [category] → _data (../.. = 2, 우리는 3단계 상위로) => "../../../_data/sample" 맞음

type Comment = {
  id: string;
  author: string;
  time: string; // "8/14 8:12" 같은 짧은 표기
  text: string;
};

export default function ReportCommentsPage() {
  const { category, id } = useParams<{ category: string; id: string }>();
  const decoded = decodeURIComponent(category);

  // 상단 요약(제보 카드) 데이터
  const post = useMemo(() => {
    const items = SAMPLE[decoded as keyof typeof SAMPLE] ?? [];
    return items.find((x) => x.id === id);
  }, [decoded, id]);

  // 데모용 초기 댓글
  const [list, setList] = useState<Comment[]>([
    {
      id: "c1",
      author: "바쁜 익수리",
      time: "8/14 8:12",
      text: "저희 집에서 안산 바로 보이는데 대박이에요",
    },
    {
      id: "c2",
      author: "바쁜 익수리",
      time: "8/14 8:12",
      text: "저희 집에서 안산 바로 보이는데 대박이에요",
    },
    {
      id: "c3",
      author: "바쁜 익수리",
      time: "8/14 8:12",
      text: "저희 집에서 안산 바로 보이는데 대박이에요",
    },
    {
      id: "c4",
      author: "바쁜 익수리",
      time: "8/14 8:12",
      text: "저희 집에서 안산 바로 보이는데 대박이에요",
    },
  ]);

  // 작성 폼 토글 & 입력 상태
  const [isWriting, setIsWriting] = useState(false);
  const [text, setText] = useState("");

  if (!post) {
    return (
      <section className="px-6 py-8 text-center text-neutral-500">
        제보를 찾을 수 없습니다.
      </section>
    );
  }

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const body = text.trim();
    if (!body) return;
    setList((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        author: "익명",
        time: new Intl.DateTimeFormat("ko-KR", {
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        })
          .format(new Date())
          .replace(" ", ""),
        text: body,
      },
    ]);
    setText("");
    setIsWriting(false);
  };

  return (
    // 하단 고정 버튼 공간 확보: pb-24
    <section className="px-4 pt-4 pb-24">
      {/* ── 상단 요약 카드 ───────────────────────────────────── */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[16px] font-semibold">{post.title}</h3>
          <div className="flex shrink-0 gap-2 text-[11px]">
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-700">
              공감 10
            </span>
            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-700">
              스크랩 2
            </span>
          </div>
        </div>
        <div className="mt-3 text-xs text-neutral-500">
          익명 | {post.time} 등록
        </div>
      </div>

      {/* ── 댓글 리스트 ─────────────────────────────────────── */}
      <ul className="mt-4 space-y-3">
        {list.map((c) => (
          <li key={c.id} className="flex gap-3">
            <div className="h-7 w-7 shrink-0 rounded-sm bg-neutral-200" />
            <div className="min-w-0 flex-1">
              <div className="text-[11px] leading-4">
                <span className="font-medium text-neutral-700">{c.author}</span>
                <span className="mx-2 text-neutral-400">·</span>
                <span className="text-neutral-500">{c.time}</span>
              </div>
              <p className="mt-1 text-[13px] leading-5 text-neutral-800">
                {c.text}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* ── 댓글 작성 박스(토글) ─────────────────────────────── */}
      {isWriting && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-xl border border-neutral-200 bg-white p-3 shadow-sm"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="댓글을 입력하세요"
            rows={3}
            className="w-full resize-y rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setText("");
                setIsWriting(false);
              }}
              className="rounded-lg border px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-50"
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-lg bg-black px-4 py-1.5 text-sm text-white"
            >
              등록
            </button>
          </div>
        </form>
      )}

      {/* ── 하단 고정 CTA ───────────────────────────────────── */}
      <div className="sticky bottom-0 z-30 mx-auto mt-3 w-full max-w-[500px]">
        <div className="pointer-events-none -mb-2 h-6 w-full from-white/90 via-white/70 to-transparent" />
        <button
          type="button"
          onClick={() => setIsWriting((v) => !v)}
          className="block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-center text-[15px] font-medium shadow-sm hover:bg-neutral-50 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          댓글 쓰기
        </button>
      </div>
    </section>
  );
}
