"use client";

import PageLayout from "./components/PageLayout";
import { SlideDown } from "./(pages)/(mainPages)/home/components/slideDown";
import Link from "next/link";
import Image from "next/image";

export default function MainPage() {
  return (
    <PageLayout>
      <main className="px-4 pt-15 pb-18 w-full h-full flex flex-col items-center gap-5">
        <p className="text-2xl text-center font-bold text-gray-800">
          NestOn 서대문구 이슈 리포트
        </p>

        <div className="flex flex-col items-center gap-5 mt-10">
          {/* 공공 데이터 소식 */}
          <SlideDown
            title="공공 데이터 소식"
            items={[
              {
                type: "link",
                label: "오늘의 이슈 요약 보기",
                href: "/publics/summary",
              },
              { type: "link", label: "자세히 보기", href: "/publics" },
            ]}
          />

          {/* 제보 데이터 소식 */}
          <SlideDown
            title="제보 데이터 소식"
            items={[
              {
                type: "link",
                label: "오늘의 이슈 요약 보기",
                href: "/reports/summary",
              },
              { type: "link", label: "자세히 보기", href: "/reports" },
            ]}
          />

          {/* 지역 행사 소식 */}
          <SlideDown
            title="지역 행사 소식"
            items={[
              {
                type: "link",
                label: "오늘의 이슈 요약 보기",
                href: "/localevent/summary",
              },
              { type: "link", label: "자세히 보기", href: "/localevent" },
            ]}
          />
          <div className="flex flex-row gap-6 mt-20 items-center">
            <Link href="/chatbot">
              <Image
                src="/svg/mainLogo.svg"
                alt="chatbot"
                width={150}
                height={100}
                className="mt-10"
                priority
              />
            </Link>
            <Link href="/chatbot">
              <Image
                src="/svg/chatbotIcon.svg"
                alt="chatbotIcon"
                width={110}
                height={84.5}
                className="mb-20"
              />
            </Link>
          </div>
          <div className="flex flex-row gap-4">
            <Link href="/tipoff">
              <button className="w-[135.9px] h-[50.307px] text-16 text-center bg-white border rounded-[50px] shadow">
                제보하기
              </button>
            </Link>

            <Link href="/otherareas">
              <button className="w-[150px] h-[65px] text-14 text-center bg-white border rounded-[50px] shadow-md">
                타 지역 둘러보기
              </button>
            </Link>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
