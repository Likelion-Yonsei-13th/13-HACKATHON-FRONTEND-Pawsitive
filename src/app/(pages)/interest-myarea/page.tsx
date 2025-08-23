"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AreaListBox from "./components/myAreaListBox";
import {
  PROVINCES,
  PROVINCE_ORDER,
  REQUIRED_DISTRICT,
} from "@/app/lib/regions";

const LS_KEY = "neston_interest_district_v1";
const NEXT_ROUTE = "/interest-areas";

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

  if (success) {
    return (
      <div className="min-h-screen w-full bg-[#DBFFEA] flex justify-center px-4 py-8">
        <div className="w-full max-w-sm flex flex-col p-5">
          <img src="/svg/NestOn.svg" alt="NestOn" className="w-[25%] pt-10" />
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
        <AreaListBox
          province={province}
          setProvince={setProvince}
          picked={picked}
          isSelected={isSelected}
          toggleDistrict={toggleDistrict}
          districts={districts}
          PROVINCE_ORDER={Array.from(PROVINCE_ORDER)}
        />

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
