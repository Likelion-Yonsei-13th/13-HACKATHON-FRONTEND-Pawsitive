"use client";
import Link from "next/link";
import React from "react";

interface NavBarProps {
  onMenuClick: () => void;
  pageTitle?: string;
}

export default function NavBar({ onMenuClick, pageTitle }: NavBarProps) {
  return (
    <nav className="relative mx-auto min-w-[320px] max-w-[500px] w-full flex flex-col bg-gray-200">
      <div className="h-16 px-6 w-full flex flex-row justify-between items-center relative z-40">
        <button onClick={onMenuClick}>
          <img src="/svg/menu.svg" alt="menu" />
        </button>

        <Link href="/">
          <img src="/svg/NestOn.svg" alt="NestOn" className="w-20" />
        </Link>
        <Link href="/alarm">
          <img src="/svg/alarm.svg" alt="alarm" className="w-9" />
        </Link>
      </div>

      {pageTitle && (
        <div className="w-full bg-white border-b-1 border-black py-5 text-xl text-center font-bold text-gray-800 relative z-20">
          <h1>{pageTitle}</h1>
        </div>
      )}
    </nav>
  );
}
