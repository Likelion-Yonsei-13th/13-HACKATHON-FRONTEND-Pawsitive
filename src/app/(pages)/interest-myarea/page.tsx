"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// 로컬스토리지로 임시 구현
const LS_KEY = "neston_interest_district_v1";
const NEXT_ROUTE = "/interest-areas";
const REQUIRED_DISTRICT = "서대문구";

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

type Picked = { province: string; district: string } | null;

export default function InterestAreasListPage() {
  const router = useRouter();
  const [province, setProvince] = useState<string>("서울");
  const [picked, setPicked] = useState<Picked>(null);
  const [success, setSuccess] = useState(false);

  const districts = PROVINCES[province] ?? [];

  const isSelected = (prov: string, d: string) =>
    picked?.province === prov && picked?.district === d;

  const toggleDistrict = (prov: string, d: string) => {
    if (isSelected(prov, d)) setPicked(null);
    else setPicked({ province: prov, district: d });
  };

  // 서대문구 기준으로 데모 구현 -> 내지역은 서대문구 선택시에만 넘어감
  const canProceed = picked?.district === REQUIRED_DISTRICT;

  const handleNext = () => {
    if (!success) {
      if (!canProceed) return;
      const payload = {
        list: picked ? [picked] : [],
        districts: picked ? [picked.district] : [],
        ts: Date.now(),
      };
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(payload));
      } catch {}
      setSuccess(true);
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
              내 지역 추가가 완료되었습니다.
            </h2>
            <p className="mt-4 text-sm leading-6 text-gray-900">
              추후 ‘ 나의 지역 ’ 에서
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
          이슈가 궁금한 지역을 선택해 주세요
        </h1>

        {/* 안내: 서대문구 조건 */}
        <p className="mt-2 text-xs text-center">
          <span className="px-2 py-1 rounded bg-white/70">
            ‘{REQUIRED_DISTRICT}’
          </span>{" "}
          선택 시에만 다음으로 진행할 수 있습니다.
          <br />({REQUIRED_DISTRICT} 기준으로 구현했습니다)
        </p>

        {/* 리스트 박스 */}
        {/* ❗ overflow-hidden 제거, border-1 → border, 내부 칼럼에 고정 높이 + overflow-y-auto 부여 */}
        <div className="mt-9 grid grid-cols-[120px_1fr] border border-gray-300 bg-white">
          {/* 좌측: 시/도 */}
          <div
            className="h-80 overflow-y-auto border-r border-gray-300"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {PROVINCE_ORDER.map((p) => {
              const current = p === province;
              const isPickedInThis = picked?.province === p;
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
                  {isPickedInThis && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                      1
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 우측: 구/시 (단일 토글 선택) */}
          <div
            className="h-80 overflow-y-auto"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
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
          disabled={!canProceed}
          className="mt-[50px] mb-10 w-full rounded-xl bg-white py-3 text-base font-semibold text-gray-800 shadow active:translate-y-[1px] disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
}
