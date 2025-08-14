import Link from "next/link";
import React from "react";

interface SidebarProps {
  isOpen: boolean;
}

export default function SideBar({ isOpen }: SidebarProps) {
  return (
    <aside
      className={`absolute top-0 left-0 h-full bg-white shadow-lg z-30 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ width: "250px" }}
    >
      <div className="p-6 ">
        <ul className="space-y-6">
          <li>
            <Link
              href="/"
              className="text-gray-700 border- hover:text-blue-500"
            >
              NestOn 홈
            </Link>
          </li>
          <li>
            <Link href="/mypage" className="text-gray-700 hover:text-blue-500">
              마이페이지
            </Link>
          </li>
          <li>
            <Link href="/" className="text-gray-700 hover:text-blue-500">
              나의 지역
            </Link>
          </li>
          <li>
            <Link href="/" className="text-gray-700 hover:text-blue-500">
              나의 관심 행사 / 상권
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
