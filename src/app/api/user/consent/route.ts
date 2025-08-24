// app/api/user/consent/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}
export async function HEAD() {
  return new Response(null, { status: 204 });
}

type InBody = Partial<{
  location_services_agreed: boolean | string | number;
  marketing_push_agreed: boolean | string | number; // ← 커뮤니티 동의 매핑
  terms_agreed: boolean | string | number;
  privacy_agreed: boolean | string | number;
}>;

function toBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  if (typeof v === "string") {
    const s = v.trim().toLowerCase();
    return ["1", "true", "y", "yes", "on"].includes(s);
  }
  return false;
}

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || ""; // 있으면 전달, 없으면 무시

  // 1) 바디 파싱
  let body: any = {};
  try {
    body = await req.json();
  } catch {}
  const b: InBody = typeof body === "object" && body ? body : {};

  const location_services_agreed = toBool(b.location_services_agreed);
  const marketing_push_agreed = toBool(b.marketing_push_agreed); // ← 커뮤니티
  const terms_agreed = toBool(b.terms_agreed);
  const privacy_agreed = toBool(b.privacy_agreed);

  // 2) 필수 4개 모두 true 확인 (회원가입 전에 필수)
  if (
    !(
      location_services_agreed &&
      marketing_push_agreed &&
      terms_agreed &&
      privacy_agreed
    )
  ) {
    return Response.json(
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

  const payload = {
    location_services_agreed,
    marketing_push_agreed, // 커뮤니티 동의
    terms_agreed,
    privacy_agreed,
  };

  // 3) 업스트림 URL (환경변수 우선)
  const upstreamUrl =
    process.env.NESTON_CONSENT_URL ||
    `${(process.env.NESTON_API_BASE || "https://neston.ai.kr/api").replace(
      /\/+$/,
      ""
    )}/user/consent/`;

  // 4) 포워딩
  const upstream = await fetch(upstreamUrl, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      ...(auth ? { authorization: auth } : {}), // 토큰 있으면 전달만
      ...(process.env.NESTON_API_KEY
        ? { "x-api-key": process.env.NESTON_API_KEY }
        : {}),
    },
    body: JSON.stringify(payload),
    cache: "no-store",
    redirect: "follow",
  });

  const text = await upstream.text();
  return new Response(text, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ?? "application/json",
      "x-upstream-variant": `POST ${upstreamUrl}`,
      "x-upstream-keys": Object.keys(payload).join(","),
    },
  });
}
