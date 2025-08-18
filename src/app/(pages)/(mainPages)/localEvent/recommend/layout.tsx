import type { ReactNode } from "react";
import PageLayout from "../../../../components/PageLayout"; // 경로는 현재 트리에 맞음

export default async function PublicsCategoryLayout({
  children,
}: {
  children: ReactNode;
  // Next.js 15에서는 params가 Promise
}) {
  const title = `NestOn 추천 행사 보기`;

  return <PageLayout pageTitle={title}>{children}</PageLayout>;
}
