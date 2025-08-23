// src/app/recommend/page.tsx
"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";

type Category =
  | "전체"
  | "문화·예술"
  | "축제·마켓"
  | "스포츠·레저"
  | "교육·강연"
  | "사회·봉사"
  | "상권·쇼핑 이벤트";

const CATEGORIES: Category[] = [
  "전체",
  "문화·예술",
  "축제·마켓",
  "스포츠·레저",
  "교육·강연",
  "사회·봉사",
  "상권·쇼핑 이벤트",
];

type EventCard = {
  id: string;
  title: string;
  periodText: string; // 예: '2025. 8.14 - 8.16'
  category: Exclude<Category, "전체">;
  image?: string; // public/ 아래 파일 경로 또는 원격 이미지(도메인 허용 필요)
  place?: string;
};

// 샘플 데이터 (실데이터 연동 전까지 임시 사용)
const SAMPLE_EVENTS: EventCard[] = [
  {
    id: "evt-1",
    title: "서대문독립축제",
    periodText: "2025. 8.14 - 8.16",
    category: "축제·마켓",
    image: "/img/eventimg.png", // '/img/seodaemun-festival.jpg' 처럼 public 자산이 있으면 지정
    place: "서대문구",
  },
  {
    id: "evt-2",
    title: "청춘 버스킹 나이트",
    periodText: "2025. 9.02 - 9.03",
    category: "문화·예술",
  },
  {
    id: "evt-3",
    title: "로컬 마켓 위크",
    periodText: "2025. 9.10 - 9.12",
    category: "축제·마켓",
  },
  {
    id: "evt-4",
    title: "한강 새벽 러닝 & 요가",
    periodText: "2025. 9.07",
    category: "스포츠·레저",
  },
  {
    id: "evt-5",
    title: "데이터 사이언스 공개 세미나",
    periodText: "2025. 9.20",
    category: "교육·강연",
  },
  {
    id: "evt-6",
    title: "지역 아동 돌봄 봉사",
    periodText: "상시",
    category: "사회·봉사",
  },
  {
    id: "evt-7",
    title: "상권 활성화 공동 프로모션",
    periodText: "2025. 9월",
    category: "상권·쇼핑 이벤트",
  },
];

export default function RecommendPage() {
  // 기본 선택은 '전체'
  const [selected, setSelected] = useState<Category>("전체");

  const filtered = useMemo(() => {
    if (selected === "전체") return SAMPLE_EVENTS;
    return SAMPLE_EVENTS.filter((e) => e.category === selected);
  }, [selected]);

  return (
    <section className="mx-auto w-full max-w-[500px]">
      {/* 메인 타이틀 */}
      <h2 className="px-4 py-4 text-lg font-semibold">
        김안녕 님을 위한 추천 행사
      </h2>

      {/* 카테고리 탭 바: 가로 스크롤 가능 */}
      <div className="sticky top-0 z-[20] bg-white/90 backdrop-blur">
        <div className="flex items-center gap-2 overflow-x-auto px-4 pb-3">
          {CATEGORIES.map((cat) => {
            const active = selected === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelected(cat)}
                className={clsx(
                  "shrink-0 rounded-full border px-3 py-1 text-sm transition-colors",
                  active
                    ? "bg-emerald-100 border-emerald-300 font-semibold"
                    : "bg-white hover:bg-neutral-50"
                )}
                aria-pressed={active}
              >
                {cat}
              </button>
            );
          })}
        </div>
        <div className="border-b" />
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-2 gap-3 px-4 py-4">
        {filtered.map((e) => (
          <article
            key={e.id}
            className="overflow-hidden rounded-xl border bg-white shadow-sm"
          >
            {/* 썸네일 */}
            {e.image ? (
              // 원격 이미지는 next.config.js의 images.domains 설정 필요
              // <Image .../> 를 쓰려면 프로젝트 설정에 맞춰 교체
              <img
                src={e.image}
                alt={e.title}
                className="h-28 w-full object-cover"
              />
            ) : (
              <div className="grid h-28 w-full place-items-center text-4xl">
                🎪
              </div>
            )}

            {/* 텍스트 정보 */}
            <div className="p-2">
              <div className="line-clamp-2 text-sm font-medium">{e.title}</div>
              <div className="mt-1 text-xs text-neutral-500">
                {e.periodText}
              </div>
              {e.place && (
                <div className="mt-0.5 text-xs text-neutral-500">{e.place}</div>
              )}
            </div>
          </article>
        ))}

        {/* 자리 채움용 스켈레톤 (카드 갯수 균형 맞추기 원하면 사용) */}
        {filtered.length % 2 !== 0 && (
          <div className="rounded-xl border border-dashed bg-neutral-50" />
        )}
      </div>

      {/* 하단 여백 */}
      <div className="h-8" />
    </section>
  );
}
