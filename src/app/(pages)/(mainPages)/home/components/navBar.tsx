"use client";
import Link from "next/link";
import React from "react";
import { useNotifications } from "@/app/providers/NotificationsProvider";

interface NavBarProps {
  onMenuClick: () => void;
  pageTitle?: string;
}

export default function NavBar({ onMenuClick, pageTitle }: NavBarProps) {
  const { unreadCount } = useNotifications();

  return (
    <nav className="relative mx-auto min-w-[320px] max-w-[500px] w-full flex flex-col bg-white">
      <div className="h-16 px-6 py-10 w-full flex flex-row items-center relative z-40">
        <button onClick={onMenuClick} className="relative z-10">
          <img src="/svg/menu.svg" alt="menu" />
        </button>

        <div className="flex flex-row ml-auto relative z-10">
          <Link href="/chatbot">
            <button>
              <img src="/svg/chatbot.svg" alt="chatbot" className="mr-3" />
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
        <div className="w-full bg-white border-b-1 border-black py-3 text-l text-center font-bold text-gray-800 relative z-20">
          <h1>{pageTitle}</h1>
        </div>
      )}
    </nav>
  );
}
