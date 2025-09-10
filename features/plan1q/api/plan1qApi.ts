import { apiClient } from '@/lib/api/client';
import {
  InvestmentQuestionResponse,
  InvestmentProfileSubmitRequest,
  InvestmentProfileResponse,
  Plan1QTemplateResponse,
  Plan1QGoalCreateRequest,
  Plan1QGoalCreateResponse,
  Plan1QRecommendationRequest,
  PortfolioRecommendationResponse,
  Plan1QGoalDetailResponse,
} from '../types';

// 상품 가입 관련 타입
export interface ProductSubscriptionRequest {
  productId: number;
  periodMonths?: number;
  monthlyAmount: number;
  sourceAccountNumber: string;
  paymentDate: string;
}

export interface ProductSubscriptionResponse {
  accountNumber: string;
  subscriptionId: string;
  productName: string;
  productType: string;
  amount: number;
  monthlyAmount?: number;
  contractDate: string;
  maturityDate?: string;
  interestRate?: number;
  returnRate?: number;
  status: string;
  message: string;
  // 새로 추가되는 필드들
  autoTransferId?: number;
  initialDepositTransactionId?: string;
  nextPaymentDate?: string;
  autoTransferStatus?: string;
  lastExecutionStatus?: string;
}

export const plan1qApi = {
  // 투자성향 검사 질문 목록 조회
  async getInvestmentQuestions() {
    return apiClient.get<InvestmentQuestionResponse[]>('/api/plan1q/investment-profile/questions');
  },

  // 투자성향 검사 결과 제출
  async submitInvestmentProfile(request: InvestmentProfileSubmitRequest) {
    return apiClient.post<InvestmentProfileResponse>('/api/plan1q/investment-profile/submit', request);
  },

  // 투자성향 프로필 조회
  async getInvestmentProfile() {
    return apiClient.get<InvestmentProfileResponse>('/api/plan1q/investment-profile');
  },

  // Plan1Q 템플릿 목록 조회
  async getTemplates() {
    return apiClient.get<Plan1QTemplateResponse[]>('/api/plan1q/templates');
  },

  // AI 포트폴리오 추천 조회 (2단계)
  async getRecommendation(request: Plan1QRecommendationRequest) {
    return apiClient.post<PortfolioRecommendationResponse>('/api/plan1q/recommendations', request);
  },

  // Plan1Q 목표 생성 (3단계 - 추천 결과 기반)
  async createGoal(request: Plan1QGoalCreateRequest) {
    return apiClient.post<Plan1QGoalCreateResponse>('/api/plan1q/goals', request);
  },

  // Plan1Q 목표 목록 조회
  async getGoals() {
    return apiClient.get<Plan1QGoalDetailResponse[]>('/api/plan1q/goals');
  },

  // Plan1Q 목표 상세 조회
  async getGoalDetail(goalId: number) {
    return apiClient.get<Plan1QGoalDetailResponse>(`/api/plan1q/goals/${goalId}`);
  },

  // Plan1Q 목표 수정
  async updateGoal(goalId: number, request: Plan1QGoalCreateRequest) {
    return apiClient.put<Plan1QGoalDetailResponse>(`/api/plan1q/goals/${goalId}`, request);
  },

  // Plan1Q 목표 삭제
  async deleteGoal(goalId: number) {
    return apiClient.delete(`/api/plan1q/goals/${goalId}`);
  },

  // 상품 가입 및 계좌 개설
  async subscribeProduct(request: ProductSubscriptionRequest): Promise<ProductSubscriptionResponse> {
    const response = await apiClient.post<ProductSubscriptionResponse>(
      "/api/plan1q/products/subscribe",
      request
    );
    
    if (!response.data) {
      throw new Error('상품 가입 응답 데이터가 없습니다.');
    }
    
    return response.data;
  },
};
