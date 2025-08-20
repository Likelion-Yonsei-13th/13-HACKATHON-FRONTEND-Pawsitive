// app/interest-areas/list/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

// 로컬스토리지로 임시 구현
const LS_KEY = "neston_interest_district_v1";
const NEXT_ROUTE = "/";
const MAX_SELECT = 5; // 최대 5개까지만 선택하도록 함

// 지역 더미 데이터
const PROVINCES: Record<string, string[]> = {
  서울: [
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ],
  경기: ["성남시 분당구", "용인시 수지구", "고양시 일산동구", "수원시 영통구"],
  인천: ["연수구", "남동구", "미추홀구", "부평구"],
  강원: ["춘천시", "원주시", "강릉시"],
  충남: ["천안시", "아산시"],
  충북: ["청주시", "충주시"],
  경북: ["포항시", "경주시"],
  경남: ["창원시", "김해시"],
};

const PROVINCE_ORDER = [
  "서울",
  "경기",
  "인천",
  "강원",
  "충남",
  "충북",
  "경북",
  "경남",
];

// 선택 항목 타입
type Picked = { province: string; district: string };

export default function InterestAreasListPage() {
  const router = useRouter();
  const [province, setProvince] = useState<string>("서울");
  const [selected, setSelected] = useState<Picked[]>([]); // 복수 선택 가능
  const [success, setSuccess] = useState(false); //다음 -> 완료화면 전환

  const districts = PROVINCES[province] ?? [];

  const selectedCountByProvince = useMemo(() => {
    const m = new Map<string, number>();
    selected.forEach((s) => m.set(s.province, (m.get(s.province) || 0) + 1));
    return m;
  }, [selected]);

  const isSelected = (prov: string, d: string) =>
    selected.some((s) => s.province === prov && s.district === d);

  const toggleDistrict = (prov: string, d: string) => {
    const exists = isSelected(prov, d);
    if (exists) {
      setSelected((prev) =>
        prev.filter((s) => !(s.province === prov && s.district === d))
      );
      return;
    }
    if (selected.length >= MAX_SELECT) return; // 최대 개수 5개로 제한
    setSelected((prev) => [...prev, { province: prov, district: d }]);
  };

  const handleNext = () => {
    if (!success) {
      if (selected.length === 0) return;
      const payload = {
        list: selected, // [{ province, district }]
        districts: selected.map((s) => s.district), // 구 이름만 필요할 때
        ts: Date.now(),
      };
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(payload));
      } catch {}
      setSuccess(true); // 완료 화면 전환 부분
    } else {
      router.replace(NEXT_ROUTE);
    }
  };

  // 완료 화면
  if (success) {
    return (
      <div className="min-h-screen w-full bg-[#DBFFEA] flex justify-center px-4 py-8">
        <div className="w-full max-w-sm flex flex-col p-5">
          <div className="text-2xl font-semibold text-mainBrown pb-10">
            NestOn
          </div>

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900">
              지역 추가가 완료되었습니다.
            </h2>
            <p className="mt-4 text-sm leading-6 text-gray-900">
              추후 ‘ 나의 지역 &gt; 지역 추가하기 ’ 에서
              <br />
              지역 변경이 가능합니다.
            </p>
          </div>

          <button
            onClick={handleNext}
            className="mt-auto mb-10 w-full rounded-xl bg-white py-3 text-base font-semibold text-gray-800 shadow active:translate-y-[1px]"
          >
            다음
          </button>
        </div>
      </div>
    );
  }

  // 지역 선택 화면
  return (
    <div className="min-h-screen w-full bg-[#DBFFEA] flex justify-center px-4 py-8">
      <div className="w-full max-w-sm p-5">
        {/* 상단 */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-semibold text-mainBrown pb-10">
            NestOn
          </div>
        </div>

        <h1 className="mt-10 text-2xl font-bold text-gray-900 text-center">
          관심 있는 지역을 선택해주세요
        </h1>
        <p className="text-xs text-gray-700 text-center pt-2">
          부모님댁, 직장 등 자주 가는 곳도 함께 추가해 보세요
          <br />
          (최대 5개까지 선택 가능)
        </p>

        {/* 리스트 박스 */}
        <div className="mt-9 grid grid-cols-[120px_1fr] border-1 border-gray-300 overflow-hidden bg-white">
          {/* 좌측: 시/도 */}
          <div className="max-h-80 overflow-auto border-r border-gray-300">
            {PROVINCE_ORDER.map((p) => {
              const current = p === province;
              const count = selectedCountByProvince.get(p) || 0;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProvince(p)}
                  className={`relative block w-full px-3 py-3 text-center text-md ${
                    current
                      ? "bg-white text-gray-900 font-semibold"
                      : "bg-gray-300 text-gray-500 font-light opacity-70"
                  }`}
                >
                  {p}
                  {count > 0 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 우측: 구/시 (토글 복수 선택)*/}
          <div className="max-h-80 overflow-auto">
            {districts.map((d) => {
              const sel = isSelected(province, d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDistrict(province, d)}
                  className={`block w-full px-4 py-3 text-left text-sm border-b last:border-b-0 border-gray-100 ${
                    sel
                      ? "bg-white text-gray-900 font-semibold"
                      : "bg-white text-gray-500 font-light opacity-70"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        {/* 다음 버튼 */}
        <button
          onClick={handleNext}
          disabled={selected.length === 0}
          className="mt-50 mb-10 w-full rounded-xl bg-white py-3 text-base font-semibold text-gray-800 shadow active:translate-y-[1px]"
        >
          다음
        </button>
      </div>
    </div>
  );
}
