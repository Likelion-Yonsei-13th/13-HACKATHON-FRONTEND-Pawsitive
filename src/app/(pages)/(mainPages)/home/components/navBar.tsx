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
      <div className="h-16 px-6 py-10 w-full flex flex-row justify-between items-center relative z-40">
        <button onClick={onMenuClick}>
          <img src="/svg/menu.svg" alt="menu" />
        </button>

        <Link href="/">
          <img src="/svg/NestOn.svg" alt="NestOn" />
        </Link>

        <Link href="/alarm" className="relative inline-block">
          <img src="/svg/alarm.svg" alt="alarm" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[11px] leading-[18px] text-center shadow">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
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
