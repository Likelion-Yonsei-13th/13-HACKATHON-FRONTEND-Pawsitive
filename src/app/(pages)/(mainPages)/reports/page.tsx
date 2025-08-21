import PageLayout from "@/app/components/PageLayout";
import Link from "next/link";

const categories = [
  { key: "자연재해", label: "자연재해" },
  { key: "사고", label: "사고" },
  { key: "교통", label: "교통" },
  { key: "치안", label: "치안" },
  { key: "시설고장", label: "시설 고장" },
  { key: "기타", label: "기타" },
] as const;

export default function ReportsIndexPage() {
  return (
    <PageLayout>
      <section className="px-6 py-4">
        {/* 상단 타이틀 바 */}
        <div className="bg-[#DBFFEA] text-center text-[20px] font-medium py-4 mb-4 h-[60px]">
          제보 데이터 소식
        </div>

        {/* 2열 카드 그리드 */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          {categories.map((c) => (
            <Link
              key={c.key}
              href={`/reports/${encodeURIComponent(c.key)}`}
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
              {c.label}
            </Link>
          ))}
        </div>
      </section>
      <div className="flex flex-row gap-10 pt-5 mb-5 justify-center items-start">
        <Link href="/">
          <button className="w-[150px] h-[65px] text-16 text-center bg-white border rounded-[50px] shadow-md">
            이전으로
          </button>
        </Link>
        <Link href="/localevent">
          <button className="w-[150px] h-[65px] text-16 text-center bg-white border rounded-[50px] shadow-md leading-5">
            우리 지역 행사
            <br />
            자세히 보기
          </button>
        </Link>
      </div>
    </PageLayout>
  );
}
