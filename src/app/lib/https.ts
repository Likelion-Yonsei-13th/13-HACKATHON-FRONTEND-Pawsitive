// app/lib/https.ts
import axios, { AxiosHeaders } from "axios";

/** 1) 환경변수: 키는 하나로 고정 */
const RAW = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

/** 2) BASE URL 정규화: 끝 슬래시 제거 + https 강제(브라우저에서만) */
function normalizeBase(raw: string) {
  let base = (raw || "").trim().replace(/\/+$/, ""); // '...///' → '...'
  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    /^http:\/\//i.test(base)
  ) {
    base = base.replace(/^http:/i, "https:");
  }
  return base;
}

export const API_BASE = normalizeBase(RAW);

/** 프로덕션에서 환경변수 누락 시 즉시 알림(선택) */
if (!API_BASE && process.env.NODE_ENV === "production") {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is missing");
}

/** 3) 공용 axios 인스턴스: 서버/클라 모두 절대 URL 사용 */
export const http = axios.create({
  baseURL: API_BASE, // ✅ 항상 https://neston.ai.kr 로 고정
  withCredentials: true,
  timeout: 10_000,
  validateStatus: () => true,
});

/** 4) 공개 엔드포인트: Authorization 제거 + 쿠키 미전송 */
const NO_AUTH = [/^\/api\/user\/check-username(?:\?|$)/];

http.interceptors.request.use((config) => {
  const url = String(config.url ?? "");
  if (NO_AUTH.some((re) => re.test(url))) {
    if (config.headers instanceof AxiosHeaders) {
      config.headers.delete("Authorization");
    } else if (config.headers) {
      delete (config.headers as Record<string, unknown>)["Authorization"];
    }
    config.withCredentials = false;
  }
  return config;
});

export default http;
