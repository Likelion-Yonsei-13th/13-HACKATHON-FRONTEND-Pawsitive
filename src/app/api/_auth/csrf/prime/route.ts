export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const upstreamBase =
    process.env.NESTON_UPSTREAM_BASE || "https://neston.ai.kr";
  const csrfCookieName = process.env.NESTON_CSRF_COOKIE_NAME || "csrftoken";

  const candidates = [
    process.env.NESTON_CSRF_PRIME_PATH || "/",
    "/api/csrf/",
    "/auth/csrf/",
    "/accounts/csrf/",
  ];

  let token: string | null = null;
  let lastStatus = 0;
  let lastUrl = "";

  for (const p of candidates) {
    const url = new URL(p, upstreamBase);
    lastUrl = url.toString();

    let r = await fetch(url, { method: "GET", redirect: "manual" });
    if ([301, 302, 303, 307, 308].includes(r.status)) {
      const loc = r.headers.get("location");
      if (loc) r = await fetch(new URL(loc, upstreamBase), { method: "GET" });
    }
    lastStatus = r.status;

    const setCookies = r.headers.getSetCookie?.() || [];
    token = extractCookieValue(setCookies, csrfCookieName);
    if (token) break;
  }

  const respHeaders = new Headers({ "Content-Type": "application/json" });
  if (token) {
    respHeaders.append(
      "Set-Cookie",
      `${encodeURIComponent(csrfCookieName)}=${encodeURIComponent(
        token
      )}; Path=/; HttpOnly; SameSite=Lax`
    );
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: respHeaders,
    });
  }

  respHeaders.set("x-csrf-probe", `${lastStatus} ${lastUrl}`);
  return new Response(JSON.stringify({ ok: false }), {
    status: 502,
    headers: respHeaders,
  });
}

function extractCookieValue(setCookies: string[], key: string): string | null {
  for (const sc of setCookies) {
    const [pair] = sc.split(";");
    const i = pair.indexOf("=");
    if (i > 0) {
      const k = decodeURIComponent(pair.slice(0, i).trim());
      if (k === key) return decodeURIComponent(pair.slice(i + 1).trim());
    }
  }
  return null;
}
