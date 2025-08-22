// app/interest-areas/list/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AreasListBox from "./components/AreasListBox";
import { PROVINCES, PROVINCE_ORDER } from "@/app/lib/regions";

// 로컬스토리지로 임시 구현
const LS_KEY = "neston_interest_district_v1";
const NEXT_ROUTE = "/";
const MAX_SELECT = 5; // 최대 5개까지만 선택하도록 함

// 선택 항목 타입
type Picked = { province: string; district: string };

export default function InterestAreasListPage() {
  const router = useRouter();
  const [province, setProvince] = useState<string>("서울");
  const [selected, setSelected] = useState<Picked[]>([]); // 복수 선택 가능
  const [success, setSuccess] = useState(false); // 다음 -> 완료화면 전환

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
    if (selected.length >= MAX_SELECT) return; // 최대 개수 5개 제한
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
              관심 지역 추가가 완료되었습니다.
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

        <h1 className="mt-10 text-xl font-bold text-gray-900 text-center">
          추가로 관심 있는 지역을 선택해 주세요
        </h1>
        <p className="text-xs text-gray-700 text-center pt-2">
          부모님댁, 직장 등 자주 가는 곳도 함께 추가해 보세요
          <br />
          (최대 5개까지 선택 가능)
        </p>

        {/* ✅ 리스트 박스 */}
        <AreasListBox
          province={province}
          setProvince={setProvince}
          PROVINCE_ORDER={PROVINCE_ORDER}
          districts={districts}
          isSelected={isSelected}
          toggleDistrict={toggleDistrict}
          selectedCountByProvince={selectedCountByProvince}
        />

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
