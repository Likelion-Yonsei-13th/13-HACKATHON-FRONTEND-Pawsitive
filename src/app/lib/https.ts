import axios, { AxiosHeaders } from "axios";

const RAW = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

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
export const API_BASE = normalizeBase(RAW);

const isBrowser = typeof window !== "undefined";

export const http = axios.create({
  baseURL: isBrowser ? "" : API_BASE,
  withCredentials: true,
  timeout: 10_000,
  validateStatus: () => true,
});

http.interceptors.request.use((config) => {
  const url = String(config.url ?? "");
  if (isBrowser && (url.startsWith("/api/") || url.startsWith("api/"))) {
    config.baseURL = "";
  }
  return config;
});

const NO_AUTH = [/^\/api\/user\/check-username\/?(?:\?|$)/];

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
