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
      <section className="flex flex-col px-10 py-4">
        {/* 상단 타이틀 바 */}
        <div className="bg-[#DBFFEA] rounded-[5px] border-[#C5F6D9] border-1 text-center text-[20px] font-semibold py-4 mb-10 h-[60px]">
          나의 지역 행사 확인하기
        </div>

        {/* 2열 카드 그리드 */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-10">
          {categories.map((c) => (
            <Link
              key={c.key}
              href={`/localevent/${encodeURIComponent(c.key)}`}
              className={[
                "block h-[130px]",
                "border border-[#D9D9D9] bg-white shadow-md rounded-[5px]",
                "flex items-center justify-center px-3 text-center",
                "text-[16px] font-semibold text-neutral-900",
                "transition-colors duration-200 ease-in-out",
                "hover:bg-[#DBFFEA]", // 마우스 오버
                "focus-visible:bg-[#DBFFEA]", // 키보드 포커스
                "active:scale-[0.99]",
                "active:bg-[#DBFFEA]",
              ].join(" ")}
            >
              {c.label}
            </Link>
          ))}
        </div>

        {/* NestOn 추천 행사 보기 버튼 */}
        <Link
          href="/localevent/recommend"
          className="block w-full rounded-[5px] shadow-md border-1 border-gray-300 bg-white text-center text-[18px] font-medium py-3 hover:bg-gray-300 transition-colors"
        >
          NestOn 추천 행사 보기
        </Link>
      </section>
    </PageLayout>
  );
}
