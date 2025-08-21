import PageLayout from "@/app/components/PageLayout";
import Link from "next/link";

type SummaryCard = {
  id: string;
  title: string;
  periodText: string;
  image?: string;
};

export default function LocalEventsSummary() {
  // 샘플 데이터 (실데이터 연동 전까지 임시 사용)
  const SAMPLE_LocalEventsSummary: SummaryCard[] = [
    {
      id: "LocalSum-1",
      title: "2025 개정 청년 주거 정책",
      periodText: "2025. 8.6 13:21",
      image: "/img/summarySample.png",
    },
    {
      id: "LocalSum-2",
      title: "연세대학교 축제로 인한 소음 문제",
      periodText: "2025. 8.6 13:21",
    },
    {
      id: "LocalSum-3",
      title: "주거 급여 제공",
      periodText: "2025. 8.6 13:21",
      image: "/img/summarySample.png",
    },
    {
      id: "LocalSum-4",
      title: "민생회복 소비쿠폰 신청 기간",
      periodText: "2025. 8.6 13:21",
      image: "/img/summarySample.png",
    },
    {
      id: "LocalSum-5",
      title: "고용 - 주거 불안",
      periodText: "2025. 8.6 13:21",
      image: "/img/summarySample.png",
    },
    {
      id: "LocalSum-6",
      title: "MZ 세대를 위한 경제 정책",
      periodText: "2025. 8.6 13:21",
      image: "/img/summarySample.png",
    },
    {
      id: "LocalSum-7",
      title: "1인 가구 증가에 따른 주거 문제",
      periodText: "2025. 8.6 13:21",
      image: "/img/summarySample.png",
    },
  ];
  return (
    <PageLayout>
      <p className="w-full flex justify-center items-start mt-11 mb-11 text-center text-2xl font-bold">
        지역 행사 &gt; 오늘의 이슈 요약
      </p>
      <ul>
        {SAMPLE_LocalEventsSummary.map(({ id, title, periodText, image }) => (
          <li
            key={id}
            className="flex items-center justify-start flex-row mx-6 gap-8 px-2 border-t-1 border-gray-300"
          >
            <div className="relative aspect-[4/3] my-3 overflow-hidden">
              <img
                src={image ?? "/img/placeholder.png"}
                alt={title}
                className="w-[80px]"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium text-m leading-tight">{title}</p>
              <p className="mt-1 text-sm text-gray-300">{periodText}</p>
            </div>
          </li>
        ))}
      </ul>
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
