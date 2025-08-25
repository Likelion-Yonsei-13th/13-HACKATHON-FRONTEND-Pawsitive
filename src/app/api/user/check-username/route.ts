// app/api/user/check-username/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: "POST,OPTIONS" },
  });
}

export async function POST(req: Request) {
  const upstreamBase =
    process.env.NESTON_UPSTREAM_BASE || "https://neston.ai.kr";

  // 고정 경로: slug/params 없이 그대로 지정
  const upstreamUrl = new URL("/api/user/check-username/", upstreamBase);

  // ---- 헤더 화이트리스트 (이 엔드포인트는 보통 인증 불필요)
  const headers = new Headers();
  headers.set("Accept", req.headers.get("accept") || "application/json");
  const ct = req.headers.get("content-type");
  if (ct) headers.set("Content-Type", ct);

  // 브라우저/CORS/프록시 메타 제거 (쿠키/Authorization 포함)
  for (const k of [
    "authorization",
    "Authorization",
    "cookie",
    "origin",
    "referer",
    "sec-fetch-site",
    "sec-fetch-mode",
    "sec-fetch-dest",
    "host",
    "connection",
    "content-length",
    "accept-encoding",
    "x-forwarded-host",
    "x-forwarded-proto",
  ])
    headers.delete(k);

  // 바디: 비어있으면 생략
  const rawBody = await req.arrayBuffer();
  const body = rawBody && rawBody.byteLength ? rawBody : undefined;

  const init: RequestInit = {
    method: "POST",
    headers,
    body,
    cache: "no-store",
    redirect: "manual",
  };

  // 요청 + 30x 수동 팔로우(메서드 유지)
  let res = await fetch(upstreamUrl, init);
  if ([301, 302, 303, 307, 308].includes(res.status)) {
    const loc = res.headers.get("location");
    if (loc) res = await fetch(new URL(loc, upstreamBase), init);
  }

  const buf = await res.arrayBuffer();

  // 응답 헤더 정리 + 디버그 힌트
  const respHeaders = new Headers(res.headers);
  respHeaders.set("x-upstream-url", upstreamUrl.toString());
  if (res.status >= 400) {
    try {
      const snippet = new TextDecoder()
        .decode(buf)
        .slice(0, 200)
        .replace(/\s+/g, " ");
      respHeaders.set("x-upstream-error", snippet);
    } catch {}
  }
  for (const k of ["content-encoding", "transfer-encoding", "connection"]) {
    respHeaders.delete(k);
  }

  return new Response(buf, { status: res.status, headers: respHeaders });
}
