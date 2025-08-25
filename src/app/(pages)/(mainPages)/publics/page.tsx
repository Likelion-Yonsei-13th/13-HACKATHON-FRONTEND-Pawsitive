// src/app/(pages)/(mainPages)/publics/page.tsx
import PageLayout from "@/app/components/PageLayout";
import Link from "next/link";
import { headers } from "next/headers";

type PublicCategory = { key: string; name: string };

async function fetchPublicCategories(): Promise<PublicCategory[]> {
  // ⬇︎ 반드시 await
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const url = `${proto}://${host}/api/public-data/categories`; // 내부 API로 프록시

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Category request failed: ${res.status}`);
  return res.json();
}

export const dynamic = "force-dynamic";

export default async function PublicsIndexPage() {
  let categories: PublicCategory[] = [];
  let loadError: string | null = null;

  try {
    categories = await fetchPublicCategories();
  } catch (e) {
    loadError = (e as Error).message || "카테고리 목록을 불러오지 못했습니다.";
  }

  return (
    <PageLayout>
      <section className="px-10 py-4">
        <div className="bg-[#DBFFEA] rounded-[5px] border-[#C5F6D9] border-1 text-center text-[20px] font-semibold py-4 mb-10 h-[60px]">
          공공 데이터 소식
        </div>

        {loadError && <p className="mb-4 text-sm text-red-600">{loadError}</p>}

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {categories.map((c) => (
            <Link
              key={c.key}
              href={`/publics/${encodeURIComponent(c.key)}`} // 라우트는 영문 key
              className={[
                "block h-[130px]",
                "border border-[#D9D9D9] bg-white shadow-md rounded-[5px]",
                "flex items-center justify-center px-3 text-center",
                "text-[16px] font-semibold text-neutral-900",
                "transition-colors duration-200 ease-in-out",
                "hover:bg-[#DBFFEA]",
                "focus-visible:bg-[#DBFFEA]",
                "active:scale-[0.99]",
                "active:bg-[#DBFFEA]",
              ].join(" ")}
            >
              {c.name} {/* 카드 라벨은 한글 name */}
            </Link>
          ))}
        </div>
      </section>
    </PageLayout>
  );
}
