type Props = {
  province: string;
  setProvince: (p: string) => void;
  PROVINCE_ORDER: readonly string[];
  districts: string[];
  isSelected: (prov: string, d: string) => boolean;
  toggleDistrict: (prov: string, d: string) => void;
  selectedCountByProvince: Map<string, number>;
};

export default function AreasListBox({
  province,
  setProvince,
  PROVINCE_ORDER,
  districts,
  isSelected,
  toggleDistrict,
  selectedCountByProvince,
}: Props) {
  return (
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
  );
}
