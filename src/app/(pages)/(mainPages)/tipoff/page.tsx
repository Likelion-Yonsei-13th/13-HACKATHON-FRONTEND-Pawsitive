import PageLayout from "@/app/components/PageLayout";
import Link from "next/link";

const CATEGORIES = [
  "자연재해",
  "사고",
  "교통",
  "치안",
  "시설 고장",
  "기타",
] as const;

export default function TipoffIndexPage() {
  return (
    <PageLayout>
      <section className="px-6 py-6">
        {/* 상단 안내 바 (연한 초록) */}
        <div className="bg-[#DBFFEA] rounded-[5px] border-[#C5F6D9] border-1 text-center text-[20px] font-semibold py-4 mb-4 h-[60px]">
          지역 소식 제보하기
        </div>

        {/* 2열 카드 그리드 */}
        <div className="grid grid-cols-2 gap-4">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c}
              href={`/tipoff/${encodeURIComponent(c)}`}
              className={[
                "block h-[130px]",
                "border border-[#D9D9D9] bg-white shadow-sm",
                "flex items-center justify-center px-3 text-center",
                "text-[20px] font-semibold text-neutral-900",
                "transition-colors duration-200 ease-in-out",
                "hover:bg-[#DBFFEA]", // 기본 흰색 → hover 민트
                "active:scale-[0.99] active:bg-neutral-50",
              ].join(" ")}
            >
              {c}
            </Link>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-neutral-500">
          제보할 소식의 카테고리를 골라주세요
        </p>
      </section>
    </PageLayout>
  );
}
