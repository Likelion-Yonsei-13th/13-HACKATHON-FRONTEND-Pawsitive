import type { PublicCategory } from "@/types/publics";
import type {
  CommonAlert,
  FacilityItem,
  PublicCategoryKey,
} from "@/types/publics";

export async function fetchPublicAlerts(params: {
  category: PublicCategoryKey | string;
  locationType: "my_location" | "interested";
}) {
  const { category, locationType } = params;
  const url = `/api/public-data/alerts?category=${encodeURIComponent(
    category
  )}&location_type=${locationType}`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    // 400: 파라미터 누락 / 내 지역 미설정, 401: 인증 실패
    const text = await res.text().catch(() => "");
    throw new Error(text || `Alerts request failed: ${res.status}`);
  }
  return (await res.json()) as CommonAlert[] | FacilityItem[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

// 카테고리 목록 조회 (인증 불필요)
export async function fetchPublicCategories(): Promise<PublicCategory[]> {
  const url = `${API_BASE}/api/public-data/categories/`; // 명세 URL
  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    // 서버컴포넌트에서 항상 최신을 원하면:
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Category request failed: ${res.status}`);
  }
  return res.json() as Promise<PublicCategory[]>;
}
