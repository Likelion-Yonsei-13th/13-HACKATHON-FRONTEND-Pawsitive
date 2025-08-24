export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}
export async function HEAD() {
  return new Response(null, { status: 204 });
}

type InBody = Partial<{
  name: string;
  username: string;
  password: string;
  password2: string;
  phone_number: string;
  birth_date: string; // "YYYY-MM-DD"
  full_name: string;
  birth: string; // "YYYYMMDD"
}>;

function toIsoBirth(input: string): string | undefined {
  const only = (input || "").replace(/\D/g, "");
  if (!only) return undefined;

  if (/^\d{8}$/.test(only))
    return `${only.slice(0, 4)}-${only.slice(4, 6)}-${only.slice(6, 8)}`;

  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  return undefined;
}

export async function POST(req: Request) {
  const raw: unknown = await req.json().catch(() => ({}));
  const b: InBody = typeof raw === "object" && raw ? (raw as InBody) : {};

  const name = String(b.name ?? b.full_name ?? "").trim();
  const username = String(b.username ?? "").trim();
  const password = String(b.password ?? "").toString();
  const password2 = String(b.password2 ?? b.password ?? "").toString();
  const phone_number = String(b.phone_number ?? "").replace(/\D/g, "");

  const birth_date =
    toIsoBirth(String(b.birth_date ?? b.birth ?? "")) ?? undefined;

  if (!name || !username || !password || !password2 || !phone_number) {
    return Response.json(
      {
        status: 400,
        success: false,
        message:
          "필수 값 누락(name, username, password, password2, phone_number). birth_date는 선택입니다.",
        data: null,
      },
      { status: 400 }
    );
  }

  const payload: Record<string, unknown> = {
    name,
    username,
    password,
    password2,
    phone_number,
  };
  if (birth_date) payload.birth_date = birth_date;

  const url = "https://neston.ai.kr/api/user/signup/";
  const headers: Record<string, string> = {
    accept: "application/json",
    "content-type": "application/json",
  };
  if (process.env.NESTON_API_KEY)
    headers["x-api-key"] = process.env.NESTON_API_KEY;
  if (process.env.NESTON_BEARER)
    headers["authorization"] = process.env.NESTON_BEARER;

  const upstream = await fetch(url, {
    method: "POST",
    headers,
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
      "x-upstream-variant": `POST ${url}`,
      "x-upstream-keys": Object.keys(payload).join(","), // 디버깅용
    },
  });
}
