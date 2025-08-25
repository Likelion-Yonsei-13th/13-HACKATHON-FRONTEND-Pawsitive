// app/api/user/[...slug]/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, ctx: { params: { slug: string[] } }) {
  return proxy(req, ctx);
}
export async function POST(req: Request, ctx: { params: { slug: string[] } }) {
  return proxy(req, ctx);
}
export async function PUT(req: Request, ctx: { params: { slug: string[] } }) {
  return proxy(req, ctx);
}
export async function PATCH(req: Request, ctx: { params: { slug: string[] } }) {
  return proxy(req, ctx);
}
export async function DELETE(
  req: Request,
  ctx: { params: { slug: string[] } }
) {
  return proxy(req, ctx);
}
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: "GET,POST,PUT,PATCH,DELETE,OPTIONS" },
  });
}

async function proxy(req: Request, { params }: { params: { slug: string[] } }) {
  const upstreamBase =
    process.env.NESTON_UPSTREAM_BASE || "https://neston.ai.kr";
  const orig = new URL(req.url);
  const slugPath = (params.slug || []).join("/");
  const basePath = `/api/user/${slugPath}`;

  // POST/PUT/PATCH/DELETE → 트레일링 슬래시 강제
  const wantsSlash = /^(POST|PUT|PATCH|DELETE)$/i.test(req.method);
  const normalizedPath = wantsSlash ? `${basePath}/` : basePath;
  let upstreamUrl = new URL(normalizedPath + orig.search, upstreamBase);

  // ---- 헤더 화이트리스트
  const headers = new Headers();
  // 기본 헤더
  headers.set("Accept", req.headers.get("accept") || "application/json");
  const ct = req.headers.get("content-type");
  if (ct) headers.set("Content-Type", ct);

  // 인증 필요 없는 엔드포인트는 Authorization 제거(이 라우트 자체가 공용이면 항상 제거해도 OK)
  const pathLower = normalizedPath.toLowerCase();
  const inAuth =
    req.headers.get("authorization") || req.headers.get("Authorization");
  if (inAuth && !/\/check-username\/?$/i.test(pathLower)) {
    headers.set("Authorization", inAuth);
    headers.set("authorization", inAuth);
  }

  // 브라우저/CORS/프록시 메타 제거(쿠키 포함)
  for (const k of [
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

  // 바디(비어있으면 생략)
  const rawBody = ["GET", "HEAD", "OPTIONS"].includes(req.method)
    ? undefined
    : await req.arrayBuffer();
  const body = rawBody && rawBody.byteLength ? rawBody : undefined;

  const init: RequestInit = {
    method: req.method,
    headers,
    body,
    cache: "no-store",
    redirect: "manual",
  };

  // 요청 + 리다이렉트 수동 팔로우
  let upstreamRes = await fetchFollow(upstreamUrl, init, upstreamBase);

  // 404/405 → 슬래시 토글 재시도
  if (
    (upstreamRes.status === 404 || upstreamRes.status === 405) &&
    wantsSlash
  ) {
    const toggled = normalizedPath.endsWith("/")
      ? normalizedPath.slice(0, -1)
      : normalizedPath + "/";
    const retryUrl = new URL(toggled + orig.search, upstreamBase);
    const retryRes = await fetchFollow(retryUrl, init, upstreamBase);
    if (retryRes.status < 400) {
      upstreamRes = retryRes;
      upstreamUrl = retryUrl;
    }
  }

  const buf = await upstreamRes.arrayBuffer();

  // 디버그 헤더
  const respHeaders = new Headers(upstreamRes.headers);
  respHeaders.set("x-upstream-url", upstreamUrl.toString());
  if (upstreamRes.status >= 400) {
    try {
      respHeaders.set(
        "x-upstream-error",
        new TextDecoder().decode(buf).slice(0, 200).replace(/\s+/g, " ")
      );
    } catch {}
  }
  for (const k of ["content-encoding", "transfer-encoding", "connection"])
    respHeaders.delete(k);

  return new Response(buf, {
    status: upstreamRes.status,
    headers: respHeaders,
  });
}

async function fetchFollow(url: URL, init: RequestInit, base: string) {
  let r = await fetch(url, init);
  if ([301, 302, 303, 307, 308].includes(r.status)) {
    const loc = r.headers.get("location");
    if (loc) r = await fetch(new URL(loc, base), init); // 메서드 유지
  }
  return r;
}
