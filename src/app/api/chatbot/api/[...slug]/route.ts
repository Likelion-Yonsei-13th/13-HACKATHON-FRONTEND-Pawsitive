// route.ts (드랍인 교체용)
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
export async function DELETE(
  req: Request,
  ctx: { params: { slug: string[] } }
) {
  return proxy(req, ctx);
}
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: "GET,POST,PUT,DELETE,OPTIONS" },
  });
}

async function proxy(req: Request, { params }: { params: { slug: string[] } }) {
  const upstreamBase =
    process.env.NESTON_UPSTREAM_BASE || "https://neston.ai.kr";
  const orig = new URL(req.url);
  const basePath = `/api/chatbot/api/${(params.slug || []).join("/")}`;

  // 1) POST/PUT/PATCH/DELETE 는 무조건 슬래시 강제
  const wantsSlash = /^(POST|PUT|PATCH|DELETE)$/i.test(req.method);
  const normalizedPath = wantsSlash ? `${basePath}/` : basePath;
  let upstreamUrl = new URL(normalizedPath + orig.search, upstreamBase);

  // 2) 헤더 화이트리스트 (쿠키/Origin 등 제거)
  const headers = new Headers();
  for (const k of ["authorization", "accept", "content-type"]) {
    const v = req.headers.get(k);
    if (v) headers.set(k, v);
  }
  headers.delete("cookie");
  headers.delete("origin");
  headers.delete("referer");
  headers.delete("sec-fetch-site");
  headers.delete("sec-fetch-mode");
  headers.delete("sec-fetch-dest");
  headers.delete("host");
  headers.delete("connection");
  headers.delete("content-length");
  headers.delete("accept-encoding");
  headers.delete("x-forwarded-host");
  headers.delete("x-forwarded-proto");

  // 3) 빈 바디면 생략
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

  // 4) 요청 + 리다이렉트 수동 팔로우(메서드 유지)
  let upstreamRes = await fetchFollow(upstreamUrl, init, upstreamBase);

  // 5) 404/405면 슬래시 토글 재시도 (일부 서버 설정 보호)
  if (
    (upstreamRes.status === 404 || upstreamRes.status === 405) &&
    /^(POST|PUT|PATCH|DELETE)$/i.test(req.method)
  ) {
    const toggledPath = normalizedPath.endsWith("/")
      ? normalizedPath.slice(0, -1)
      : normalizedPath + "/";
    const retryUrl = new URL(toggledPath + orig.search, upstreamBase);
    const retryRes = await fetchFollow(retryUrl, init, upstreamBase);
    if (retryRes.status < 400) {
      upstreamRes = retryRes;
      upstreamUrl = retryUrl;
    }
  }

  const buf = await upstreamRes.arrayBuffer();
  if (upstreamRes.status >= 400) {
    try {
      console.error(
        "[upstream]",
        upstreamRes.status,
        new TextDecoder().decode(buf)
      );
    } catch {}
  }

  const respHeaders = new Headers(upstreamRes.headers);
  respHeaders.set("x-upstream-url", upstreamUrl.toString());
  respHeaders.delete("content-encoding");
  respHeaders.delete("transfer-encoding");
  respHeaders.delete("connection");

  return new Response(buf, {
    status: upstreamRes.status,
    headers: respHeaders,
  });
}

async function fetchFollow(url: URL, init: RequestInit, base: string) {
  let r = await fetch(url, init);
  if ([301, 302, 303, 307, 308].includes(r.status)) {
    const loc = r.headers.get("location");
    if (loc) {
      const next = new URL(loc, base);
      r = await fetch(next, init); // 메서드 유지
    }
  }
  return r;
}
