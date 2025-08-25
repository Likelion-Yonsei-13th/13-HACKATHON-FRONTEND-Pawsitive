export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { slug: string[] };

async function handle(
  req: Request,
  ctx: { params: Params } | { params: Promise<Params> }
) {
  const p = (ctx as any).params?.then
    ? await (ctx as any).params
    : (ctx as any).params;
  const slug: string[] = Array.isArray(p?.slug) ? p.slug : [];
  return proxy(req, slug);
}

export async function GET(req: Request, ctx: any) {
  return handle(req, ctx);
}
export async function POST(req: Request, ctx: any) {
  return handle(req, ctx);
}
export async function PUT(req: Request, ctx: any) {
  return handle(req, ctx);
}
export async function PATCH(req: Request, ctx: any) {
  return handle(req, ctx);
}
export async function DELETE(req: Request, ctx: any) {
  return handle(req, ctx);
}
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: { Allow: "GET,POST,PUT,PATCH,DELETE,OPTIONS" },
  });
}

async function proxy(req: Request, slug: string[]) {
  const upstreamBase =
    process.env.NESTON_UPSTREAM_BASE || "https://neston.ai.kr";

  const orig = new URL(req.url);
  const slugPath = (slug || []).join("/");
  const basePath = `/api/chatbot/api/${slugPath}`;
  const isWrite = /^(POST|PUT|PATCH|DELETE)$/i.test(req.method);
  const normalizedPath = isWrite ? `${basePath}/` : basePath;
  let upstreamUrl = new URL(normalizedPath + orig.search, upstreamBase);

  const schemeOverride = (process.env.NESTON_AUTH_SCHEME || "").trim();

  const inAuth =
    req.headers.get("authorization") || req.headers.get("Authorization") || "";
  const parsed = parseAuth(inAuth);
  const effectiveAuth =
    schemeOverride && parsed?.token
      ? `${schemeOverride} ${parsed.token}`
      : inAuth;

  const headers = new Headers();
  if (effectiveAuth) {
    headers.set("Authorization", effectiveAuth);
    headers.set("authorization", effectiveAuth);
  }
  headers.set("Accept", req.headers.get("accept") || "application/json");
  const ct = req.headers.get("content-type");
  if (ct) headers.set("Content-Type", ct);

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

  const allowCookie =
    (process.env.NESTON_ALLOW_COOKIE_FOR_CHATBOT || "").toLowerCase() ===
    "true";
  const isChatbotWrite = /\/api\/chatbot\/api\/(session\/create|chat)\/?$/.test(
    normalizedPath.toLowerCase()
  );

  if (allowCookie && isChatbotWrite) {
    const cookie = req.headers.get("cookie");
    if (cookie) {
      headers.set("Cookie", cookie);
      const csrfCookieName = process.env.NESTON_CSRF_COOKIE_NAME || "csrftoken";
      const csrfHeaderName =
        process.env.NESTON_CSRF_HEADER_NAME || "X-CSRFToken";
      const csrf = pickCookie(cookie, csrfCookieName);
      if (csrf && !hasHeaderCaseInsensitive(headers, csrfHeaderName)) {
        headers.set(csrfHeaderName, csrf);
      }
    }
  }

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

  let upstreamRes = await fetchFollow(upstreamUrl, init, upstreamBase);

  if ((upstreamRes.status === 404 || upstreamRes.status === 405) && isWrite) {
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
  const respHeaders = new Headers(upstreamRes.headers);
  const ascii = (s: string) => s.replace(/[^\x20-\x7E]/g, "?");

  respHeaders.set("x-upstream-url", upstreamUrl.toString());
  if (effectiveAuth)
    respHeaders.set(
      "x-proxy-auth-sample",
      ascii(effectiveAuth.slice(0, 12) + "...")
    );
  respHeaders.set("x-auth-scheme", ascii(parsed?.scheme || ""));
  if (upstreamRes.status >= 400) {
    try {
      const txt = new TextDecoder().decode(buf);
      respHeaders.set("x-upstream-error", ascii(txt.slice(0, 200)));
    } catch {}
  }
  for (const k of ["content-encoding", "transfer-encoding", "connection"])
    respHeaders.delete(k);

  return new Response(buf, {
    status: upstreamRes.status,
    headers: respHeaders,
  });
}

function pickCookie(cookieHeader: string, key: string): string | null {
  try {
    const pairs = cookieHeader.split(";").map((s) => s.trim());
    for (const p of pairs) {
      const i = p.indexOf("=");
      if (i > 0) {
        const k = decodeURIComponent(p.slice(0, i));
        if (k === key) return decodeURIComponent(p.slice(i + 1));
      }
    }
  } catch {}
  return null;
}
function hasHeaderCaseInsensitive(h: Headers, name: string): boolean {
  const needle = name.toLowerCase();
  for (const [k] of h.entries()) if (k.toLowerCase() === needle) return true;
  return false;
}
function parseAuth(
  value: string | null
): { scheme: string; token: string } | null {
  if (!value) return null;
  const m = value.match(/^\s*([A-Za-z]+)\s+(.+)\s*$/);
  if (!m) return null;
  return { scheme: m[1], token: m[2] };
}
async function fetchFollow(url: URL, init: RequestInit, base: string) {
  let r = await fetch(url, init);
  if ([301, 302, 303, 307, 308].includes(r.status)) {
    const loc = r.headers.get("location");
    if (loc) r = await fetch(new URL(loc, base), init);
  }
  return r;
}
