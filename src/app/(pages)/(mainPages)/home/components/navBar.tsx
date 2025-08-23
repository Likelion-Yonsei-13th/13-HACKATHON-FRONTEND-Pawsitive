"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/app/providers/NotificationsProvider";

interface NavBarProps {
  onMenuClick: () => void;
  pageTitle?: string;
}

export default function NavBar({ onMenuClick, pageTitle }: NavBarProps) {
  const { unreadCount } = useNotifications();
  const router = useRouter();

  return (
    <nav className="relative mx-auto min-w-[320px] max-w-[500px] w-full flex flex-col bg-white">
      <div className="h-16 px-6 py-10 w-full flex flex-row items-center relative z-40">
        <button onClick={onMenuClick} className="relative z-10">
          <img src="/svg/menu.svg" alt="menu" />
        </button>

        <div className="flex flex-row ml-auto relative z-10">
          <Link href="/chatbot">
            <button>
              <img src="/svg/chatbot.svg" alt="chatbot" className="mr-3 z-10" />
            </button>
          </Link>
          <Link href="/alarm" className="relative inline-block">
            <img src="/svg/alarm.svg" alt="alarm" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[11px] leading-[18px] text-center shadow">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
        </div>

        {/* 메인로고 정중앙 고정 */}
        <Link
          href="/"
          aria-label="홈"
          className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
        >
          <img src="/svg/NestOn.svg" alt="NestOn" />
        </Link>
      </div>

      {pageTitle && (
        <div className="relative z-20 w-full bg-white border-b border-black py-3 text-center">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="뒤로가기"
            className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M15 18l-6-6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="hidden sm:inline">뒤로</span>
          </button>

          <h1 className="text-lg font-bold text-gray-800">{pageTitle}</h1>
        </div>
      )}
    </nav>
  );
}
