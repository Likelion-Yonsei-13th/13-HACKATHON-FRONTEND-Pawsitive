import Link from "next/link";
import Image from "next/image";

export default function ComplaintSuccessPage() {
  return (
    <section className="min-h-dvh bg-transparent text-gray-900">
      <div className="mx-auto max-w-md px-4 pt-4 pb-20">
        {/* 🔹 신고 대상 게시글 박스 */}
        <div className="rounded-xl border bg-white p-3 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="text-sm">
              <div className="mb-1">
                <span className="text-gray-500">게시판명:</span>{" "}
                <span className="font-medium">제보데이터 &gt; 자연재해</span>
              </div>
              <div>
                <span className="text-gray-500">게시자명:</span>{" "}
                <span className="font-medium">사자</span>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 본문: 체크 + 메시지 */}
        <div className="mt-14 flex flex-col items-center text-center">
          <Image
            src="/svg/check.svg"
            alt="신고 접수 완료"
            width={48}
            height={48}
            className="mb-6"
          />

          <h2 className="text-base font-semibold text-gray-900">
            신고가 정상적으로 접수되었습니다.
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-sm">
            모든 신고는 신속하게 검토되며, 다른 신고와 함께 확인 후 안전한
            커뮤니티를 위해 적절한 조치를 취하겠습니다.
          </p>
        </div>

        {/* 🔹 버튼 그룹 */}
        <div className="mt-10 flex w-full text-center max-w-xs mx-auto gap-3">
          <Link
            href="/reports/new"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
          >
            추가 신고하기
          </Link>
          <Link
            href="/reports/my"
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50"
          >
            나의 신고 현황
          </Link>
        </div>
      </div>
    </section>
  );
}
