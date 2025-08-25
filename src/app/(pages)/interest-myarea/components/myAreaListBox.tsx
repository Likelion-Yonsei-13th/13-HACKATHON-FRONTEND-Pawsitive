"use client";

import { memo } from "react";

type LoadingState = { cities: boolean; districts: boolean; boroughs: boolean };

type Props = {
  cities: string[];
  districts: string[];
  boroughs: string[];

  city: string;
  setCity: (v: string) => void;

  district: string;
  setDistrict: (v: string) => void;

  borough: string;
  setBorough: (v: string) => void;

  loading: LoadingState;
};

function MyAreaListBoxImpl({
  cities,
  districts,
  boroughs,
  city,
  setCity,
  district,
  setDistrict,
  borough,
  setBorough,
  loading,
}: Props) {
  const hasBoroughs = boroughs.length > 0;

  return (
    <div
      className={`mt-9 grid ${
        hasBoroughs ? "grid-cols-[120px_1fr_1fr]" : "grid-cols-[120px_1fr]"
      } border border-gray-300 bg-white`}
      role="group"
      aria-label="지역 선택"
    >
      {/* 좌측: 시/도 */}
      <div
        className="h-80 overflow-y-auto border-r border-gray-300"
        style={{ WebkitOverflowScrolling: "touch" }}
        role="listbox"
        aria-label="시/도"
        aria-activedescendant={city ? `city-${city}` : undefined}
      >
        {loading.cities && cities.length === 0 ? (
          <p className="px-3 py-3 text-center text-sm text-gray-400">
            불러오는 중…
          </p>
        ) : (
          cities.map((c) => {
            const current = c === city;
            return (
              <button
                key={c}
                id={`city-${c}`}
                type="button"
                onClick={() => {
                  if (!current) setCity(c); // 동일 값 클릭 시 불필요 setState 방지
                }}
                className={`relative block w-full px-3 py-3 text-center text-sm ${
                  current
                    ? "bg-white text-gray-900 font-semibold"
                    : "bg-gray-300 text-gray-600 font-light opacity-80"
                }`}
                role="option"
                aria-selected={current}
              >
                {c}
                {current && (
                  <span
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-emerald-100 px-1 py-0.5 text-xs text-emerald-700"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* 가운데: 시/군/구 */}
      <div
        className={`h-80 overflow-y-auto ${
          hasBoroughs ? "border-r border-gray-300" : ""
        }`}
        style={{ WebkitOverflowScrolling: "touch" }}
        role="listbox"
        aria-label="시/군/구"
        aria-activedescendant={district ? `district-${district}` : undefined}
      >
        {loading.districts && districts.length === 0 ? (
          <p className="px-4 py-3 text-sm text-gray-400">불러오는 중…</p>
        ) : districts.length === 0 ? (
          <p className="px-4 py-3 text-sm text-gray-400">
            해당 시/도의 데이터가 없습니다.
          </p>
        ) : (
          districts.map((d) => {
            const sel = d === district;
            return (
              <button
                key={d}
                id={`district-${d}`}
                type="button"
                onClick={() => {
                  if (!sel) setDistrict(d); // 동일 값 클릭 시 불필요 setState 방지
                }}
                className={`block w-full px-4 py-3 text-left text-sm border-b last:border-b-0 border-gray-100 ${
                  sel
                    ? "bg-white text-gray-900 font-semibold"
                    : "bg-white text-gray-600 font-light opacity-80"
                }`}
                role="option"
                aria-selected={sel}
              >
                {d}
              </button>
            );
          })
        )}
      </div>

      {/* 우측: 일반구(있는 경우만) */}
      {hasBoroughs && (
        <div
          className="h-80 overflow-y-auto"
          style={{ WebkitOverflowScrolling: "touch" }}
          role="listbox"
          aria-label="일반구"
          aria-activedescendant={borough ? `borough-${borough}` : undefined}
        >
          {loading.boroughs && boroughs.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400">불러오는 중…</p>
          ) : boroughs.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400">일반구 없음</p>
          ) : (
            boroughs.map((b) => {
              const sel = b === borough;
              return (
                <button
                  key={b}
                  id={`borough-${b}`}
                  type="button"
                  onClick={() => {
                    if (!sel) setBorough(b); // 동일 값 클릭 시 불필요 setState 방지
                  }}
                  className={`block w-full px-4 py-3 text-left text-sm border-b last:border-b-0 border-gray-100 ${
                    sel
                      ? "bg-white text-gray-900 font-semibold"
                      : "bg-white text-gray-600 font-light opacity-80"
                  }`}
                  role="option"
                  aria-selected={sel}
                >
                  {b}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// 불필요한 리렌더 방지 (얕은 비교)
const MyAreaListBox = memo(MyAreaListBoxImpl);
MyAreaListBox.displayName = "MyAreaListBox";

export default MyAreaListBox;
