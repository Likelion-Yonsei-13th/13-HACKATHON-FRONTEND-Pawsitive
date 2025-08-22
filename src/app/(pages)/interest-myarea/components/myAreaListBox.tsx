type Picked = { province: string; district: string } | null;

type Props = {
  province: string;
  setProvince: (p: string) => void;
  picked: Picked;
  isSelected: (prov: string, d: string) => boolean;
  toggleDistrict: (prov: string, d: string) => void;
  districts: string[];
  PROVINCE_ORDER: string[];
};

export default function MyAreaListBox({
  province,
  setProvince,
  picked,
  isSelected,
  toggleDistrict,
  districts,
  PROVINCE_ORDER,
}: Props) {
  return (
    <>
      {/* 리스트 박스 */}

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
    </>
  );
}
