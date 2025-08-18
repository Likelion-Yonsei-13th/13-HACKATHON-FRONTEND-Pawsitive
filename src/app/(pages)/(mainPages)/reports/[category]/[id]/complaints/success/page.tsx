import Link from "next/link";

export default function ComplaintSuccessPage() {
  return (
    <section className="grid place-items-center px-6 py-12 text-center">
      <div className="text-6xl">✅</div>
      <h2 className="mt-3 text-lg font-semibold">신고가 접수되었습니다</h2>
      <p className="mt-1 text-sm text-neutral-600">
        접수된 신고는 검토 후 조치됩니다.
      </p>

      <div className="mt-6 flex w-full max-w-xs gap-2">
        <Link
          href="../../"
          className="flex-1 rounded-lg border bg-white px-4 py-2 text-sm shadow-sm"
        >
          상세로 돌아가기
        </Link>
        <Link
          href="/reports/my"
          className="flex-1 rounded-lg bg-black px-4 py-2 text-sm text-white"
        >
          내 신고 진행
        </Link>
      </div>
    </section>
  );
}
