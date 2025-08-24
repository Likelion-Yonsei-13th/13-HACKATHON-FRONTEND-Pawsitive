import type { ApiResponse, RegisterBody } from "@/types/api";

export async function checkUsername(username: string) {
  const res = await fetch(
    `/api/user/check-username?username=${encodeURIComponent(username)}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!res.ok) throw new Error(`check-username 실패: ${res.status}`);

  const json: ApiResponse<unknown> = await res.json();
  return json;
}

export async function registerUser(body: RegisterBody) {
  const res = await fetch("/api/user/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json: ApiResponse = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `회원가입 실패: ${res.status}`);
  }
  return json;
}
