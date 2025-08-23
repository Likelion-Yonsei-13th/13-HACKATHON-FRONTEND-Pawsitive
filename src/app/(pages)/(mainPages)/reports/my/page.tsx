// app/reports/my/page.tsx
import { Suspense } from "react";
import MyReportsClient from "./_Client";

export default function MyReportsPage() {
  return (
    <Suspense fallback={null}>
      <MyReportsClient />
    </Suspense>
  );
}
