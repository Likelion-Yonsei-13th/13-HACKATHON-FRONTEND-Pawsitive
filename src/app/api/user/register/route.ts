import { NextResponse } from "next/server";
import type { RegisterBody } from "@/types/api";

export async function POST(req: Request) {
  const payload: RegisterBody = await req.json();

  const upstream = await fetch("https://neston.ai.kr/api/user/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const body = await upstream.text();
  return new NextResponse(body, {
    status: upstream.status,
    headers: {
      "content-type":
        upstream.headers.get("content-type") ?? "application/json",
    },
  });
}
