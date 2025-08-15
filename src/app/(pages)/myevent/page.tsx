import PageLayout from "@/app/components/PageLayout";
import { data as users } from "@/data";

export default function MyEvent() {
  const user = users.find((u) => u.id === 1);

  return (
    <PageLayout pageTitle="나의 관심 행사 / 상권">
      {/* 상단 인사 */}
      <div>
        <div className="flex flex-raw gap-4 justify-start items-end mx-6 mt-8 mb-10">
          <p className="text-3xl font-bold">{user?.name ?? "이름 없음"}</p>
          <p className="text-2xl">님, 안녕하세요!</p>
        </div>

        {/* 상세 리스트 */}
        <div>
          <ul className="space-y-10">
            {[
              "현재 설정된 관심사 카테고리 목록",
              "스크랩",
              "관심사 변경하기",
            ].map((label) => (
              <li
                key={label}
                className="
        relative ml-6 pl-4 text-xl
        before:content-[''] before:absolute before:left-0 before:top-0
        before:w-2 before:h-8 before:bg-black
      "
              >
                <button>{label}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageLayout>
  );
}
