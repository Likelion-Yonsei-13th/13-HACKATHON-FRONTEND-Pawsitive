"use client";
import Link from "next/link";
import React from "react";

interface SideBarProps {
  isOpen: boolean;
}

export default function SideBar({ isOpen }: SideBarProps) {
  return (
    <aside
      className={`fixed left-0 top-0  
                  h-full  
                  bg-mainMint z-30   
                  rounded-r-[50px]     
                  transition-transform duration-300 ease-in-out
                  ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      style={{ width: "360px" }}
    >
      <div className="p-6 py-30">
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
            <Link href="/myarea" className="text-gray-700 hover:text-blue-500">
              나의 지역
            </Link>
          </li>
          <li className="text-lg text-gray-800 border-b-2 pb-4 mb-4">
            <Link href="/myevent" className="text-gray-700 hover:text-blue-500">
              나의 관심 행사 / 상권
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
