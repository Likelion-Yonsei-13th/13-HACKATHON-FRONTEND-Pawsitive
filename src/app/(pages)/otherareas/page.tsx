"use client";
import PageLayout from "@/app/components/PageLayout";
import { useState } from "react";

export default function OtherAreasPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const allDistricts = [
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "구로구",
    "금천구",
    "노원구",
    "도봉구",
    "동대문구",
    "동작구",
    "마포구",
    "서대문구",
    "서초구",
    "성동구",
    "성북구",
    "송파구",
    "양천구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
  ];

  const filteredDistricts = allDistricts.filter((district) =>
    district.includes(searchTerm)
  );

  return (
    <PageLayout>
      <div>
        <p className="text-2xl font-bold flex justify-start items-end mx-7 mt-10 mb-7">
          타 지역 둘러보기
        </p>
        <div className="mx-7 mb-10">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="궁금한 지역구 이름을 입력하세요"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>

        <ul className="space-y-10">
          {filteredDistricts.map((label) => (
            <li
              key={label}
              className="relative text-xl bg-gray-300 mx-10 mb-10 pl-4 px-4 py-3"
            >
              <div className="flex flex-row justify-between items-center">
                <p className="text-xl text-center mr-15">{label}</p>
                <button className="px-2 py-1 text-l bg-white">공공</button>
                <button className="px-2 py-1 text-l bg-white">제보</button>
                <button className="px-2 py-1 text-l bg-white">행사</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </PageLayout>
  );
}
