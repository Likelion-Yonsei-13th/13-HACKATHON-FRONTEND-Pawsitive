export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  return Response.json({ ok: true, echo: body }, { status: 200 });
}
