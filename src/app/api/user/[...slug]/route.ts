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
  const basePath = `/api/user/${slug.join("/")}`;
  const isWrite = /^(POST|PUT|PATCH|DELETE)$/i.test(req.method);
  const normalizedPath = isWrite ? `${basePath}/` : basePath;
  const upstreamUrl = new URL(normalizedPath + orig.search, upstreamBase);

  const headers = new Headers();
  const auth =
    req.headers.get("authorization") || req.headers.get("Authorization");
  if (auth) {
    headers.set("Authorization", auth);
    headers.set("authorization", auth);
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
  let r = await fetch(upstreamUrl, init);
  if ([301, 302, 303, 307, 308].includes(r.status)) {
    const loc = r.headers.get("location");
    if (loc) r = await fetch(new URL(loc, upstreamBase), init);
  }

  const buf = await r.arrayBuffer();
  const respHeaders = new Headers(r.headers);
  respHeaders.set("x-upstream-url", upstreamUrl.toString());
  if (r.status >= 400) {
    try {
      const txt = new TextDecoder().decode(buf);
      respHeaders.set(
        "x-upstream-error",
        txt.slice(0, 200).replace(/[^\x20-\x7E]/g, "?")
      );
    } catch {}
  }
  for (const k of ["content-encoding", "transfer-encoding", "connection"])
    respHeaders.delete(k);

  return new Response(buf, { status: r.status, headers: respHeaders });
}
