import PageLayout from "@/app/components/PageLayout";
import Link from "next/link";

const categories = [
  { key: "문화예술", label: "문화·예술" },
  { key: "축제마켓", label: "축제·마켓" },
  { key: "스포츠레저", label: "스포츠·레저" },
  { key: "교육강연", label: "교육·강연" },
  { key: "사회봉사", label: "사회·봉사" },
  { key: "상권쇼핑", label: "상권·쇼핑 이벤트" },
] as const;

export default function LocalIndexPage() {
  return (
    <PageLayout>
      <section className="px-6 py-4">
        {/* 상단 타이틀 바 */}
        <div className="bg-[#D9D9D9] text-center text-[20px] font-medium py-4 mb-4 h-[60px]">
          나의 지역 행사 확인하기
        </div>

        {/* 2열 카드 그리드 */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-4 mb-6">
          {categories.map((c) => (
            <Link
              key={c.key}
              href={`/localevent/${encodeURIComponent(c.key)}`}
              className={[
                "block h-[100px]",
                "border border-[#D9D9D9] bg-white shadow-sm",
                "flex items-center justify-center px-3 text-center",
                "text-[16px] font-semibold text-neutral-900",
                "transition-colors duration-200 ease-in-out",
                "hover:bg-[#D9D9D9]", // 기본 흰색 → hover 회색
                "active:scale-[0.99] active:bg-neutral-50",
              ].join(" ")}
            >
              {c.label}
            </Link>
          ))}
        </div>

        {/* NestOn 추천 행사 보기 버튼 */}
        <Link
          href="/localevent/recommend"
          className="block w-full bg-[#D9D9D9] text-center text-[18px] font-medium py-3 rounded-sm hover:bg-gray-300 transition-colors"
        >
          NestOn 추천 행사 보기
        </Link>
      </section>
    </PageLayout>
  );
}
