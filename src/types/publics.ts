// 공공데이터 카테고리 타입 (명세: key, name)
export interface PublicCategory {
  key: string; // 예: "disaster", "accident", ...
  name: string; // 예: "자연재해"
}
export type PublicCategoryKey =
  | "disaster"
  | "accident"
  | "traffic"
  | "safety"
  | "facility"
  | "etc";

export interface CommonAlert {
  id: number | string;
  unique_id: number | string;
  title: string;
  content: string;
  category: Exclude<PublicCategoryKey, "facility"> | string;
  published_at: string | null; // ISO or "YYYYMMDDHHmmss"
  location_name: string;
  source: string;
}

export interface FacilityItem {
  num: string;
  subjcode: string;
  fac_name: string;
  address: string;
  phone: string;
  fax?: string | null;
  homepage?: string | null;
  open_hour?: string | null;
  entr_fee?: string | null;
  close_day?: string | null;
  open_day?: string | null;
  seat_cnt?: string | null;
  main_img?: string | null;
  etc_desc?: string | null;
  fac_desc?: string | null;
  entrfree?: "Y" | "N";
  subway?: string | null;
  busstop?: string | null;
  airport?: string | null;
}
