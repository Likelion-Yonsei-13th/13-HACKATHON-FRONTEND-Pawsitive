export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 사전요청(OPTIONS)/HEAD가 들어오면 204로 응답해 405 방지
export async function OPTIONS() {
  return new Response(null, { status: 204 });
}
export async function HEAD() {
  return new Response(null, { status: 204 });
}

function abortAfter(ms: number) {
  const ac = new AbortController();
  const id = setTimeout(() => ac.abort(), ms);
  return { signal: ac.signal, done: () => clearTimeout(id) };
}

async function delegate(usernameRaw: string | null) {
  const username = (usernameRaw ?? "").trim();
  if (!username) {
    return Response.json(
      { success: false, message: "username is required", data: null },
      { status: 400 }
    );
  }

  // 업스트림과 상성이 가장 좋은 순서: POST + 슬래시 → POST → GET + 슬래시 → GET
  const attempts: Array<{
    method: "POST" | "GET";
    url: string;
    body?: string;
  }> = [
    {
      method: "POST",
      url: "https://neston.ai.kr/api/user/check-username/",
      body: JSON.stringify({ username }),
    },
    {
      method: "POST",
      url: "https://neston.ai.kr/api/user/check-username",
      body: JSON.stringify({ username }),
    },
    {
      method: "GET",
      url: `https://neston.ai.kr/api/user/check-username/?username=${encodeURIComponent(
        username
      )}`,
    },
    {
      method: "GET",
      url: `https://neston.ai.kr/api/user/check-username?username=${encodeURIComponent(
        username
      )}`,
    },
  ];

  const { signal, done } = abortAfter(7000); // 7초 타임아웃
  try {
    for (const a of attempts) {
      const res = await fetch(a.url, {
        method: a.method,
        headers:
          a.method === "POST"
            ? { "Content-Type": "application/json", accept: "application/json" }
            : { accept: "application/json" },
        ...(a.method === "POST" ? { body: a.body } : {}),
        cache: "no-store",
        redirect: "follow",
        signal,
      });

      // 업스트림이 405/404를 주면 다음 시도, 그 외면 그대로 반환
      if (res.status !== 405 && res.status !== 404) {
        const text = await res.text();
        return new Response(text, {
          status: res.status,
          headers: {
            "content-type":
              res.headers.get("content-type") ?? "application/json",
          },
        });
      }
    }
    // 모두 405/404면 업스트림 조합이 막혀있는 것
    return Response.json(
      {
        success: false,
        message: "upstream returned 405/404 for all variants",
        data: null,
      },
      { status: 502 }
    );
  } catch (e) {
    const isAbort =
      typeof e === "object" && e && (e as any).name === "AbortError";
    return Response.json(
      {
        success: false,
        message: isAbort ? "upstream timeout" : String(e),
        data: null,
      },
      { status: isAbort ? 504 : 502 }
    );
  } finally {
    done();
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({} as { username?: string }));
  return delegate(body?.username ?? null);
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  return delegate(u.searchParams.get("username"));
}
