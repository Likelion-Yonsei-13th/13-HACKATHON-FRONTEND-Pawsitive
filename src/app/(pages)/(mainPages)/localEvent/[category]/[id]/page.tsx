import Link from "next/link";

export default async function LocalEventDetailPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = await params;
  const decodedCat = decodeURIComponent(category);

  // 실제에선 id로 API 조회:
  const data = {
    title: `${decodedCat} 상세 행사 (${id})`,
    place: "서대문문화회관",
    date: "2025.08.24 19:30",
    desc:
      "행사 상세 설명입니다. 장소 안내, 참가 방법, 유의 사항 등을 자세히 표기합니다. " +
      "모바일 화면에서 가독성을 위해 단락을 짧게 나눕니다.",
  };

  return (
    <article className="px-4 pb-10 space-y-3">
      {/* 메인 비주얼 */}
      <div className="h-[160px] bg-neutral-200 rounded-md mt-6" />

      {/* 본문 정보 */}
      <section className="space-y-1">
        <h2 className="text-lg font-semibold">{data.title}</h2>
        <p className="text-sm text-neutral-700">{data.place}</p>
        <p className="text-sm text-neutral-700">{data.date}</p>
      </section>

      <section className="mt-2 text-sm leading-6 text-neutral-800">
        {data.desc}
      </section>

      {/* (선택) 액션 버튼들 */}
      <div className="mt-4 flex gap-2">
        <button className="rounded-md border px-3 py-2 text-sm">
          캘린더 저장
        </button>
        <button className="rounded-md border px-3 py-2 text-sm">공유</button>
      </div>
    </article>
  );
}
