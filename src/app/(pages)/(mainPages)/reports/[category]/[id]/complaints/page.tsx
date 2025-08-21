// app/reports/[category]/[id]/complaints/page.tsx
"use client";

import { useMemo, useState, useEffect, FormEvent } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";

type ReasonKey = "FALSE_INFO" | "MARKETING" | "ABUSE" | "BIAS" | "ETC";
const REASON_OPTIONS: Record<ReasonKey, string> = {
  FALSE_INFO: "허위 내용의 글",
  MARKETING: "홍보 위주의 글",
  ABUSE: "선정적인 내용(폭력, 성희롱)",
  BIAS: "특정 집단 차별",
  ETC: "기타(직접 작성)",
};

export default function ReportComplaintPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const params = useParams<{ category: string; id: string }>();
  const search = useSearchParams();
  const router = useRouter();

  // 스크롤 잠금: 모달 열릴 때 body 스크롤 방지
  useEffect(() => {
    if (!showConfirm) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showConfirm]);

  const preset = useMemo(() => {
    return {
      boardPath: search.get("boardPath") ?? "제보데이터 > 자연재해",
      authorName: search.get("author") ?? "사자",
      reporterName: search.get("reporter") ?? "김멋사",
      reportedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      content:
        search.get("content") ??
        "안산에 불 안 났잖아요; 진짜 실망했네\n이런 일로 거짓말 치는 사람들 다 잡아갑시다",
      postId: params.id,
      category: params.category,
    };
  }, [params.id, params.category, search]);

  const [reason, setReason] = useState<ReasonKey>("FALSE_INFO");
  const [details, setDetails] = useState(preset.content);

  // 하단 버튼 or 폼 submit -> 확인 모달만 띄움
  async function onSubmit(e?: FormEvent) {
    e?.preventDefault();
    setShowConfirm(true);
  }

  // 모달에서 "네" -> 실제 라우팅
  async function confirmSubmit() {
    setIsSubmitting(true);
    try {
      // TODO: API 연동 (필요 시 교체)
      const q = new URLSearchParams({
        boardPath: preset.boardPath,
        author: preset.authorName,
        reporter: preset.reporterName,
        reportedAt: preset.reportedAt,
        reason,
        details,
      });
      router.push(
        `/reports/${preset.category}/${
          preset.postId
        }/complaints/success?${q.toString()}`
      );
    } catch (err) {
      console.error(err);
      alert("신고 접수에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
      setShowConfirm(false);
    }
  }

  function onCancelReport() {
    if (confirm("신고를 취소하시겠어요?")) router.back();
  }
  function onDeletePost() {
    if (confirm("정말 게시글을 삭제하시겠어요?")) {
      // TODO: 삭제 API
      alert("삭제 요청이 전송되었습니다.");
      router.back();
    }
  }

  return (
    <section className="min-h-dvh bg-white text-gray-900">
      <div className="mx-auto max-w-md px-4 pb-28 pt-2">
        {/* 카드 #1 : 상단 메타 + 우측 버튼 */}
        <div className="rounded-xl border p-3 shadow-sm">
          <div className="flex flex-col items-start gap-3">
            <div className="text-sm">
              <div className="mb-1">
                <span className="text-gray-500">게시판명:</span>{" "}
                <span className="font-medium">{preset.boardPath}</span>
              </div>
              <div>
                <span className="text-gray-500">게시자명:</span>{" "}
                <span className="font-medium">{preset.authorName}</span>
              </div>
            </div>

            <div className="ml-auto flex gap-2">
              <button
                onClick={onCancelReport}
                className="rounded-md px-3 py-1 text-xs font-medium hover:bg-[#DBFFEA]"
              >
                신고취소
              </button>
              <button
                onClick={onDeletePost}
                className="rounded-md bg-white px-3 py-1 text-xs font-medium text-black hover:bg-[#DBFFEA]"
              >
                삭제
              </button>
            </div>
          </div>
        </div>

        <div className="h-3" />

        {/* 신고 폼 */}
        <form onSubmit={onSubmit} className="border-t-2 bg-white p-3">
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-[88px_1fr] items-center gap-x-2">
              <span className="text-gray-500">신고한 회원</span>
              <span className="font-medium">{preset.reporterName}</span>
            </div>

            <div className="grid grid-cols-[88px_1fr] items-center gap-x-2">
              <span className="text-gray-500">신고 일시</span>
              <span className="font-medium">{preset.reportedAt}</span>
            </div>

            <div className="grid grid-cols-[88px_1fr] gap-x-2">
              <label htmlFor="reason" className="text-gray-500 leading-9">
                신고 이유
              </label>
              <div className="flex items-center gap-2">
                <select
                  id="reason"
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  value={reason}
                  onChange={(e) => setReason(e.target.value as ReasonKey)}
                >
                  {Object.entries(REASON_OPTIONS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 본문(테두리 안정화: wrapper에 border) */}
            <div className="border-t-2 pt-3">
              <label htmlFor="details" className="mb-1 text-sm font-medium">
                본문
              </label>
              <div className="bg-transparent">
                <textarea
                  id="details"
                  className="h-40 w-full resize-y bg-transparent px-3 py-2 text-sm leading-6 focus:outline-none focus:ring-0"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="신고 사유와 관련된 내용을 자세히 입력해주세요."
                />
              </div>
            </div>
          </div>

          <div className="h-3" />
        </form>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed inset-x-0 bottom-0 z-10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/70">
        <div className="mx-auto max-w-md px-4 py-3">
          <button
            onClick={() => onSubmit()}
            disabled={isSubmitting}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-center text-sm font-semibold text-black disabled:opacity-60"
          >
            {isSubmitting ? "신고 접수 중..." : "신고 접수하기"}
          </button>
        </div>
      </div>

      {/* ===================== 확인 모달 ===================== */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowConfirm(false)} // 오버레이 클릭시 닫기
        >
          {/* 팝업 카드 */}
          <div
            className="mx-4 w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()} // 내부 클릭은 닫히지 않도록
          >
            <p className="mb-5 text-center text-sm font-semibold">
              신고를 접수하시겠습니까?
            </p>

            <div className="flex items-center justify-center gap-20">
              <button
                onClick={confirmSubmit}
                disabled={isSubmitting}
                className="rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-60"
              >
                네
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="rounded-full border border-gray-300 bg-white px-6 py-2 text-sm font-medium hover:bg-gray-50"
              >
                아니오
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ==================================================== */}
    </section>
  );
}
