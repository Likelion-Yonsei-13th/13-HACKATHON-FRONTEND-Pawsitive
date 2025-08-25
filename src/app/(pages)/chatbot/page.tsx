// app/chatbot/page.tsx
"use client";

import PageLayout from "@/app/components/PageLayout";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

/* -------------------- 모바일 키보드 감지 -------------------- */
function useKeyboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const vv = window.visualViewport;

    const update = () => {
      if (!vv) {
        const open = window.innerHeight < screen.height * 0.8;
        setIsOpen(open);
        setOffset(0);
        return;
      }
      const dy = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setIsOpen(dy > 80);
      setOffset(dy);
    };

    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    window.addEventListener("orientationchange", update);
    update();

    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return { isOpen, offset };
}

/* -------------------- 엔드포인트 (트레일링 슬래시 유지) -------------------- */
const EP = {
  createSession: "/api/chatbot/api/session/create/",
  listMessages: (sid: string) => `/api/chatbot/api/messages/${sid}/`,
  chat: "/api/chatbot/api/chat/",
};

/* -------------------- 토큰/유틸 -------------------- */
function readAccessToken(): string | null {
  try {
    const direct = localStorage.getItem("access_token");
    if (direct) return direct;
    const alt = localStorage.getItem("neston_auth_v1");
    if (alt) {
      const obj = JSON.parse(alt);
      return obj?.access_token || obj?.access || null;
    }
  } catch {}
  return null;
}

function decodeJwt(token: string | null): any | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(payload);
    return JSON.parse(json);
  } catch {
    return null;
  }
}
function isTokenExpired(token: string | null, skewMs = 90_000): boolean {
  const p = decodeJwt(token);
  if (!p?.exp) return false;
  const expMs = Number(p.exp) * 1000;
  return Date.now() >= expMs - skewMs;
}

/* -------------------- axios 인스턴스 -------------------- */
const api = axios.create({ withCredentials: true });
api.defaults.headers.common["Accept"] = "application/json";
api.defaults.headers.common["Content-Type"] = "application/json";

// 요청 직전에 Authorization을 defaults에 세팅
function applyAuthHeader() {
  const token = readAccessToken();
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

async function getJSON<T>(url: string): Promise<T> {
  applyAuthHeader();
  const res = await api.get<T>(url, { validateStatus: () => true });
  if (res.status >= 200 && res.status < 300) return res.data as T;
  const anyData: any = res.data || {};
  throw new Error(
    anyData?.message ||
      anyData?.detail ||
      res.statusText ||
      `GET 실패: ${res.status}`
  );
}

async function postJSON<T>(url: string, body?: any): Promise<T> {
  applyAuthHeader();
  const res = await api.post<T>(url, body === undefined ? undefined : body, {
    validateStatus: () => true,
  });
  if (res.status >= 200 && res.status < 300) return res.data as T;
  const anyData: any = res.data || {};
  throw new Error(
    anyData?.message ||
      anyData?.detail ||
      res.statusText ||
      `POST 실패: ${res.status}`
  );
}

/* -------------------- 세션 생성: 빈 바디로 POST -------------------- */
async function createSession(): Promise<{
  success: boolean;
  session_id: string;
  created_at: string;
}> {
  const data = await postJSON<{
    success: boolean;
    session_id: string;
    created_at: string;
  }>(EP.createSession, undefined); // 빈 바디
  if (!data?.session_id) throw new Error("세션 ID가 응답에 없습니다.");
  return data;
}

/* -------------------- 타입/정규화 -------------------- */
type RawMsg = {
  id: number | string;
  type: "user" | "bot";
  content: string;
  timestamp?: string;
};

type Msg = {
  id: number | string;
  role: "user" | "bot";
  text: string;
  timestamp?: string;
};

function normalizeMessages(raw: any): RawMsg[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.messages)) return raw.messages;
  if (Array.isArray(raw?.results)) return raw.results;
  if (Array.isArray(raw?.data)) return raw.data;
  if (raw && typeof raw === "object" && (raw as any).id && (raw as any).content)
    return [raw as RawMsg];
  return [];
}

