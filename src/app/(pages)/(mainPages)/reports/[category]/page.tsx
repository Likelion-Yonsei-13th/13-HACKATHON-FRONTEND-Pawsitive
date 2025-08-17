import Link from "next/link";
import { SAMPLE } from "../_data/sample";

// 정렬 탭: 최신순/화제순 (샘플 데이터라 정렬 로직은 심플)
function sortItems(
  items: (typeof SAMPLE)[keyof typeof SAMPLE],
  sort: "latest" | "hot"
) {
  if (sort === "hot") {
    // 데모: 댓글 수 기준 내림차순 → 최신순 보정
    return [...items].sort((a, b) => (b.comments ?? 0) - (a.comments ?? 0));
  }
  // 최신순(문자열이지만 YYYY.MM.DD HH:mm 포맷이므로 lexicographical 정렬 OK)
  return [...items].sort((a, b) => (b.time > a.time ? 1 : -1));
}

export default async function ReportsCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams?: { sort?: string };
}) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const items = SAMPLE[decoded as keyof typeof SAMPLE] ?? [];

  const sort = (searchParams?.sort === "hot" ? "hot" : "latest") as
    | "latest"
    | "hot";
  const list = sortItems(items, sort);

  const enc = encodeURIComponent(decoded);

  return (
    <section className="px-4 py-4">
      {/* 상단 타이틀 + 정렬 탭 */}
      <div className="flex items-end justify-between">
        <h2 className="text-[18px] font-semibold">{decoded}</h2>

        <div className="flex gap-2 text-sm">
          <Link
            href={`/reports/${enc}?sort=latest`}
            className={[
              "rounded-full border px-3 py-1",
              sort === "latest"
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-700 border-neutral-300",
            ].join(" ")}
          >
            최신순
          </Link>
          <Link
            href={`/reports/${enc}?sort=hot`}
            className={[
              "rounded-full border px-3 py-1",
              sort === "hot"
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-700 border-neutral-300",
            ].join(" ")}
          >
            화제순
          </Link>
        </div>
      </div>

      {/* 리스트 */}
      <ul className="mt-3 space-y-3">
        {list.map((r) => (
          <li key={r.id}>
            <Link
              href={`/reports/${enc}/${encodeURIComponent(r.id)}`}
              className="flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm hover:bg-neutral-50"
            >
              {/* 썸네일 */}
              <div className="grid h-[58px] w-[76px] shrink-0 place-items-center overflow-hidden rounded-md border">
                {r.image ? (
                  <img
                    src={r.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-2xl">🖼️</div>
                )}
              </div>

              {/* 텍스트 */}
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-semibold">
                  {r.title}
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  익명, {r.time} 등록
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* 하단 CTA */}
      <div className="mt-6">
        <button
          type="button"
          className="w-full rounded-xl border bg-white px-4 py-3 text-center text-[15px] font-medium shadow-sm"
          // onClick={() => router.push(`/reports/${enc}/new`)}  // 실제 제보 작성 페이지 생기면 연결
        >
          지금 이 카테고리 소식 제보하기
        </button>
      </div>
    </section>
  );
}
