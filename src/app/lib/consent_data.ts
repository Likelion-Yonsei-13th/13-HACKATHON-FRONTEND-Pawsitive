export type PolicyId = "terms" | "privacy" | "location" | "community";

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
    updatedAt: "2025-08-20",
    content: [
      "본 약관은 NestOn 서비스의 이용 조건과 권리·의무를 규정합니다. 사용자는 관련 법령과 본 약관을 준수해야 하며, 금지행위에 해당하는 활동을 해서는 안 됩니다. 서비스 제공, 중단, 변경에 관한 NestOn의 책임 범위는 약관에 따릅니다.",
    ],
  },
  privacy: {
    id: "privacy",
    title: "개인정보 최소 수집 및 이용 목적 동의",
    updatedAt: "2025-08-20",
    content: [
      "맞춤 추천을 위해 필요한 최소한의 개인정보를 수집·분석하며, 관련 데이터는 내부 목적 이외에는 사용하지 않습니다. 보관 기간과 보호 조치를 포함하며, 미동의 시 이용이 제한될 수 있습니다.",
    ],
  },
  location: {
    id: "location",
    title: "위치기반 서비스 약관",
    updatedAt: "2025-08-20",
    content: [
      "내 위치 정보를 활용하여 실시간 거주 환경 장소 정보를 최적화하여 제공합니다. 정확도와 이용 제한, 보관 기간 등은 약관에 따릅니다. 미동의 시 이용이 제한될 수 있습니다.",
    ],
  },
  community: {
    id: "community",
    title: "커뮤니티 운영 및 게시물 관리 정책 동의(필수)",
    updatedAt: "2025-08-20",
    content: [
      "커뮤니티 운영 및 게시물 관리 정책 동의 (필수)",
      "이용자가 제보하는 모든 콘텐츠에 대한 책임과 신고, 게시물 관리 절차에 동의합니다. 허위 또는 부적절한 콘텐츠는 삭제될 수 있으며, 미동의 시 이용이 제한될 수 있습니다.",

      "이용자 게시물 신고 및 처리 동의 (필수)",
      "이용자가 신고한 게시물에 대해 회사가 적절한 절차에 따라 확인·처리하며, 그 결과를 통지할 수 있습니다. 미동의 시 이용이 제한될 수 있습니다.",

      "게시물 이용 제한 및 제재 조치 동의 (필수)",
      "반복적 규칙 위반이나 허위 제보 등 부적절한 게시물 작성 시 경고, 일시 중지, 영구 정지 등의 제재가 있을 수 있습니다. 미동의 시 이용이 제한될 수 있습니다.",
    ],
  },
};
