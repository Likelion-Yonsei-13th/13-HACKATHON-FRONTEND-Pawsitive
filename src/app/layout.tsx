import type { ReactNode } from "react";
import "../styles/globals.css";
import { NotificationsProvider } from "./providers/NotificationsProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className=" relative mx-auto min-w-[320px] max-w-[500px] w-full  min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,_#fff_0%,_#DBFFEA_100%)] pb-[30%]">
        <NotificationsProvider>{children}</NotificationsProvider>
      </body>
    </html>
  );
}
