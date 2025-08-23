// app/localevent/[category]/page.tsx  ← 폴더/경로의 대소문자와 링크를 반드시 일치시키세요.
import Link from "next/link";
import { notFound } from "next/navigation";

// 데모 데이터
type EventItem = {
  id: string;
  title: string;
  place: string;
  date: string;
  thumbnail?: string;
};

const MOCK: Record<string, EventItem[]> = {
  문화예술: [
    {
      id: "e1",
      title: "서대문 클래식 나이트",
      place: "서대문문화회관",
      date: "2025.08.24 19:30",
    },
    {
      id: "e2",
      title: "거리 미술 전시",
      place: "연희동 일대",
      date: "2025.08.26 ~ 09.02",
    },
  ],
  축제마켓: [
    {
      id: "e3",
      title: "야시장 & 버스킹",
      place: "충정로 야시장",
      date: "매주 토 18:00~",
    },
  ],
  스포츠레저: [
    {
      id: "e4",
      title: "주말 러닝 크루",
      place: "서대문 안산 자락길",
      date: "2025.08.23 07:00",
    },
  ],
  교육강연: [
    {
      id: "e5",
      title: "AI 입문 특강",
      place: "구립도서관 강당",
      date: "2025.08.28 14:00",
    },
  ],
  사회봉사: [
    {
      id: "e6",
      title: "하천 정화 봉사",
      place: "불광천",
      date: "2025.08.31 10:00",
    },
  ],
  상권쇼핑: [
    {
      id: "e7",
      title: "상권 공동 프로모션",
      place: "연남상권",
      date: "2025.09.01 ~ 09.15",
    },
  ],
};

// ✅ Next.js 15: params는 Promise이므로 타입/구현 모두 비동기로 작성
export default async function LocalEventCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params; // ← 반드시 await
  const decoded = decodeURIComponent(category);
  const items = MOCK[decoded];

  if (!items) notFound(); // ← 세그먼트 내에서 OK

  return (
    <section className="px-4 pb-8 py-3">
      <ul className="grid grid-cols-2 gap-3 mt-3">
        {items.map((ev) => (
          <li
            key={ev.id}
            className="rounded-xl border bg-white overflow-hidden"
          >
            {/* ⚠️ 폴더 이름과 정확히 일치: /localevent/... */}
            <Link
              href={`/localevent/${encodeURIComponent(decoded)}/${ev.id}`}
              className="block"
            >
              {/* 썸네일 영역(없으면 플레이스홀더) */}
              <div className="h-[100px] bg-neutral-200" />
              <div className="p-3 space-y-1">
                <div className="font-medium leading-snug line-clamp-2">
                  {ev.title}
                </div>
                <div className="text-xs text-neutral-600">{ev.place}</div>
                <div className="text-xs text-neutral-600">{ev.date}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
