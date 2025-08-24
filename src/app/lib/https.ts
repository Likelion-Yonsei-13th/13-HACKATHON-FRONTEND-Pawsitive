import axios from "axios";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 10000,
  validateStatus: () => true,
});

http.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const access = localStorage.getItem("access_token");
    if (access) config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});
