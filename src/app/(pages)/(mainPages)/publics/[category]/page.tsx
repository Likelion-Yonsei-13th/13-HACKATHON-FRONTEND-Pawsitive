// src/app/(pages)/(mainPages)/publics/[category]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type LocType = "my_location" | "interested";

// 일반 카테고리 응답 (disaster/accident/traffic/safety)
type CommonAlert = {
  id: string | number;
  unique_id: string | number;
  title: string;
  content: string;
  category: string; // 영문 키
  published_at: string | null; // ISO 또는 "YYYYMMDDHHmmss"
  location_name: string;
  source: string;
};

// facility 카테고리 응답
type FacilityItem = {
  num: string;
  subjcode: string;
  fac_name: string;
  address: string;
  main_img?: string | null;
  homepage?: string | null;
};

const KOR_TO_KEY: Record<string, string> = {
  자연재해: "disaster",
  사고: "accident",
  교통: "traffic",
  치안: "safety",
  시설고장: "facility",
  기타: "etc",
};

// published_at 포맷: ISO 또는 "YYYYMMDDHHmmss" → "YYYY.MM.DD 오전/오후 HH:MM"
function formatPublishedAt(s: string | null) {
  if (!s) return "";
  // "YYYYMMDDHHmmss"
  if (/^\d{14}$/.test(s)) {
    const y = s.slice(0, 4),
      m = s.slice(4, 6),
      d = s.slice(6, 8);
    const hh = Number(s.slice(8, 10)),
      mm = s.slice(10, 12);
    const ampm = hh < 12 ? "오전" : "오후";
    const hour12 = hh % 12 === 0 ? 12 : hh % 12;
    return `${y}.${m}.${d} ${ampm} ${hour12}시 ${mm}분 등록`;
  }
  // ISO (브라우저 로케일)
  const date = new Date(s);
  if (isNaN(+date)) return s;
  const y = date.getFullYear().toString().padStart(4, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  const d = date.getDate().toString().padStart(2, "0");
  const hh = date.getHours();
  const mm = date.getMinutes().toString().padStart(2, "0");
  const ampm = hh < 12 ? "오전" : "오후";
  const hour12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${y}.${m}.${d} ${ampm} ${hour12}시 ${mm}분 등록`;
}

export default function PublicsCategoryPage() {
  const { category } = useParams<{ category: string }>();
  const router = useRouter();

  // 라우트 파라미터: 한글/영문 모두 허용
  const catKey = useMemo(() => {
    const dec = decodeURIComponent(category);
    return KOR_TO_KEY[dec] ?? dec; // 이미 영문이면 그대로
  }, [category]);

  const [locType, setLocType] = useState<LocType>("my_location");
  const [data, setData] = useState<Array<CommonAlert | FacilityItem>>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const isFacility = catKey === "facility";
  const isKnownKey = useMemo(
    () =>
      ["disaster", "accident", "traffic", "safety", "facility", "etc"].includes(
        catKey
      ),
    [catKey]
  );

  useEffect(() => {
    if (!isKnownKey) return;
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        // Next API 라우트(프록시) 호출: 쿼리 category, location_type 필수
        const url = `/api/public-data/alerts?category=${encodeURIComponent(
          catKey
        )}&location_type=${locType}`;
        const res = await fetch(url, { cache: "no-store", signal: ac.signal });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `요청 실패: ${res.status}`);
        }
        const json = (await res.json()) as Array<CommonAlert | FacilityItem>;
        setData(json ?? []);
      } catch (e) {
        if (ac.signal.aborted) return;
        setErr((e as Error).message || "목록을 불러오지 못했습니다.");
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();
    return () => ac.abort();
  }, [catKey, locType, isKnownKey]);

  // 잘못된 카테고리면 카테고리 목록으로 보내기
  useEffect(() => {
    if (!isKnownKey) router.replace("/publics");
  }, [isKnownKey, router]);

  // 경고 아이콘/색상 수준 대충 분류(UX용)
  const isWarn = useMemo(
    () => ["disaster", "accident", "safety"].includes(catKey),
    [catKey]
  );

  return (
    <section className="px-4">
      {/* 상단: 위치 토글/뒤로가기 */}
      <div className="flex items-center justify-between pt-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLocType("my_location")}
            className={`px-3 py-1 rounded border text-sm ${
              locType === "my_location"
                ? "font-semibold bg-[#DBFFEA] border-[#C5F6D9]"
                : "border-neutral-200"
            }`}
          >
            내 지역
          </button>
          <button
            onClick={() => setLocType("interested")}
            className={`px-3 py-1 rounded border text-sm ${
              locType === "interested"
                ? "font-semibold bg-[#DBFFEA] border-[#C5F6D9]"
                : "border-neutral-200"
            }`}
          >
            관심 지역
          </button>
        </div>
        <button
          className="text-sm text-neutral-500 hover:underline"
          onClick={() => router.push("/publics")}
        >
          카테고리
        </button>
      </div>

      {/* 상태 표시 */}
      {loading && <p className="py-4 text-sm text-neutral-500">불러오는 중…</p>}
      {err && (
        <p className="py-4 text-sm text-red-600 whitespace-pre-wrap">{err}</p>
      )}

      {/* 목록 */}
      {!loading && !err && (
        <ul className="space-y-2 py-6">
          {data.map((item, i) => {
            // facility vs 일반 알림 분기
            const isFacilityItem = "fac_name" in (item as any);
            if (isFacilityItem) {
              const f = item as FacilityItem;
              return (
                <li
                  key={`f-${i}`}
                  className="bg-[#D9D9D9]/54 rounded-lg border border-neutral-200 overflow-hidden"
                >
                  <div className="flex items-center">
                    <div className="flex-1 px-3 py-2">
                      <div className="text-sm font-semibold">{f.fac_name}</div>
                      <div className="text-xs text-neutral-500">
                        {f.address}
                      </div>
                      {f.homepage && (
                        <a
                          className="mt-1 inline-block text-xs text-blue-600 underline"
                          href={f.homepage}
                          target="_blank"
                        >
                          홈페이지
                        </a>
                      )}
                    </div>
                    <div className="w-14 h-14 flex items-center justify-center">
                      <span className="text-2xl">🏛️</span>
                    </div>
                  </div>
                </li>
              );
            }

            const n = item as CommonAlert;
            return (
              <li
                key={String(n.id)}
                className="bg-[#D9D9D9]/54 rounded-lg border border-neutral-200 overflow-hidden"
              >
                <div className="flex items-center">
                  <div className="flex-1 px-3 py-2">
                    <div className="text-sm font-semibold">{n.title}</div>
                    <div className="text-xs text-neutral-500">
                      {formatPublishedAt(n.published_at)}
                    </div>
                    <p className="mt-1 text-sm text-neutral-700 line-clamp-1">
                      {n.content}
                    </p>
                    <div className="mt-1 text-xs text-neutral-500">
                      {n.location_name} · {n.source}
                    </div>
                  </div>
                  <div className="w-14 h-14 flex items-center justify-center">
                    {isWarn ? (
                      <span className="text-3xl">⚠️</span>
                    ) : (
                      <span className="text-2xl">ℹ️</span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
          {data.length === 0 && (
            <li className="text-sm text-neutral-500 py-6 text-center">
              표시할 소식이 없습니다.
            </li>
          )}
        </ul>
      )}
    </section>
  );
}
