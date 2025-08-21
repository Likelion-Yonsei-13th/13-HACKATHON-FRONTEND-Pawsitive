import type { ReactNode } from "react";
import PageLayout from "../../../../components/PageLayout"; // 경로는 현재 트리에 맞음

export default async function MyComplaintsLayout({
  children,
  params,
}: {
  children: ReactNode;
  // Next.js 15에서는 params가 Promise
  params: Promise<{ category: string }>;
}) {
  const title = `나의 신고 현황`;

  return <PageLayout pageTitle={title}>{children}</PageLayout>;
}
