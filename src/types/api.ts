export interface RegisterBody {
  username: string;
  password: string;
  password2: string;
  name: string;
  phone_number: string;

  birth_date?: string | null;

  /** 동의 항목들 */
  location_services_agreed: boolean;
  marketing_push_agreed: boolean;
  terms_agreed: boolean;
  privacy_agreed: boolean;
}

// 공통 응답 래퍼
export interface ApiResponse<T = null> {
  status: number;
  success: boolean;
  message: string;
  data: T | null;
}
