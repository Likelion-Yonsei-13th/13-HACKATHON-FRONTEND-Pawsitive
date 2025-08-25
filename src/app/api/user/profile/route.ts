import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // 매 요청마다 서버 호출
export const runtime = "nodejs"; // Edge에서도 가능하지만 Node 권장

function forwardHeaders(req: Request) {
  const incoming = new Headers(req.headers);
  const headers = new Headers();

  // 클라이언트가 보낸 인증/쿠키를 그대로 백엔드로 전달
  const auth = incoming.get("authorization");
  if (auth) headers.set("authorization", auth);

  const cookie = incoming.get("cookie");
  if (cookie) headers.set("cookie", cookie);

  return headers;
}

function jsonError(status: number, message: string) {
  return NextResponse.json(
    { status, success: false, message, data: null },
    { status }
  );
}

export async function GET(req: Request) {
  const API = process.env.NESTON_API_BASE;
  if (!API) return jsonError(500, "NESTON_API_BASE가 설정되어 있지 않습니다.");

  try {
    const r = await fetch(`${API}/user/profile/`, {
      headers: forwardHeaders(req),
      cache: "no-store",
    });
    const body = await r.text();
    return new NextResponse(body, {
      status: r.status,
      headers: {
        "content-type": r.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (e: any) {
    return jsonError(502, e?.message ?? "프로필 조회 프록시 실패");
  }
}

export async function PATCH(req: Request) {
  const API = process.env.NESTON_API_BASE;
  if (!API) return jsonError(500, "NESTON_API_BASE가 설정되어 있지 않습니다.");

  try {
    const headers = forwardHeaders(req);
    headers.set("content-type", "application/json");

    // 요청 본문 그대로 전달 (my_location_id, interested_location_id, interest_id)
    const body = await req.text();

    const r = await fetch(`${API}/user/profile/`, {
      method: "PATCH",
      headers,
      body,
    });
    const text = await r.text();

    return new NextResponse(text, {
      status: r.status,
      headers: {
        "content-type": r.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (e: any) {
    return jsonError(502, e?.message ?? "프로필 수정 프록시 실패");
  }
}
