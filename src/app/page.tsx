import Link from "next/link";
import PageLayout from "./components/PageLayout";

export default function MainPage() {
  return (
    <PageLayout>
      <div className="relative w-full h-full flex flex-col bg-gray-200/50">
        {/* 배경색 임의로 지정했습니다 */}

        <main className="px-4 pt-20 pb-18 w-full h-full flex flex-col items-center gap-5 overflow-y-auto scrollbar-hide scroll-smooth">
          <p className="text-3xl text-center font-bold text-gray-800">
            NestOn 서대문구 이슈 리포트
          </p>
          <div className="flex flex-col items-center gap-11 mt-10">
            <Link href={"/publics"}>
              <button className="w-[305.9px] h-[57.57px] text-2xl bg-gray-400">
                공공 데이터 소식
              </button>
            </Link>
            <Link href={"/reports"}>
              <button className="w-[305.9px] h-[57.57px] text-2xl bg-gray-400">
                제보 데이터 소식
              </button>
            </Link>
            <Link href={"/localevent"}>
              <button className="w-[305.9px] h-[57.57px] text-2xl bg-gray-400">
                지역 행사 소식
              </button>
            </Link>

            <img src="/svg/mainLogo.svg" alt="chatbot" />

            <div className="flex flex-raw gap-4">
              <button className="w-[135.9px] h-[57.57px] text-l bg-gray-400">
                제보하기
              </button>
              <button className="w-[135.9px] h-[57.57px] text-l bg-gray-400">
                타 지역 둘러보기
              </button>
            </div>
          </div>
        </main>
      </div>
    </PageLayout>
  );
}
