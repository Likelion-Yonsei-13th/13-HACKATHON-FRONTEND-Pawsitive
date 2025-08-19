"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import NavBar from "../(pages)/(mainPages)/home/components/navBar";
import SideBar from "../(pages)/(mainPages)/home/components/sideBar";
import IntroOverlay from "./IntroOverlay";

type PageLayoutProps = {
  pageTitle?: string;
  children: ReactNode;
};

export default function PageLayout({ pageTitle, children }: PageLayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((v) => !v);

  return (
    <>
      <NavBar onMenuClick={toggleSidebar} pageTitle={pageTitle} />
      <main
        id="main-layout"
        className="relative mx-auto min-w-[320px] max-w-[500px] w-full overflow-x-hidden"
      >
        <SideBar isOpen={isSidebarOpen} />
        <div className="w-full">
          {children}
          <IntroOverlay />
        </div>
      </main>
    </>
  );
}
