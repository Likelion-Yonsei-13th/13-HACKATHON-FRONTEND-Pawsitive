"use client";
import PageLayout from "@/app/components/PageLayout";
import { data as users } from "@/app/lib/data";

export default function MyPage() {
  const user = users.find((u) => u.id === 1);

  return (
    <PageLayout pageTitle="마이페이지">
      {/* 상단 인사 */}
      <div className="w-screen min-h-screen">
        <div className="flex flex-raw gap-4 justify-start items-end mx-6 mt-8 mb-10">
          <p className="text-3xl font-bold">{user?.name ?? "이름 없음"}</p>
          <p className="text-2xl">님, 안녕하세요!</p>
        </div>

        {/* 상세 리스트 */}
        <div>
          <ul className="space-y-10">
            {[
              "개인정보 관리",
              "알림 설정",
              "고객센터 / 운영정책",
              "탈퇴하기",
            ].map((label) => (
              <li
                key={label}
                className="
        relative ml-6 pl-4 text-xl
        before:content-[''] before:absolute before:left-0 before:top-0
        before:w-2 before:h-8 before:bg-black
      "
              >
                <button onClick={() => console.log("작동")}>{label}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}
