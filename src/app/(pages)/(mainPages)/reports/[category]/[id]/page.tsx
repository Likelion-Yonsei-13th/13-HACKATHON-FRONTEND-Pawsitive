import Link from "next/link";
import { SAMPLE } from "../../_data/sample";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = await params;
  const decoded = decodeURIComponent(category);

  const items = SAMPLE[decoded as keyof typeof SAMPLE] ?? [];
  const data = items.find((x) => x.id === id);

  if (!data) {
    return (
      <section className="px-6 py-8 text-center text-neutral-500">
        제보를 찾을 수 없습니다.
      </section>
    );
  }

  const base = `/reports/${encodeURIComponent(decoded)}/${encodeURIComponent(
    id
  )}`;

  return (
    // 하단 고정 버튼 공간 확보를 위해 pb 여유
    <section className="px-4 pt-4 pb-24">
      {/* ── 카드 박스 ───────────────────────────────────────── */}
      <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        {/* 헤더(제목/메타) */}
        <div className="p-4 pb-3">
          <h1 className="text-[18px] font-semibold">{data.title}</h1>

          <div className="mt-1 flex items-center justify-between text-xs text-neutral-500">
            <div>익명 | {data.time} 등록</div>
            <div className="flex gap-2">
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-700">
                공감 10
              </span>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-700">
                스크랩 2
              </span>
            </div>
          </div>
        </div>

        {/* 본문 이미지 */}
        {data.image && (
          <div className="border-t">
            <img
              src={data.image}
              alt=""
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        )}

        {/* 본문 텍스트 */}
        <div className="p-4 text-[15px] leading-6 text-neutral-800">
          {data.summary} 자세한 설명이 이곳에 들어갑니다. (더미 텍스트)
        </div>

        {/* 하단 보조 액션(공유/신고) */}
        <div className="flex items-center justify-end gap-4 border-t p-4 text-sm text-neutral-600">
          <button type="button" className="hover:underline">
            공유하기
          </button>
          <Link href={`${base}/complaints`} className="hover:underline">
            신고하기
          </Link>
        </div>
      </article>

      {/* ── 하단 고정 CTA 버튼(댓글 보기) ───────────────────── */}
      <div className="sticky bottom-0 z-30 mx-auto mt-3 w-full max-w-[500px] px-0">
        {/* 상단 그라데이션로 구분감 */}
        <div className="pointer-events-none -mb-2 h-6 w-full from-white/90 via-white/70 to-transparent" />
        <Link
          href={`${base}/comments`}
          className="block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-center text-[15px] font-medium shadow-sm hover:bg-neutral-50 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          댓글 보기
          {typeof data.comments === "number" ? ` (${data.comments})` : ""}
        </Link>
      </div>
    </section>
  );
}
