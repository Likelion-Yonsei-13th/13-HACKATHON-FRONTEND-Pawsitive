// src/app/api/public-data/alerts/route.ts
import { NextRequest, NextResponse } from "next/server";

function debug(label: string, payload: any) {
  console.log(`[alerts-proxy] ${label}:`, payload);
}

function buildCookieHeader(req: NextRequest) {
  return req.cookies
    .getAll()
    .map((c) => `${c.name}=${encodeURIComponent(c.value ?? "")}`)
    .join("; ");
}

function pickTokens(req: NextRequest) {
  const all = req.cookies.getAll();
  let access = "",
    refresh = "";
  for (const c of all) {
    const n = c.name.toLowerCase();
    if (/^(authorization|access[_-]?token|auth[_-]?token|jwt|token)$/.test(n))
      access = c.value ?? "";
    if (/^refresh[_-]?token$/.test(n)) refresh = c.value ?? "";
  }
  const strip = (v: string) =>
    v?.toLowerCase?.().startsWith("bearer ")
      ? v.slice(7).trim()
      : (v ?? "").trim();
  return { access: strip(access), refresh: strip(refresh) };
}

function extractTokenFromJson(j: any): string {
  if (!j || typeof j !== "object") return "";
  const flat =
    j.access_token ||
    j.access ||
    j.token ||
    j.id_token ||
    j.jwt ||
    j.authorization;
  if (typeof flat === "string" && flat) return flat;
  if (j.data) {
    const d = j.data;
    const nested =
      d.access_token || d.access || d.token || d.jwt || d.authorization;
    if (typeof nested === "string" && nested) return nested;
  }
  return "";
}

async function refreshAccessToken(
  origin: string,
  refresh: string,
  cookieHeader: string
) {
  const paths = (process.env.BACKEND_REFRESH_PATHS ?? "/api/token/refresh/") // 기본: SimpleJWT
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // 바디 키 후보: env 우선, 기본(3종) 보조
  const bodyKeys = (
    process.env.BACKEND_REFRESH_BODY_KEYS ??
    "refresh,refresh_token,refreshToken"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const path of paths) {
    const url = new URL(path, origin).toString();

    // 1) POST JSON (+쿠키)
    for (const key of bodyKeys) {
      const body = { [key]: refresh } as Record<string, string>;
      try {
        const r = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(cookieHeader ? { Cookie: cookieHeader } : {}),
          },
          body: JSON.stringify(body),
          cache: "no-store",
        });
        debug("refresh POST", { url, status: r.status });
        if (!r.ok) continue;

        const txt = await r.text();
        let token = "";
        try {
          token = extractTokenFromJson(JSON.parse(txt));
        } catch {}
        if (!token) {
          const auth = r.headers.get("authorization");
          if (auth?.toLowerCase().startsWith("bearer "))
            token = auth.slice(7).trim();
        }
        if (!token) {
          const sc = r.headers.get("set-cookie") || "";
          const m = /access[_-]?token=([^;]+)/i.exec(sc);
          if (m?.[1]) token = m[1];
        }
        if (token) return token;
      } catch (e) {
        debug("refresh POST error", { url, error: String(e) });
      }
    }

    // 2) GET + Authorization: Bearer <refresh> (+쿠키)
    try {
      const r = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${refresh}`,
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        cache: "no-store",
      });
      debug("refresh GET", { url, status: r.status });
      if (r.ok) {
        const j = await r.json().catch(() => ({}));
        const token = extractTokenFromJson(j);
        if (token) return token;
      }
    } catch (e) {
      debug("refresh GET error", { url, error: String(e) });
    }
  }
  return "";
}

export async function GET(req: NextRequest) {
  const origin = process.env.BACKEND_ORIGIN;
  if (!origin)
    return NextResponse.json(
      { error: "BACKEND_ORIGIN not set" },
      { status: 500 }
    );

  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const locationType = searchParams.get("location_type");
  if (!category || !locationType)
    return NextResponse.json(
      { error: "category와 location_type이 모두 필요합니다." },
      { status: 400 }
    );

  let authHeader = req.headers.get("authorization") ?? "";
  const cookieHeader = buildCookieHeader(req);

  if (!authHeader) {
    const { access, refresh } = pickTokens(req);
    debug("cookies", { hasAccess: !!access, hasRefresh: !!refresh });

    let accessToken = access;
    if (!accessToken && refresh) {
      accessToken = await refreshAccessToken(origin, refresh, cookieHeader);
      debug("refresh result", { issued: !!accessToken });
    }

    if (accessToken) authHeader = `Bearer ${accessToken}`;
    else
      return NextResponse.json(
        { detail: "Authentication credentials were not provided." },
        { status: 401 }
      );
  }

  const upstream = new URL("/api/public-data/alerts/", origin);
  upstream.search = searchParams.toString();

  const resp = await fetch(upstream.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    },
    cache: "no-store",
  });

  const text = await resp.text();
  const out = new NextResponse(text, {
    status: resp.status,
    headers: {
      "Content-Type": resp.headers.get("content-type") ?? "application/json",
      "x-debug-alerts-status": String(resp.status),
    },
  });

  // 새 access 토큰을 쿠키로 심어 다음 요청 단축
  const m = /^Bearer\s+(.+)$/.exec(authHeader);
  if (m?.[1])
    out.cookies.set("access_token", m[1], {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: false,
    });

  return out;
}
