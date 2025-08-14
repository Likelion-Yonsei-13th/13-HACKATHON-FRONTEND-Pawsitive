import Link from "next/link";
import React from "react";

interface NavBarProps {
  onMenuClick: () => void;
}

export default function NavBar({ onMenuClick }: NavBarProps) {
  return (
    <div className="relative mx-auto min-w-[320px] max-w-[500px] w-full flex flex-col bg-gray-200">
      <main className="px-6 pt-6 pb-6 w-full flex flex-row justify-between items-center overflow-y-auto scrollbar-hide scroll-smooth">
        <button onClick={onMenuClick}>
          <img src="/svg/menu.svg" alt="menu" />
        </button>

        <Link href="/">
          <button>
            <img src="/img/NestOn.png" alt="NestOn" />
          </button>
        </Link>
        <Link href="/alarm">
          <button>
            <img src="/svg/alarm.svg" alt="alarm" />
          </button>
        </Link>
      </main>
    </div>
  );
}
