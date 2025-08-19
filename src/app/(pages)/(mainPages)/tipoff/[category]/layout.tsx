import type { ReactNode } from "react";
import PageLayout from "../../../../components/PageLayout"; // 경로는 현재 트리에 맞음

export default async function LocalTipoffCategoryLayout({
  children,
  params,
}: {
  children: ReactNode;
  // Next.js 15에서는 params가 Promise
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const title = `지역 소식 > ${decodeURIComponent(category)} > 글 작성 `;

  return <PageLayout pageTitle={title}>{children}</PageLayout>;
}
