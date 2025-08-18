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
        <p className="text-2xl font-bold flex justify-start items-end mx-9 mt-10 mb-8">
          타 지역 둘러보기
        </p>
        <div className="mx-7 mb-5">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="관심 있는 지역을 검색해보세요."
            className="w-full px-4 py-3 border-1 border-gray-300 rounded-md focus:outline-none focus:border-gray-500"
          />
        </div>
        <p className="flex justify-center mb-5 text-md text-gray-600">
          추후 확장 예정입니다!
        </p>
        <ul className="space-y-10">
          {filteredDistricts.map((label) => (
            <li
              key={label}
              className="relative text-xl opacity-60 bg-white border-1 rounded-[10px] mx-6 mb-4 pl-4 px-4 py-3"
            >
              <div className="flex flex-row justify-between items-center">
                <p className="text-xl text-center mr-10">{label}</p>
                <div className="flex items-center gap-4">
                  <button className="px-5 py-3 rounded-[20px] text-sm shadow-md bg-[#FDF9C2]">
                    공공
                  </button>
                  <button className="px-5 py-3 rounded-[20px] text-sm shadow-md bg-[#FFE5E5]">
                    제보
                  </button>
                  <button className="px-5 py-3 rounded-[20px] text-sm shadow-md bg-[#DCEBFF]">
                    행사
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </PageLayout>
  );
}
