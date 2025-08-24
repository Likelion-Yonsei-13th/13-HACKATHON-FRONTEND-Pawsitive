// app/api/user/signup/route.ts
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type InBody = Partial<{
  // 가입 필드(프론트에서 오는 그대로)
  name: string;
  username: string;
  password: string;
  password2: string;
  phone_number: string;
  birth_date: string; // YYYY-MM-DD (nullable 가능)

  // 약관 동의(회원가입 전 필수)
  location_services_agreed: boolean | string | number;
  marketing_push_agreed: boolean | string | number; // 커뮤니티 동의 매핑
  terms_agreed: boolean | string | number;
  privacy_agreed: boolean | string | number;
}>;

function toBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string")
    return ["1", "true", "y", "yes", "on"].includes(v.trim().toLowerCase());
  return false;
}

function onlyDigits(s: string) {
  return (s || "").replace(/\D/g, "");
}
function toYYYYMMDD(input?: string): string | undefined {
  const s = (input || "").trim();
  if (!s) return undefined;
  const digits = s.replace(/\D/g, "");
  if (/^\d{8}$/.test(digits)) return digits; // already YYYYMMDD
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (m) return `${m[1]}${m[2]}${m[3]}`; // YYYY-MM-DD -> YYYYMMDD
  return undefined;
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}
export async function HEAD() {
  return new Response(null, { status: 204 });
}

export async function POST(req: Request) {
  const raw = await req.json().catch(() => ({}));
  const b: InBody = raw && typeof raw === "object" ? (raw as InBody) : {};

  // --- 0) 필수 입력 검증 ---
  const name = String(b.name ?? "").trim();
  const username = String(b.username ?? "").trim();
  const password = String(b.password ?? "");
  const password2 = String(b.password2 ?? "");
  const phone_number = onlyDigits(String(b.phone_number ?? ""));
  const birth_date = b.birth_date ? String(b.birth_date) : undefined;

  if (!name || !username || !password || !password2 || !phone_number) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message:
          "필수 값 누락(name, username, password, password2, phone_number).",
        data: null,
      },
      { status: 400 }
    );
  }
  if (password !== password2) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message: "비밀번호가 일치하지 않습니다.",
        data: null,
      },
      { status: 400 }
    );
  }

  // --- 1) 동의 4개 검증(회원가입 전 필수) ---
  const location_services_agreed = toBool(b.location_services_agreed);
  const marketing_push_agreed = toBool(b.marketing_push_agreed); // 커뮤니티
  const terms_agreed = toBool(b.terms_agreed);
  const privacy_agreed = toBool(b.privacy_agreed);

  if (
    !(
      location_services_agreed &&
      marketing_push_agreed &&
      terms_agreed &&
      privacy_agreed
    )
  ) {
    return NextResponse.json(
      {
        status: 400,
        success: false,
        message:
          "필수 약관 동의가 모두 필요합니다. (location_services_agreed, marketing_push_agreed, terms_agreed, privacy_agreed)",
        data: null,
      },
      { status: 400 }
    );
  }

  // --- 2) 업스트림 URL ---
  const base = (
    process.env.NESTON_API_BASE || "https://neston.ai.kr/api"
  ).replace(/\/+$/, "");
  const url = process.env.NESTON_SIGNUP_URL || `${base}/user/signup/`;

  // --- 3) 1차: 신규 스펙 그대로 ---
  const payloadNew: Record<string, unknown> = {
    name,
    username,
    password,
    password2,
    phone_number,
    ...(birth_date ? { birth_date } : {}),
    // 동의 4개도 함께 전달(업스트림이 받으면 OK, 모르면 무시)
    location_services_agreed,
    marketing_push_agreed,
    terms_agreed,
    privacy_agreed,
  };

  const commonHeaders: Record<string, string> = {
    accept: "application/json",
    "content-type": "application/json",
    ...(process.env.NESTON_API_KEY
      ? { "x-api-key": process.env.NESTON_API_KEY }
      : {}),
  };

  let upstream = await fetch(url, {
    method: "POST",
    headers: commonHeaders,
    body: JSON.stringify(payloadNew),
    cache: "no-store",
    redirect: "follow",
  });

  // --- 4) 실패 시: 레거시 스펙으로 재시도 ---
  if (!upstream.ok) {
    const birthLegacy = toYYYYMMDD(birth_date) || ""; // 레거시는 YYYYMMDD
    const payloadLegacy: Record<string, unknown> = {
      full_name: name,
      username,
      password1: password,
      password2,
      phone_number,
      ...(birthLegacy ? { birth: birthLegacy } : {}),
      // 동의 4개도 전달 시도(업스트림이 모르면 무시)
      location_services_agreed,
      marketing_push_agreed,
      terms_agreed,
      privacy_agreed,
    };

    const upstream2 = await fetch(url, {
      method: "POST",
      headers: commonHeaders,
      body: JSON.stringify(payloadLegacy),
      cache: "no-store",
      redirect: "follow",
    });

    const text2 = await upstream2.text();
    return new NextResponse(text2, {
      status: upstream2.status,
      headers: {
        "content-type":
          upstream2.headers.get("content-type") ?? "application/json",
        "x-upstream-variant": `POST ${url} (fallback: legacy)`,
        "x-upstream-keys": Object.keys(payloadLegacy).join(","),
      },
    });
  }

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ?? "application/json",
      "x-upstream-variant": `POST ${url} (primary: new)`,
      "x-upstream-keys": Object.keys(payloadNew).join(","),
    },
  });
}
