// app/reports/my/_Client.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type ReportSnapshot = {
  boardPath: string;
  author: string;
  reporter: string;
  reportedAt: string;
  reason: string; // 코드값 (FALSE_INFO 등)
  details: string;
};

const REASON_LABELS: Record<string, string> = {
  FALSE_INFO: "허위 내용의 글",
  MARKETING: "홍보 위주의 글",
  ABUSE: "선정적인 내용(폭력, 성희롱)",
  BIAS: "특정 집단 차별",
  ETC: "기타(직접 작성)",
};

export default function MyReportsClient() {
  const search = useSearchParams();
  const [data, setData] = useState<ReportSnapshot | null>(null);

  // 1) URL 쿼리에 오면 우선 사용
  const fromQuery = useMemo<ReportSnapshot | null>(() => {
    const boardPath = search.get("boardPath");
    const author = search.get("author");
    const reporter = search.get("reporter");
    const reportedAt = search.get("reportedAt");
    const reason = search.get("reason");
    const details = search.get("details");

    if (
      boardPath &&
      author &&
      reporter &&
      reportedAt &&
      reason &&
      details !== null
    ) {
      return {
        boardPath,
        author,
        reporter,
        reportedAt,
        reason,
        details: details ?? "",
      };
    }
    return null;
  }, [search]);

  // 2) 쿼리 없으면 localStorage에서 복구
  useEffect(() => {
    if (fromQuery) {
      setData(fromQuery);
      localStorage.setItem("last-report-snapshot", JSON.stringify(fromQuery));
      return;
    }
    const raw = localStorage.getItem("last-report-snapshot");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ReportSnapshot;
        setData(parsed);
      } catch {
        // ignore
      }
    }
  }, [fromQuery]);

  return (
    <section className="min-h-dvh bg-neutral-50 text-gray-900">
      <div className="mx-auto max-w-md px-4 pb-16">
        {data ? (
          <>
            {/* 상단 카드: 신고 대상 게시글 */}
            <div className="rounded-xl border bg-white p-3 shadow-sm text-sm">
              <div className="mb-1">
                <span className="text-gray-500">게시판명:</span>{" "}
                <span className="font-medium">{data.boardPath}</span>
              </div>
              <div>
                <span className="text-gray-500">게시자명:</span>{" "}
                <span className="font-medium">{data.author}</span>
              </div>
            </div>

            {/* 내용 섹션 */}
            <div className="mt-4 text-sm">
              <div className="grid grid-cols-[88px_1fr] items-center gap-x-2 py-3">
                <span className="text-gray-500">신고한 회원</span>
                <span className="font-medium">{data.reporter}</span>
              </div>

              <div className="border-t" />

              <div className="grid grid-cols-[88px_1fr] items-center gap-x-2 py-3">
                <span className="text-gray-500">신고 일시</span>
                <span className="font-medium">{data.reportedAt}</span>
              </div>

              <div className="border-t" />

              <div className="grid grid-cols-[88px_1fr] items-center gap-x-2 py-3">
                <span className="text-gray-500">신고 이유</span>
                <span className="font-medium">
                  {REASON_LABELS[data.reason] ?? data.reason}
                </span>
              </div>

              <div className="border-t pt-3">
                <div className="mb-1 font-medium">본문</div>
                {/* 시안처럼 박스 없이 본문만 노출 */}
                <p className="whitespace-pre-wrap leading-6 text-gray-900">
                  {data.details}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-xl border bg-white p-6 text-center text-sm text-gray-600">
            아직 표시할 신고가 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}
