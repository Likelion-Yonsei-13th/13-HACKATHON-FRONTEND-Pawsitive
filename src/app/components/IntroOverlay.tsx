"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

/* 통신 전 로컬로 로그인 정보 저장하게 함 */

const AUTH_KEY = "neston_auth_v1";
const STAY_MS = 1000; // 키 O 일 때 인트로 시간
const FALLBACK_STAY_MS = 1000; // 키 X 일 때 인트로 시간 -> 로그인 페이지 이동
const FADE_MS = 400; // 페이드아웃 시간

export default function IntroOverlay() {
  const pathname = usePathname();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    const goLogin = () => router.replace("/login");

    try {
      const saved = localStorage.getItem(AUTH_KEY);

      setVisible(true);
      setFadeOut(false);

      if (saved) {
        timers.push(setTimeout(() => setFadeOut(true), STAY_MS));
        timers.push(setTimeout(() => setVisible(false), STAY_MS + FADE_MS));
      } else {
        timers.push(setTimeout(goLogin, FALLBACK_STAY_MS));
      }
    } catch {
      // localStorage 접근 실패시 로그인 이동
      setVisible(true);
      setFadeOut(false);
      timers.push(setTimeout(goLogin, FALLBACK_STAY_MS));
    }

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [pathname, router]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white
                  transition-opacity duration-500 ${
                    fadeOut ? "opacity-0" : "opacity-100"
                  }`}
      // 페이드 중 클릭 방지함
      style={{ pointerEvents: fadeOut ? ("none" as const) : "auto" }}
      aria-hidden={fadeOut}
    >
      <div className="text-center bg-[linear-gradient(180deg,_#fff_0%,_#DBFFEA_100%)] flex flex-col justify-center items-center gap-15 w-screen min-h-screen">
        <Image
          src="/svg/mainLogo.svg"
          alt="NestOn"
          width={150}
          height={100}
          priority
        />
        <p className="text-xl font-midium">
          우리 동네의 모든 순간을 켜다, NestOn
        </p>
      </div>
    </div>
  );
}
