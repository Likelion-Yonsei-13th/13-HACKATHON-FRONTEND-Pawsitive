export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LoginBody = { username?: string; password?: string };

function ensureJson<T = any>(text: string): T | { raw: string } {
  try {
    return JSON.parse(text) as T;
  } catch {
    return { raw: text };
  }
}

function rewriteSetCookieForHost(setCookie: string, reqUrl: string) {
  const parts = setCookie.split(";").map((s) => s.trim());
  if (parts.length === 0) return setCookie;

  const isHttps = new URL(reqUrl).protocol === "https:";
  const nameVal = parts[0];
  const attrs = parts.slice(1);

  const kept: string[] = [];
  let hasHttpOnly = false;

  for (const a of attrs) {
    const low = a.toLowerCase();
    if (low.startsWith("domain=")) continue;
    if (low.startsWith("samesite=")) continue;
    if (low === "secure") continue;
    if (low === "httponly") {
      hasHttpOnly = true;
      kept.push("HttpOnly");
      continue;
    }
    kept.push(a);
  }

  if (!hasHttpOnly) kept.push("HttpOnly");
  kept.push("SameSite=Lax");
  if (isHttps) kept.push("Secure");

  if (!kept.some((a) => a.toLowerCase().startsWith("path="))) {
    kept.push("Path=/");
  }

  return [nameVal, ...kept].join("; ");
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}
export async function HEAD() {
  return new Response(null, { status: 204 });
}

export async function POST(req: Request) {
  const body: LoginBody = await req.json().catch(() => ({}));
  const username = String(body?.username ?? "").trim();
  const password = String(body?.password ?? "");

  if (!username || !password) {
    return Response.json(
      {
        status: 400,
        success: false,
        message: "username, password는 필수입니다.",
        data: null,
      },
      { status: 400 }
    );
  }

  const base = (
    process.env.NESTON_API_BASE || "https://neston.ai.kr/api"
  ).replace(/\/+$/, "");
  const url = process.env.NESTON_LOGIN_URL || `${base}/user/login/`;

  const upstream = await fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      ...(process.env.NESTON_API_KEY
        ? { "x-api-key": process.env.NESTON_API_KEY }
        : {}),
    },
    body: JSON.stringify({ username, password }),
    cache: "no-store",
    redirect: "follow",
  });

  const text = await upstream.text();
  const json = ensureJson(text);

  const raw = (upstream.headers as any).raw?.();
  const setCookies: string[] =
    raw?.["set-cookie"] ??
    (upstream.headers.get("set-cookie")
      ? [upstream.headers.get("set-cookie") as string]
      : []);

  const rewritten = setCookies.map((c) => {
    return /^refresh_token=/i.test(c) ? rewriteSetCookieForHost(c, req.url) : c;
  });

  const respHeaders = new Headers();
  respHeaders.set(
    "content-type",
    upstream.headers.get("content-type") ?? "application/json"
  );

  for (const c of rewritten) respHeaders.append("set-cookie", c);

  return new Response(
    typeof json === "object" ? JSON.stringify(json) : String(text),
    {
      status: upstream.status,
      headers: respHeaders,
    }
  );
}
