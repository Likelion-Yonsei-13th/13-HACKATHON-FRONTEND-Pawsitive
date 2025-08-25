/* eslint-disable */
"use client";

import { memo } from "react";

type LoadingState = { cities: boolean; districts: boolean; boroughs: boolean };

/** 기존(레거시) 호출 방식 */
type LegacyProps = {
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

/** 새 호출 방식 (province 기반, 다중 선택 지원) */
type ProvinceProps = {
  /** 시/도 선택값 */
  province: string;
  setProvince: (v: string) => void;

  /** 선택 맵(예: { '서울': ['강남구','서초구'] }) — 필요 시 사용 */
  picked: Record<string, string[]>;

  /** 선택 확인/토글 콜백 */
  isSelected: (prov: string, d: string) => boolean;
  toggleDistrict: (prov: string, d: string) => void;

  /** 현재 province의 시/군/구 목록 */
  districts: string[];

  /** 좌측 컬럼에 노출할 시/도 순서 */
  PROVINCE_ORDER: string[];

  /** 로딩은 선택적 */
  loading?: LoadingState;
};

type Props = LegacyProps | ProvinceProps;

function MyAreaListBoxImpl(props: Props) {
  // 분기: province 방식인지 레거시 방식인지 식별
  const isProvinceMode = "province" in props;

  if (isProvinceMode) {
    // -------- 새 방식 렌더링 (province 기반) --------
    const {
      province,
      setProvince,
      picked, // eslint-disable-line @typescript-eslint/no-unused-vars
      isSelected,
      toggleDistrict,
      districts,
      PROVINCE_ORDER,
      loading,
    } = props as ProvinceProps;

    return (
      <div
        className="mt-9 grid grid-cols-[120px_1fr] border border-gray-300 bg-white"
        role="group"
        aria-label="지역 선택"
      >
        {/* 좌측: 시/도 */}
        <div
          className="h-80 overflow-y-auto border-r border-gray-300"
          style={{ WebkitOverflowScrolling: "touch" }}
          role="listbox"
          aria-label="시/도"
          aria-activedescendant={province ? `prov-${province}` : undefined}
        >
          {loading?.cities && PROVINCE_ORDER.length === 0 ? (
            <p className="px-3 py-3 text-center text-sm text-gray-400">
              불러오는 중…
            </p>
          ) : PROVINCE_ORDER.length === 0 ? (
            <p className="px-3 py-3 text-center text-sm text-gray-400">
              데이터 없음
            </p>
          ) : (
            PROVINCE_ORDER.map((prov) => {
              const current = prov === province;
              return (
                <button
                  key={prov}
                  id={`prov-${prov}`}
                  type="button"
                  onClick={() => {
                    if (!current) setProvince(prov);
                  }}
                  className={`relative block w-full px-3 py-3 text-center text-sm ${
                    current
                      ? "bg-white text-gray-900 font-semibold"
                      : "bg-gray-300 text-gray-600 font-light opacity-80"
                  }`}
                  role="option"
                  aria-selected={current}
                >
                  {prov}
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

        {/* 가운데: 시/군/구 (다중 선택 토글) */}
        <div
          className="h-80 overflow-y-auto"
          style={{ WebkitOverflowScrolling: "touch" }}
          role="listbox"
          aria-label="시/군/구"
        >
          {loading?.districts && districts.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400">불러오는 중…</p>
          ) : districts.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400">
              해당 시/도의 데이터가 없습니다.
            </p>
          ) : (
            districts.map((d) => {
              const sel = isSelected(province, d);
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDistrict(province, d)}
                  className={`flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm border-b last:border-b-0 border-gray-100 ${
                    sel
                      ? "bg-white text-gray-900 font-semibold"
                      : "bg-white text-gray-600 font-light opacity-80"
                  }`}
                  role="option"
                  aria-selected={sel}
                >
                  <span>{d}</span>
                  {sel && (
                    <span className="rounded bg-emerald-100 px-1 py-0.5 text-xs text-emerald-700">
                      선택됨
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // -------- 레거시 방식 렌더링 --------
  const {
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
  } = props as LegacyProps;

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
                  if (!current) setCity(c);
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
                  if (!sel) setDistrict(d);
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
                    if (!sel) setBorough(b);
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

// 불필요한 리렌더 방지
const MyAreaListBox = memo(MyAreaListBoxImpl);
MyAreaListBox.displayName = "MyAreaListBox";

export default MyAreaListBox;
