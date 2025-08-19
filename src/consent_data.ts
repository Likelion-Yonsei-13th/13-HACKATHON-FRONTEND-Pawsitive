// app/data/policies.ts

export type PolicyId = "terms" | "privacy" | "location" | "marketing";

export interface Policy {
  id: PolicyId;
  title: string;
  updatedAt: string; // YYYY-MM-DD
  content: string[];
}

export type Policies = Record<PolicyId, Policy>;

export const POLICIES: Policies = {
  terms: {
    id: "terms",
    title: "이용약관",
    updatedAt: "2025-07-01",
    content: [
      "본 약관은 NestOn 서비스의 이용 조건과 권리·의무를 규정합니다.",
      "사용자는 관련 법령과 본 약관을 준수해야 하며, 금지행위에 해당하는 활동을 해서는 안 됩니다.",
      "서비스 제공, 중단, 변경에 관한 회사의 책임 범위는 약관에 따릅니다.",
      "자세한 내용은 정식 약관 본문을 참조해 주세요.",
    ],
  },
  privacy: {
    id: "privacy",
    title: "개인정보 처리방침",
    updatedAt: "2025-07-01",
    content: [
      "회사는 서비스 제공을 위해 최소한의 개인정보를 수집·이용합니다.",
      "수집 항목, 이용 목적, 보관 및 파기 절차는 본 방침에 따릅니다.",
      "개인정보는 안전하게 보호되며, 목적 달성 후 지침에 따라 파기됩니다.",
      "자세한 항목은 개인정보 처리방침 전문을 확인해 주세요.",
    ],
  },
  location: {
    id: "location",
    title: "위치기반 서비스 약관",
    updatedAt: "2025-07-01",
    content: [
      "위치정보는 사용자 맞춤 정보 제공을 위해 활용됩니다.",
      "정확도와 이용 제한, 보관 기간 등은 약관에 따릅니다.",
    ],
  },
  marketing: {
    id: "marketing",
    title: "마케팅 PUSH 수신 동의",
    updatedAt: "2025-07-01",
    content: [
      "이벤트·혜택 등 광고성 정보를 앱 Push로 받아볼 수 있습니다.",
      "미동의해도 서비스 이용은 가능합니다. 설정에서 언제든 변경할 수 있습니다.",
    ],
  },
};
