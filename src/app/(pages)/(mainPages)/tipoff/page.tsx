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
      <section className="px-10 py-6">
        {/* 상단 안내 바 (연한 초록) */}
        <div className="bg-[#DBFFEA] rounded-[5px] border-[#C5F6D9] border-1 text-center text-[20px] font-semibold py-4 mb-10 h-[60px]">
          지역 소식 제보하기
        </div>

        {/* 2열 카드 그리드 */}
        <div className="grid grid-cols-2 gap-6">
          {CATEGORIES.map((c, i) => (
            <Link
              key={c}
              href={`/tipoff/${encodeURIComponent(c)}`}
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
              {c}
            </Link>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-black">
          제보할 소식의 카테고리를 골라주세요
        </p>
      </section>
    </PageLayout>
  );
}
