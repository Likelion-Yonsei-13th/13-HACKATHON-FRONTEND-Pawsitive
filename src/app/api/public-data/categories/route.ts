// src/app/api/public-data/categories/route.ts
import { NextRequest, NextResponse } from "next/server";

/** (개발용) 폴백 데이터 — 명세의 6개 카테고리 */
const FALLBACK = [
  { key: "disaster", name: "자연재해" },
  { key: "accident", name: "사고" },
  { key: "traffic", name: "교통" },
  { key: "safety", name: "치안" },
  { key: "facility", name: "시설고장" },
  { key: "etc", name: "기타" },
];

function authFromCookies(req: NextRequest) {
  // 혹시 백엔드가 인증을 요구하게 바뀐 경우 대비(원래는 불필요한 API임)
  let token = "";
  for (const c of req.cookies.getAll()) {
    const n = c.name.toLowerCase();
    if (/^(authorization|access[_-]?token|auth[_-]?token|jwt|token)$/.test(n)) {
      token = c.value ?? "";
      break;
    }
  }
  if (!token) return {};
  if (token.toLowerCase().startsWith("bearer ")) token = token.slice(7).trim();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const origin = process.env.BACKEND_ORIGIN;
  if (!origin) {
    // 환경변수 누락이면 바로 알려줌
    return NextResponse.json(
      { error: "BACKEND_ORIGIN not set" },
      { status: 500 }
    );
  }

  const candidates = [
    "/api/public-data/categories/",
    "/api/public-data/categories",
  ];
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...authFromCookies(req),
  };

  let lastStatus = 0;
  let lastBody = "";
  let lastUrl = "";

  for (const p of candidates) {
    const url = new URL(p, origin).toString();
    lastUrl = url;
    try {
      const r = await fetch(url, { headers, cache: "no-store" });
      lastStatus = r.status;
      lastBody = await r.text();

      if (r.ok) {
        // 성공이면 그대로 전달
        return new NextResponse(lastBody, {
          status: r.status,
          headers: {
            "content-type": r.headers.get("content-type") ?? "application/json",
            "x-upstream-url": url,
            "x-upstream-status": String(r.status),
          },
        });
      }
    } catch (e) {
      lastStatus = 0;
      lastBody = `fetch error: ${String(e)}`;
    }
  }

  // --- 여기까지 오면 전부 실패 ---
  // 1) 개발 중 화면 살리기: 폴백으로 200 응답
  // 2) 네트워크 탭/콘솔에서 바로 알 수 있게 디버그 헤더/본문 포함
  return NextResponse.json(FALLBACK, {
    status: 200, // 개발용 폴백이므로 화면은 살림 (배포 전 제거 권장)
    headers: {
      "x-fallback": "true",
      "x-upstream-url": lastUrl,
      "x-upstream-status": String(lastStatus), // 500/502 등 확인
      "x-upstream-sample": lastBody.slice(0, 200), // 본문 일부
    },
  });
}