/* -------------------- 컴포넌트 -------------------- */
export default function Chatbot() {
  const { isOpen, offset } = useKeyboard();
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [sending, setSending] = useState(false);

  const hasMessages = messages.length > 0;
  const hideCtas = isOpen || focused || hasMessages;
  const bottomSafePadding = useMemo(() => 80, []);

  useEffect(() => {
    (async () => {
      try {
        const token = readAccessToken();
        if (!token || isTokenExpired(token)) {
          try {
            localStorage.removeItem("access_token");
          } catch {}
          try {
            localStorage.removeItem("neston_auth_v1");
          } catch {}
          window.location.replace("/login");
          return;
        }

        let sid = localStorage.getItem("neston_chat_session_id");
        if (!sid) {
          const created = await createSession();
          sid = created.session_id;
          localStorage.setItem("neston_chat_session_id", sid);
        }
        setSessionId(sid);

        const raw = await getJSON<any>(EP.listMessages(sid!));
        const normalized = normalizeMessages(raw);
        setMessages(
          normalized.map((m) => ({
            id: m.id,
            role: m.type,
            text: m.content,
            timestamp: m.timestamp,
          }))
        );
      } catch (e) {
        console.error(e);
        alert((e as any)?.message || "초기화 실패");
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const send = async () => {
    const v = input.trim();
    if (!v || !sessionId || sending) return;
    setSending(true);

    const tempId = `temp-${Date.now()}`;
    const userMsg: Msg = { id: tempId, role: "user", text: v };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const reply = await postJSON<{ title?: string; content: string }>(
        EP.chat,
        { message: v, session_id: sessionId }
      );
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "bot", text: reply.content || "" },
      ]);
    } catch (e) {
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      alert((e as any)?.message || "메시지 전송 실패");
    } finally {
      setSending(false);
    }
  };

  return (
    <PageLayout>
      <div
        className="relative mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-4"
        style={{
          paddingBottom: `calc(${bottomSafePadding}px + env(safe-area-inset-bottom))`,
        }}
      >
        {!hasMessages && (
          <div className="flex w-full flex-col items-center">
            <div className="mt-10 rounded-[50px] border-2 bg-mainMint px-29 py-6 text-center text-xl">
              <p>안녕하세요,</p>
              <p>
                <strong>NestOn</strong> 입니다
              </p>
            </div>
            <Image
              src="/svg/mainLogo.svg"
              alt="chatbot"
              width={150}
              height={122}
              className="mt-13 mb-6"
              priority
            />
          </div>
        )}

        {!hideCtas && (
          <section className="mt-8 flex flex-col justify-center">
            <p className="mb-10 text-center text-lg font-midium underline underline-offset-10">
              무엇을 도와드릴까요?
            </p>
            <div className="space-y-5">
              <button className="w-full rounded-full bg-white px-2 py-4 text-base font-medium shadow-md">
                NestOn 추천 행사 보기
              </button>
              <button className="w-full rounded-full bg-white px-6 py-4 text-base font-medium shadow-md">
                관심 지역 이슈 TOP 10
              </button>
            </div>
          </section>
        )}

        <div className={hasMessages ? "w-full mt-20" : "w-full"}>
          <div className="h-[40vh] w-full">
            <div ref={listRef} className="h-full w-full overflow-y-auto pr-1">
              {messages.map((m) => {
                const isUser = m.role === "user";
                return (
                  <div
                    key={m.id}
                    className={`mb-3 flex ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="max-w-[80%] rounded-2xl bg-white px-4 py-2 shadow">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {m.text}
                      </p>
                    </div>
                  </div>
                );
              })}
              {initializing && (
                <div className="mb-3 flex justify-center">
                  <div className="rounded-2xl bg-white px-4 py-2 shadow text-xs text-gray-500">
                    불러오는 중…
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="fixed inset-x-0 z-50 flex flex-row justify-center items-center gap-3 mx-4 mb-8"
          style={{
            bottom: offset,
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          <div className="mb-2 rounded-full w-full bg-white p-2 shadow-sm">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                placeholder={sessionId ? "메시지 보내기" : "세션 준비 중..."}
                className="h-8 flex-1 rounded-full bg-white px-4 outline-none placeholder:text-gray-400"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoComplete="off"
                autoCorrect="off"
                enterKeyHint="send"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                disabled={!sessionId || sending}
              />
            </div>
          </div>
          <button
            className="px-3 py-2 place-items-center rounded-full border bg-white"
            onClick={send}
            aria-label="전송"
            title="전송"
            disabled={!sessionId || sending || !input.trim()}
          >
            ↑
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
