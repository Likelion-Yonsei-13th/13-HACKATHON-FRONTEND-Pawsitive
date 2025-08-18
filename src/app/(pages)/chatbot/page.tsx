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
        // visualViewport 미지원 브라우저용 대략치
        const open = window.innerHeight < screen.height * 0.8;
        setIsOpen(open);
        setOffset(0);
        return;
      }
      // 화면 높이 - 실제 보이는 높이 = 가려진 영역(대부분 키보드)
      const dy = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setIsOpen(dy > 80); // 80px 이상 줄어들면 키보드로 판단
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

export default function Chatbot() {
  const { isOpen, offset } = useKeyboard();
  const [focused, setFocused] = useState(false);
  const hideCtas = isOpen || focused;
  const inputRef = useRef<HTMLInputElement>(null);

  const bottomSafePadding = useMemo(() => 80, []); // 입력바 대략 높이
  return (
    <PageLayout>
      <div
        className="relative mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-4"
        style={{
          paddingBottom: `calc(${bottomSafePadding}px + env(safe-area-inset-bottom))`,
        }}
      >
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

        {/* 키보드가 가린 영역을 피하기 위한 여백*/}
        <div className="h-[40vh] w-full" />

        {/* 하단 입력 바 : 키보드 높이만큼 위로 끌어올림 + 안전영역 패딩 */}
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
              />
            </div>
          </div>
          <button
            className="px-3 py-2 place-items-center rounded-full border bg-white"
            onClick={() => {
              inputRef.current?.blur(); // 입력창 포커스 해제
            }}
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
