"use client";

import PageLayout from "@/app/components/PageLayout";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

// 모바일 키보드 열림 감지 + 키보드 높이만큼 높이 조정
function useKeyboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [offset, setOffset] = useState(0); // 키보드가 가린 만큼 px

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
      // 80px 이상 줄어들면 키보드로 판단함
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

type Msg = { id: number; role: "user"; text: string };

export default function Chatbot() {
  const { isOpen, offset } = useKeyboard();
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;
  const hideCtas = isOpen || focused || hasMessages;

  // 일단 로컬스토리지에 메세지 내용 저장하도록 구현
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("neston_chat_messages");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Msg[];
        if (Array.isArray(parsed)) setMessages(parsed);
      } catch {}
    }
  }, []);

  // 로컬스토리지 저장
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("neston_chat_messages", JSON.stringify(messages));
  }, [messages]);

  // 새 메시지 생기면 스크롤 맨 아래로 가도록 함
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // 전송
  const send = () => {
    const v = input.trim();
    if (!v) return;
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", text: v }]);
    setInput("");
  };

  const bottomSafePadding = useMemo(() => 80, []);

  return (
    <PageLayout>
      <div
        className="relative mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-4"
        style={{
          paddingBottom: `calc(${bottomSafePadding}px + env(safe-area-inset-bottom))`,
        }}
      >
        {/* 첫 메시지 이후엔 인사말, 로고 숨김 */}
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
              height={100}
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

        {/* 채팅 영역 */}
        <div className={hasMessages ? "w-full mt-20" : "w-full"}>
          <div className="h-[40vh] w-full">
            <div ref={listRef} className="h-full w-full overflow-y-auto pr-1">
              {messages.map((m) => (
                <div key={m.id} className="mb-3 flex justify-end">
                  <div className="max-w-[80%] rounded-2xl bg-white px-4 py-2 shadow">
                    <p className="text-sm leading-relaxed">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 하단 입력 바 */}
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
                placeholder="메시지 보내기"
                className="h-8 flex-1 rounded-full bg-whtie px-4 outline-none placeholder:text-gray-400"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                autoComplete="off"
                autoCorrect="off"
                enterKeyHint="send"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
              />
            </div>
          </div>
          <button
            className="px-3 py-2 place-items-center rounded-full border bg-white"
            onClick={send}
            aria-label="전송"
            title="전송"
          >
            ↑
          </button>
        </div>
      </div>
    </PageLayout>
  );
}
