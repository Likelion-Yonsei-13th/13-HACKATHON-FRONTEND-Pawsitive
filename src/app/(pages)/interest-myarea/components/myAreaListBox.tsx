"use client";

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

export default function MyAreaListBox({
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
            const pickedHere = current;
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
                {pickedHere && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-emerald-100 px-1 py-0.5 text-xs text-emerald-700">
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
                type="button"
                onClick={() => setDistrict(d)}
                className={`block w-full px-4 py-3 text-left text-sm border-b last:border-b-0 border-gray-100 ${
                  sel
                    ? "bg-white text-gray-900 font-semibold"
                    : "bg-white text-gray-600 font-light opacity-80"
                }`}
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
                  type="button"
                  onClick={() => setBorough(b)}
                  className={`block w-full px-4 py-3 text-left text-sm border-b last:border-b-0 border-gray-100 ${
                    sel
                      ? "bg-white text-gray-900 font-semibold"
                      : "bg-white text-gray-600 font-light opacity-80"
                  }`}
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
