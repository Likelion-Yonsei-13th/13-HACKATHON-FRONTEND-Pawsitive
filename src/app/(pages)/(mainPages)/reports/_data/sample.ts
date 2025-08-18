// src/app/reports/_data/sample.ts
export type ReportItem = {
  id: string;
  title: string;
  summary: string;
  time: string;
  image?: string;
  comments?: number;
};

export const CATEGORIES = [
  "자연재해",
  "사고",
  "교통",
  "치안",
  "시설 고장",
  "기타",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const SAMPLE: Record<Category, ReportItem[]> = {
  자연재해: [
    {
      id: "r-101",
      title: "안산에 산불 났어요",
      summary:
        "서대문구 안산 산불 완전 크게 났네요.... 거의 2시간 동안 소방관분들꼐서 진압 중인데 불의 크기가 진압 전이랑 별 차이가 없어요.. ㅠㅜㅜ오늘 안으로 진압 되곘죠..?",
      time: "2025.08.11 09:12",
      image: "/img/fire.png",
      comments: 3,
    },
  ],
  사고: [
    {
      id: "r-201",
      title: "주택가 정전",
      summary: "변압기 이상으로 추정, 신고 접수 완료.",
      time: "2025.08.11 08:40",
      comments: 1,
    },
  ],
  교통: [
    {
      id: "r-301",
      title: "교차로 신호기 고장",
      summary: "비보호 좌회전 혼잡 심함.",
      time: "2025.08.10 22:05",
      comments: 5,
    },
  ],
  치안: [
    {
      id: "r-401",
      title: "심야 시간대 소란",
      summary: "반복 민원 발생 지역. 순찰 요청.",
      time: "2025.08.10 01:20",
      comments: 2,
    },
  ],
  "시설 고장": [
    {
      id: "r-501",
      title: "놀이터 그네 파손",
      summary: "볼트 이탈, 안전 조치 필요.",
      time: "2025.08.09 15:55",
      comments: 0,
    },
  ],
  기타: [
    {
      id: "r-601",
      title: "하천변 악취",
      summary: "원인 불명. 점검 요청.",
      time: "2025.08.08 11:30",
      comments: 4,
    },
  ],
};
