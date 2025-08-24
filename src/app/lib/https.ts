import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

const RAW =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
function normalizeBase(raw: string) {
  let base = (raw || "").trim().replace(/\/+$/, "");
  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    /^http:\/\//i.test(base)
  ) {
    base = base.replace(/^http:/i, "https:");
  }
  return base;
}
const API_BASE = normalizeBase(RAW);

const isBrowser = typeof window !== "undefined";

// ✅ 브라우저에서는 기본적으로 같은 오리진 사용
export const http = axios.create({
  baseURL: isBrowser ? "" : API_BASE,
  withCredentials: true,
  timeout: 10000,
  validateStatus: () => true,
});

// ✅ `/api/`로 시작하면 반드시 같은 오리진으로 보내기
http.interceptors.request.use((config) => {
  const url = String(config.url ?? "");
  if (isBrowser && url.startsWith("/api/")) {
    config.baseURL = ""; // ← 이 한 줄이 핵심
  }
  return config;
});

// (선택) 이 엔드포인트는 인증 필요 없으면 프리플라이트 줄이기
const NO_AUTH = [/^\/api\/user\/check-username(?:\?|$)/];
http.interceptors.request.use((config) => {
  const url = String(config.url ?? "");
  if (NO_AUTH.some((re) => re.test(url))) {
    if (config.headers instanceof AxiosHeaders)
      config.headers.delete("Authorization");
    else if (config.headers)
      delete (config.headers as Record<string, unknown>)["Authorization"];
    config.withCredentials = false;
  }
  return config;
});
