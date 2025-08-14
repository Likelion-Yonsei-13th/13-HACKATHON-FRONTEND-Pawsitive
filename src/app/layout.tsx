"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import "../styles/globals.css";
import NavBar from "./(pages)/(mainPages)/home/components/navBar";
import Sidebar from "./(pages)/(mainPages)/home/components/sideBar"; // 파일 경로에 맞게 수정해주세요.

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = (): void => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <body className="bg-gray-100">
        {" "}
        {/* 배경색을 body로 옮기는 것이 좋습니다 */}
        <NavBar onMenuClick={toggleSidebar} />
        {/* - relative: 자식인 사이드바(absolute)의 기준점이 됩니다.
          - overflow-x-hidden: 닫혔을 때 왼쪽 밖으로 나간 사이드바를 보이지 않게 잘라냅니다.
        */}
        <main
          id="main-layout"
          className="relative mx-auto min-w-[320px] max-w-[500px] w-full overflow-x-hidden"
        >
          {/* 1. 사이드바를 main 태그 안으로 이동시킵니다. */}
          <Sidebar isOpen={isSidebarOpen} />

          {/* 페이지 콘텐츠 */}
          <div className="w-full">{children}</div>
        </main>
      </body>
    </html>
  );
}
