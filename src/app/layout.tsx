import type { ReactNode } from "react";
import "../styles/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className=" w-screen min-h-screen bg-[linear-gradient(180deg,_#fff_0%,_#DBFFEA_100%)]">
        {children}
      </body>
    </html>
  );
}
