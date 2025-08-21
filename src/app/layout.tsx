import type { ReactNode } from "react";
import "../styles/globals.css";
import { NotificationsProvider } from "./providers/NotificationsProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className=" w-screen min-h-screen bg-[linear-gradient(180deg,_#fff_0%,_#DBFFEA_100%)]">
        <NotificationsProvider>{children}</NotificationsProvider>
      </body>
    </html>
  );
}
