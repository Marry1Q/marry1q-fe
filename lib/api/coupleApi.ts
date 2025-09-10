import { apiClient } from './client';

// 커플 정보 응답 타입 (백엔드 CoupleResponse와 일치)
export interface CoupleResponse {
  coupleId: number;
  weddingDate: string; // "yyyy-MM-dd" 형식 (LocalDate)
  totalBudget: number;
  coupleAccount: string;
  coupleCardNumber?: string;
  currentSpent: number;
  urlSlug: string;
  createdAt: string; // ISO 8601 형식 (LocalDateTime)
  updatedAt: string; // ISO 8601 형식 (LocalDateTime)
  daysUntilWedding: number;
  memberNames: string[]; // 커플 멤버 이름 목록
}

// 커플 정보 수정 요청 타입 (백엔드 UpdateCoupleRequest와 일치)
export interface UpdateCoupleRequest {
  weddingDate: string; // "yyyy-MM-dd" 형식
  totalBudget: number;
}

// 커플 API 함수들
export const coupleApi = {
  // 현재 로그인한 사용자의 커플 정보 조회
  async getCurrentCoupleInfo() {
    return apiClient.get<CoupleResponse>('/api/couple/info');
  },
  
  // 현재 로그인한 사용자의 커플 정보 수정
  async updateCurrentCoupleInfo(request: UpdateCoupleRequest) {
    return apiClient.put<CoupleResponse>('/api/couple/info', request);
  },
};
