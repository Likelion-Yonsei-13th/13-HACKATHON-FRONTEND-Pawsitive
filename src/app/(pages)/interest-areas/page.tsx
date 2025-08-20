// app/interest-areas/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// 저장 키(로컬)
const LS_KEY = "neston_interest_areas_v1";
const MAX_SELECT = 5;

// ✅ 예시 데이터: 서울 일부 + 수도권. 필요 지역을 계속 추가하세요.
//   실제 서비스에선 서버에서 지역 목록을 내려받는 걸 권장합니다.
const REGIONS = [
  "서울특별시 종로구",
  "서울특별시 중구",
  "서울특별시 용산구",
  "서울특별시 성동구",
  "서울특별시 광진구",
  "서울특별시 동대문구",
  "서울특별시 중랑구",
  "서울특별시 성북구",
  "서울특별시 강북구",
  "서울특별시 도봉구",
  "서울특별시 노원구",
  "서울특별시 은평구",
  "서울특별시 서대문구",
  "서울특별시 마포구",
  "서울특별시 양천구",
  "서울특별시 강서구",
  "서울특별시 구로구",
  "서울특별시 금천구",
  "서울특별시 영등포구",
  "서울특별시 동작구",
  "서울특별시 관악구",
  "서울특별시 서초구",
  "서울특별시 강남구",
  "서울특별시 송파구",
  "서울특별시 강동구",
  "경기도 고양시 덕양구",
  "경기도 고양시 일산동구",
  "경기도 고양시 일산서구",
  "경기도 성남시 분당구",
  "경기도 성남시 수정구",
  "경기도 성남시 중원구",
  "인천광역시 연수구",
  "인천광역시 남동구",
  "인천광역시 미추홀구",
];

export default function InterestAreasPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  // 기존 저장값 로드
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) setSelected(arr.slice(0, MAX_SELECT));
      }
    } catch {}
  }, []);

  // 외부 클릭 시 제안 닫기
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node;
      if (!popRef.current || !inputRef.current) return;
      if (
        !popRef.current.contains(t) &&
        !inputRef.current.contains(t as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return REGIONS.slice(0, 10);
    const lower = q.toLowerCase();
    const list = REGIONS.filter((r) => r.toLowerCase().includes(lower));
    return list.slice(0, 12);
  }, [query]);

  const canAddMore = selected.length < MAX_SELECT;

  function addArea(area: string) {
    if (selected.includes(area)) {
      setMsg("이미 선택된 지역이에요.");
      return;
    }
    if (!canAddMore) {
      setMsg(`최대 ${MAX_SELECT}개까지 선택할 수 있어요.`);
      return;
    }
    setSelected((prev) => [...prev, area]);
    setQuery("");
    setOpen(false);
    setMsg(null);
    inputRef.current?.focus();
  }

  function removeArea(area: string) {
    setSelected((prev) => prev.filter((x) => x !== area));
    setMsg(null);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[0]) addArea(filtered[0]);
    }
  }

  async function onSave() {
    try {
      setSaving(true);
      // 로컬 저장
      localStorage.setItem(LS_KEY, JSON.stringify(selected));

      // (옵션) 서버에도 저장하고 싶다면 API를 구현 후 아래 주석 해제하세요.
      // await fetch("/api/user/interest-areas", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ areas: selected }),
      // });

      setMsg("저장됐습니다.");
      // 저장 후 홈으로
      setTimeout(() => router.replace("/"), 350);
    } catch (e) {
      setMsg("저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSaving(false);
    }
  }

  function onReset() {
    setSelected([]);
    setMsg(null);
    inputRef.current?.focus();
  }

  return (
    <div className="min-h-dvh w-full flex items-start justify-center bg-[linear-gradient(180deg,_#fff_0%,_#DBFFEA_100%)] px-5 py-10">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">관심지역 설정</h1>
        <p className="mt-2 text-sm text-gray-600">
          자주 확인할 동네를 최대 {MAX_SELECT}개까지 선택해 주세요.
        </p>

        {/* 입력 */}
        <div className="mt-6">
          <label htmlFor="area" className="sr-only">
            지역 검색
          </label>
          <div className="relative">
            <input
              id="area"
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKeyDown}
              placeholder="예) 서대문구, 강남구, 분당구"
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-4 pr-10 outline-none shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
            />
            {/* 검색 아이콘 (장식) */}
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none">
              🔎
            </div>

            {/* 제안 목록 */}
            {open && (
              <div
                ref={popRef}
                className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-gray-100 bg-white p-1 shadow-lg"
              >
                {filtered.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    검색 결과가 없어요.
                  </div>
                )}
                {filtered.map((area) => (
                  <button
                    key={area}
                    type="button"
                    className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50"
                    onClick={() => addArea(area)}
                  >
                    <span>{area}</span>
                    <span className="text-xs text-gray-400">추가</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 선택된 지역 */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-gray-700">선택된 지역</span>
            <span className="text-xs text-gray-400">
              {selected.length} / {MAX_SELECT}
            </span>
          </div>
          {selected.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-4 text-center text-sm text-gray-400">
              아직 선택된 지역이 없어요.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selected.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm text-emerald-700"
                >
                  {area}
                  <button
                    type="button"
                    aria-label={`${area} 삭제`}
                    className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700 hover:bg-emerald-200"
                    onClick={() => removeArea(area)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 액션 */}
        <div className="mt-8 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onReset}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            초기화
          </button>
          <button
            type="button"
            disabled={saving || selected.length === 0}
            onClick={onSave}
            className="rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>

        {/* 안내 메시지 */}
        <div className="mt-4 min-h-[1.25rem] text-sm" aria-live="polite">
          {msg && <p className="text-emerald-700">{msg}</p>}
        </div>

        {/* 접근성용 숨김 라벨 유틸 */}
        <style jsx global>{`
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }
        `}</style>
      </div>
    </div>
  );
}

/*
옵션) 서버 저장 API 예시 (app/api/user/interest-areas/route.ts)

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { areas } = await req.json();
  // TODO: 사용자 인증 정보를 바탕으로 DB에 저장하세요.
  // ex) await db.user.update({ where: { id: userId }, data: { interestAreas: areas } });
  return NextResponse.json({ ok: true });
}
*/
