"use client";

import { useEffect } from "react";
import { POLICIES } from "@/consent_data";

type PolicyId = "terms" | "privacy" | "location" | "marketing" | "community";

type Props = {
  open: boolean;
  policyId: PolicyId | null;
  onClose: () => void;
};

export default function PolicyModal({ open, policyId, onClose }: Props) {
  // ESC로 닫기 추가
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !policyId) return null;

  const data = (
    POLICIES as Record<
      PolicyId,
      {
        id: PolicyId;
        title: string;
        updatedAt?: string;
        content: string[];
      }
    >
  )[policyId];

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/40 backdrop-blur-[1px] flex items-center justify-center px-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 상단 영역 */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b">
          <div>
            <h3 className="text-base font-semibold">{data.title}</h3>
            {data.updatedAt && (
              <p className="mt-0.5 text-xs text-gray-500">
                최종 업데이트: {data.updatedAt}
              </p>
            )}
          </div>
        </div>

        {/* 본문 */}
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4 space-y-3">
          {data.content.map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-gray-700">
              {p}
            </p>
          ))}
        </div>

        {/* 닫기 버튼 */}
        <div className="flex justify-end gap-2 px-5 py-3 border-t">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
