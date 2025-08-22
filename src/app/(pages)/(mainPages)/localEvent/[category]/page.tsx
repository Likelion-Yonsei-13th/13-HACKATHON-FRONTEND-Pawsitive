import Link from "next/link";
import { SAMPLE } from "../../reports/_data/sample";

function sortItems(
  items: (typeof SAMPLE)[keyof typeof SAMPLE],
  sort: "latest" | "hot"
) {
  if (sort === "hot") {
    return [...items].sort((a, b) => (b.comments ?? 0) - (a.comments ?? 0));
  }
  return [...items].sort((a, b) => (b.time > a.time ? 1 : -1));
}

export default async function ReportsCategoryPage({
  params,
  searchParams,
}: {
  // ✅ Promise 아님
  params: { category: string };
  // ✅ Next가 기대하는 타입으로
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // ✅ await 제거
  const decoded = decodeURIComponent(params.category);
  const items = SAMPLE[decoded as keyof typeof SAMPLE] ?? [];

  // ✅ string | string[] 처리
  const sortRaw = searchParams?.sort;
  const sortKey =
    (Array.isArray(sortRaw) ? sortRaw[0] : sortRaw) === "hot"
      ? "hot"
      : "latest";

  const list = sortItems(items, sortKey);
  const enc = encodeURIComponent(decoded);

  return (
    <section className="px-4 py-6">
      <div className="flex items-end justify-between">
        <h2 className="text-[18px] font-semibold">{decoded}</h2>

        <div className="flex gap-2 text-sm">
          <Link
            href={`/reports/${enc}?sort=latest`}
            className={[
              "rounded-full border px-3 py-1",
              sortKey === "latest"
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
              sortKey === "hot"
                ? "bg-neutral-900 text-white border-neutral-900"
                : "bg-white text-neutral-700 border-neutral-300",
            ].join(" ")}
          >
            화제순
          </Link>
        </div>
      </div>

      <ul className="mt-3 space-y-3">
        {list.map((r) => (
          <li key={r.id}>
            <Link
              href={`/reports/${enc}/${encodeURIComponent(r.id)}`}
              className="flex items-center gap-3 rounded-xl border bg-white p-3 shadow-sm hover:bg-neutral-50"
            >
              <div className="grid h-[58px] w-[76px] shrink-0 place-items-center overflow-hidden rounded-md border">
                {r.image ? (
                  // 경고만 뜨는 <img>는 무시해도 빌드는 됨
                  <img
                    src={r.image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-2xl">🖼️</div>
                )}
              </div>

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

      <div className="mt-6">
        <Link
          href={`/tipoff/${enc}`}
          className="block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-center text-[15px] font-medium shadow-sm hover:bg-neutral-50 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
        >
          지금 이 카테고리 소식 제보하기
        </Link>
      </div>
    </section>
  );
}
