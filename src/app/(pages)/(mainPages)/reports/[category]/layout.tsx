import type { ReactNode } from "react";
import PageLayout from "../../../../components/PageLayout"; // 경로는 현재 트리에 맞음

export default async function PublicsCategoryLayout({
  children,
  params,
}: {
  children: ReactNode;
  // Next.js 15에서는 params가 Promise
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const title = `제보 데이터 > ${decodeURIComponent(category)}`;

  return <PageLayout pageTitle={title}>{children}</PageLayout>;
}
