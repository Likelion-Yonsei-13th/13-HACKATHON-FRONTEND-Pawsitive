// src/lib/http.ts
import axios from "axios";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // 쿠키 전송(리프레시 토큰 등)
  timeout: 10000,
  // 4xx/5xx도 에러로 던지지 말고 data로 받기(서버의 {success:false} 포맷 활용)
  validateStatus: () => true,
});

// (선택) Authorization 헤더 자동 첨부 — 나중에 로그인 후 필요
http.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const access = localStorage.getItem("access_token");
    if (access) config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});
