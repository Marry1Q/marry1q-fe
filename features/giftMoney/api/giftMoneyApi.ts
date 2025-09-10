import { apiClient } from '@/lib/api/client';

// 축의금 생성 요청 타입 (백엔드 CreateGiftMoneyRequest와 일치)
export interface CreateGiftMoneyRequest {
  name: string;
  amount: number;
  relationship: 'FAMILY' | 'RELATIVE' | 'FRIEND' | 'COLLEAGUE' | 'ACQUAINTANCE' | 'OTHER';
  source: 'CASH' | 'TRANSFER';
  phone?: string;
  address?: string;
  memo?: string;
  giftDate: string; // "yyyy-MM-dd" 형식
}

// 축의금 수정 요청 타입 (백엔드 UpdateGiftMoneyRequest와 일치)
export interface UpdateGiftMoneyRequest {
  name?: string;
  amount?: number;
  relationship?: 'FAMILY' | 'RELATIVE' | 'FRIEND' | 'COLLEAGUE' | 'ACQUAINTANCE' | 'OTHER';
  source?: 'CASH' | 'TRANSFER';
  phone?: string;
  address?: string;
  memo?: string;
  giftDate?: string; // "yyyy-MM-dd" 형식
}

// 감사 연락 상태 변경 요청 타입 (백엔드 UpdateThanksStatusRequest와 일치)
export interface UpdateThanksStatusRequest {
  thanksSent: boolean;
  thanksDate?: string; // "yyyy-MM-dd" 형식
  thanksSentBy?: string;
}

// 축의금 응답 타입 (백엔드 GiftMoneyResponse와 일치)
export interface GiftMoneyResponse {
  giftMoneyId: number;
  name: string;
  amount: number;
  relationship: 'FAMILY' | 'RELATIVE' | 'FRIEND' | 'COLLEAGUE' | 'ACQUAINTANCE' | 'OTHER';
  relationshipDisplayName: string;
  source: 'CASH' | 'TRANSFER';
  sourceDisplayName: string;
  phone?: string;
  address?: string;
  memo?: string;
  giftDate: string; // "yyyy-MM-dd" 형식
  thanksSent: boolean;
  thanksDate?: string; // "yyyy-MM-dd" 형식
  thanksSentBy?: string;
  coupleId: number;
  createdAt: string; // ISO 8601 형식
  updatedAt: string; // ISO 8601 형식
}

// 축의금 목록 응답 타입 (백엔드 GiftMoneyListResponse와 일치)
export interface GiftMoneyListResponse {
  content: GiftMoneyResponse[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  first: boolean;
  last: boolean;
}

// 축의금 요약 통계 응답 타입 (백엔드 GiftMoneySummaryResponse와 일치)
export interface GiftMoneySummaryResponse {
  totalAmount: number;
  totalCount: number;
  averageAmount: number;
  thanksSentCount: number;
  thanksNotSentCount: number;
  topDonor?: {
    id: number;
    name: string;
    amount: number;
    relationship: string;
    giftDate: string;
  };
}

// 축의금 전체 통계 응답 타입 (백엔드 실제 응답 구조에 맞게 수정)
export interface GiftMoneyStatisticsResponse {
  coupleId: number;
  totalAmount: number;
  totalCount: number;
  averageAmount: number;
  thanksNotSentCount: number;
  
  // 관계별 통계 (개별 필드)
  familyAmount: number;
  familyCount: number;
  relativeAmount: number;
  relativeCount: number;
  friendAmount: number;
  friendCount: number;
  colleagueAmount: number;
  colleagueCount: number;
  acquaintanceAmount: number;
  acquaintanceCount: number;
  otherAmount: number;
  otherCount: number;
  
  // 받은 방법별 통계 (개별 필드)
  cashAmount: number;
  cashCount: number;
  transferAmount: number;
  transferCount: number;
  
  // 금액대별 통계
  amountUnder30kCount: number;
  amount30kTo50kCount: number;
  amount50kTo100kCount: number;
  amount100kTo200kCount: number;
  amount200kTo500kCount: number;
  amountOver500kCount: number;
  
  // 월별 통계
  monthlyStats: {
    month: string;
    amount: number;
    count: number;
  }[];
  
  // 최고 후원자 정보
  topDonorName?: string;
  topDonorAmount?: number;
  topDonorGiftMoneyId?: number;
  lastGiftDate?: string;
}

// 축의금 API 함수들
export const giftMoneyApi = {
  // 축의금 목록 조회 (필터링 + 페이징)
  async getGiftMoneyList(params?: {
    name?: string;
    relationship?: string;
    source?: string;
    startDate?: string;
    endDate?: string;
    thanksSent?: boolean;
    page?: number;
    size?: number;
  }) {
    const searchParams = new URLSearchParams();
    
    if (params?.name) searchParams.append('name', params.name);
    if (params?.relationship) searchParams.append('relationship', params.relationship);
    if (params?.source) searchParams.append('source', params.source);
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    if (params?.thanksSent !== undefined) searchParams.append('thanksSent', params.thanksSent.toString());
    if (params?.page !== undefined) searchParams.append('page', params.page.toString());
    if (params?.size !== undefined) searchParams.append('size', params.size.toString());
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/api/gift-money?${queryString}` : '/api/gift-money';
    
    return apiClient.get<GiftMoneyListResponse>(endpoint);
  },

  // 축의금 단건 조회
  async getGiftMoney(id: number) {
    return apiClient.get<GiftMoneyResponse>(`/api/gift-money/${id}`);
  },

  // 축의금 생성
  async createGiftMoney(data: CreateGiftMoneyRequest) {
    return apiClient.post<GiftMoneyResponse>('/api/gift-money', data);
  },

  // 축의금 수정
  async updateGiftMoney(id: number, data: UpdateGiftMoneyRequest) {
    return apiClient.put<GiftMoneyResponse>(`/api/gift-money/${id}`, data);
  },

  // 감사 연락 상태 변경
  async updateThanksStatus(id: number, data: UpdateThanksStatusRequest) {
    return apiClient.put<GiftMoneyResponse>(`/api/gift-money/${id}/thanks-status`, data);
  },

  // 축의금 삭제
  async deleteGiftMoney(id: number) {
    return apiClient.delete(`/api/gift-money/${id}`);
  },

  // 요약 통계 조회
  async getSummaryStatistics() {
    return apiClient.get<GiftMoneySummaryResponse>('/api/gift-money/statistics/summary');
  },

  // 전체 통계 조회
  async getFullStatistics() {
    return apiClient.get<GiftMoneyStatisticsResponse>('/api/gift-money/statistics');
  }
};
