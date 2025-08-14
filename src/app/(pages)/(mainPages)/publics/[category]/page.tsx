import { notFound } from "next/navigation";

type Notice = {
  id: string;
  title: string;
  time: string;
  summary: string;
  level?: "warn" | "info";
};

const SAMPLE: Record<string, Notice[]> = {
  치안: Array.from({ length: 8 }, (_, i) => ({
    id: `safety-${i + 1}`,
    title: "안전안내문자",
    time: "2025.08.11 오전 10시 등록",
    summary: "서대문구 야간 순찰 강화 안내",
    level: "warn",
  })),
  자연재해: [
    {
      id: "storm-1",
      title: "기상특보 안내",
      time: "2025.08.11 오전 09시 등록",
      summary: "호우주의보 발효. 침수/산사태 주의.",
      level: "warn",
    },
  ],
};

export default async function PublicsCategoryPage({
  params,
}: {
  // Next.js 15: params는 Promise 타입
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const decoded = decodeURIComponent(category);
  const items = SAMPLE[decoded];

  if (!items) notFound();

  return (
    <section className="px-4">
      <div className="sticky top-0 bg-white/90 backdrop-blur z-10 border-b">
        <h3 className="text-center py-2 font-semibold">{`공공 데이터 > ${decoded}`}</h3>
      </div>

      <ul className="space-y-2 py-2">
        {items.map((n) => (
          <li
            key={n.id}
            className="bg-white rounded-lg border border-neutral-200 overflow-hidden"
          >
            <div className="flex items-center">
              <div className="flex-1 px-3 py-2">
                <div className="text-sm font-semibold">{n.title}</div>
                <div className="text-xs text-neutral-500">{n.time}</div>
                <p className="mt-1 text-sm text-neutral-700 line-clamp-1">
                  {n.summary}
                </p>
              </div>
              <div className="w-14 h-14 flex items-center justify-center">
                {n.level === "warn" ? (
                  <span className="text-2xl">⚠️</span>
                ) : (
                  <span className="text-2xl">ℹ️</span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* 하단 경고 배지 (와이어프레임용) */}
      <div className="fixed bottom-3 right-3 text-2xl" title="주의">
        ⚠️
      </div>
    </section>
  );
}
