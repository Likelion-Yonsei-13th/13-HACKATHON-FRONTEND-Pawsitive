import Link from "next/link";
import React from "react";

interface SidebarProps {
  isOpen: boolean;
}

export default function SideBar({ isOpen }: SidebarProps) {
  return (
    <aside
      className={`absolute top-0 left-0 h-full bg-white z-30 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ width: "400px" }}
    >
      <div className="p-6">
        <ul className="space-y-6">
          <li className="text-lg font-semibold text-gray-800 border-b-2 pb-4 mb-4">
            <Link href="/" className="text-gray-700 hover:text-blue-500">
              NestOn 홈
            </Link>
          </li>
          <li className="text-lg text-gray-800 border-b-2 pb-4 mb-4">
            <Link href="/mypage" className="text-gray-700 hover:text-blue-500">
              마이페이지
            </Link>
          </li>
          <li className="text-lg text-gray-800 border-b-2 pb-4 mb-4">
            <Link href="/" className="text-gray-700 hover:text-blue-500">
              나의 지역
            </Link>
          </li>
          <li className="text-lg text-gray-800 border-b-2 pb-4 mb-4">
            <Link href="/" className="text-gray-700 hover:text-blue-500">
              나의 관심 행사 / 상권
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
