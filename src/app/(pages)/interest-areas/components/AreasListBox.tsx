"use client";

type LoadingState = { cities: boolean; districts: boolean; boroughs: boolean };

type Picked = { city: string; district: string; borough?: string | null };

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

  selected: Picked[];
  isSelectedDistrict: (c: string, d: string) => boolean;
  isSelectedBorough: (c: string, d: string, b: string) => boolean;
  toggleDistrict: () => void;
  toggleBorough: (b: string) => void;
  selectedCountByCity: Map<string, number>;
  canAddMore: boolean;
};

export default function AreasListBox({
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
  selected,
  isSelectedDistrict,
  isSelectedBorough,
  toggleDistrict,
  toggleBorough,
  selectedCountByCity,
  canAddMore,
}: Props) {
  const hasBoroughs = boroughs.length > 0;

  return (
    <div
      className={`mt-9 grid ${
        hasBoroughs ? "grid-cols-[120px_1fr_1fr]" : "grid-cols-[120px_1fr]"
      } border border-gray-300 bg-white`}
    >
      {/* 좌측: 시/도 */}
      <div
        className="h-80 overflow-y-auto border-r border-gray-300"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {loading.cities && cities.length === 0 ? (
          <p className="px-3 py-3 text-center text-sm text-gray-400">
            불러오는 중…
          </p>
        ) : (
          cities.map((c) => {
            const current = c === city;
            const cnt = selectedCountByCity.get(c) || 0;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className={`relative block w-full px-3 py-3 text-center text-sm ${
                  current
                    ? "bg-white text-gray-900 font-semibold"
                    : "bg-gray-300 text-gray-600 font-light opacity-80"
                }`}
              >
                {c}
                {cnt > 0 && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">
                    {cnt}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* 가운데: 시/군/구  */}
      <div
        className={`h-80 overflow-y-auto ${
          hasBoroughs ? "border-r border-gray-300" : ""
        }`}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {loading.districts && districts.length === 0 ? (
          <p className="px-4 py-3 text-sm text-gray-400">불러오는 중…</p>
        ) : districts.length === 0 ? (
          <p className="px-4 py-3 text-sm text-gray-400">
            해당 시/도의 데이터가 없습니다.
          </p>
        ) : (
          districts.map((d) => {
            const sel = isSelectedDistrict(city, d) || d === district;
            const isActive = d === district;

            return (
              <button
                key={d}
                type="button"
                onClick={() => setDistrict(d)}
                className={`flex items-center justify-between w-full px-4 py-3 text-left text-sm border-b last:border-b-0 border-gray-100 ${
                  sel
                    ? "bg-white text-gray-900 font-semibold"
                    : "bg-white text-gray-600 font-light opacity-80"
                }`}
              >
                <span>{d}</span>

                {isActive && boroughs.length === 0 && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDistrict();
                    }}
                    className={`ml-2 inline-block rounded px-2 py-0.5 text-xs border ${
                      isSelectedDistrict(city, d)
                        ? "border-gray-300 text-gray-500"
                        : canAddMore
                        ? "border-emerald-300 text-emerald-700"
                        : "border-gray-200 text-gray-300"
                    }`}
                  >
                    {isSelectedDistrict(city, d) ? "해제" : "추가"}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* 우측: 일반구 */}
      {hasBoroughs && (
        <div
          className="h-80 overflow-y-auto"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {loading.boroughs && boroughs.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400">불러오는 중…</p>
          ) : boroughs.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400">일반구 없음</p>
          ) : (
            boroughs.map((b) => {
              const sel = isSelectedBorough(city, district, b);
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => toggleBorough(b)}
                  className={`flex items-center justify-between w-full px-4 py-3 text-left text-sm border-b last:border-b-0 border-gray-100 ${
                    sel
                      ? "bg-white text-gray-900 font-semibold"
                      : "bg-white text-gray-600 font-light opacity-80"
                  }`}
                  disabled={!sel && !canAddMore}
                >
                  <span>{b}</span>
                  <span
                    className={`ml-2 inline-block rounded px-2 py-0.5 text-xs border ${
                      sel
                        ? "border-gray-300 text-gray-500"
                        : canAddMore
                        ? "border-emerald-300 text-emerald-700"
                        : "border-gray-200 text-gray-300"
                    }`}
                  >
                    {sel ? "해제" : "추가"}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
