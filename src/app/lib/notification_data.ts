export type Notification = {
  id: string;
  type: "info" | "event";
  title: string;
  message: string;
  read?: boolean;
  ts?: number;
};

export const DUMMY_NOTIFS: Notification[] = [
  {
    id: "n1",
    type: "info",
    title: "ⓘ 새로운 기기에서 로그인되었어요.",
    message: "자주 사용하는 기기라면 등록해 주세요.",
    read: false,
  },
  {
    id: "n2",
    type: "event",
    title: "📣 김멋사 님의 관심 지역에 새로운 행사가 등록되었어요",
    message: "이슈 리포트에서 확인해보세요.",
    read: false,
  },
  {
    id: "n3",
    type: "info",
    title: "ⓘ 보안 알림",
    message: "비밀번호를 변경한 지 90일이 지났어요.",
    read: true,
  },
  {
    id: "n4",
    type: "event",
    title: "📣 김멋사 님의 관심 지역에 새로운 행사가 등록되었어요",
    message: "이슈 리포트에서 확인해보세요.",
    read: false,
  },
  {
    id: "n5",
    type: "event",
    title: "📣 김멋사 님의 관심 지역에 새로운 행사가 등록되었어요",
    message: "이슈 리포트에서 확인해보세요.",
    read: false,
  },
];
