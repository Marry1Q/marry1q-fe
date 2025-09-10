// 백엔드 API 응답 타입 (실제 백엔드 응답 구조 기반)
export interface InvestmentQuestionResponse {
  questionId: number;
  questionText: string;
  questionType: string;
  questionTypeName: string;
  category: string;
  categoryName: string;
  sortOrder: number;
  answerOptions: InvestmentAnswerOption[];
}

export interface InvestmentAnswerOption {
  optionId: number;
  optionText: string;
  optionValue: string;
  score: number;
  sortOrder: number;
}

export interface InvestmentProfileSubmitRequest {
  answers: {
    questionId: number;
    answer: string;
  }[];
}

export interface InvestmentProfileResponse {
  investmentProfileId: number;
  profileType: string;
  profileTypeName: string;
  riskLevel: string;
  riskLevelName: string;
  score: number;
  expiredAt: string;
  isExpired: boolean;
}

// AI 추천 관련 타입
export interface Plan1QRecommendationRequest {
  goalTitle: string;
  detailedGoal: string;
  targetAmount: number;
  targetPeriod: number;
}

export interface RecommendedProduct {
  productId: number;
  productName: string;
  productType: string;
  investmentRatio: number;
  investmentAmount: number;
  monthlyAmount: number;
  recommendationReason: string;
  expectedReturnRate: number;
}

export interface PortfolioRecommendationResponse {
  totalExpectedReturn: number;
  achievementProbability: number; // 목표 달성 가능성 추가
  totalRiskScore: number;
  riskAssessment: string;
  aiExplanation: string;
  monthlyAmount: number; // 월 납입금 추가
  recommendedProducts: RecommendedProduct[];
}

// Plan1Q 목표 생성 관련 타입
export interface Plan1QGoalCreateRequest {
  goalTitle: string;
  detailedGoal: string;
  targetAmount: number;
  targetPeriod: number;
  monthlyAmount?: number; // 월 납입금 추가
  icon?: string; // 아이콘 이름 (iconMapping의 키값)
  // 추천 결과 기반 생성 시 추가되는 필드들
  recommendedProducts?: RecommendedProduct[];
  totalExpectedReturn?: number;
  achievementProbability?: number; // 목표 달성 가능성 추가
  totalRiskScore?: number;
  riskAssessment?: string;
  aiExplanation?: string;
}

export interface Plan1QProductResponse {
  productId: number;
  productName: string;
  productType: string;
  productTypeName: string;
  investmentRatio: number;
  investmentAmount: number;
  monthlyAmount: number;
  subscribed: boolean;
  profit: number | null;
  contractDate: string | null;
  maturityDate: string;
  terms: string | null;
  contract: string | null;
  accountNumber: string | null;
  riskLevel: string | null;
  riskType: string | null;
  assetClass: string | null;
  strategy: string | null;
  period: string | null;
  hanaBankProductId: number;
  hanaBankSubscriptionId: string | null;
  createdAt: string;
  updatedAt: string;
  plan1qGoalId: number;
  recommendationReason: string | null; // AI 추천 이유
  
  // AI 추천 시 받은 기대 수익률
  expectedReturnRate: number | null;
  
  // 하나은행 API 필드명 (백엔드와 동일)
  currentBalance: number | null;        // 하나은행: 현재 잔액
  totalDeposit: number | null;          // 하나은행: 총 입금액
  baseRate: number | null;              // 하나은행: 기준금리 (적금용)
  profitRate: number | null;            // 하나은행: 수익률 (펀드용)
  lastUpdated: string | null;           // 하나은행: 마지막 업데이트 시간
  
  // 백워드 호환성을 위한 필드
  returnRate: number;                   // 백워드 호환성용 - baseRate 또는 profitRate 값 사용
}

export interface Plan1QGoalCreateResponse {
  goalId: number;
  goalName: string;
  goalDescription: string;
  targetAmount: number;
  currentAmount: number | null;
  totalExpectedReturn: number | null;
  targetPeriod: number;
  maturityDate: string;
  monthlyAmount: number;
  status: string;
  statusName: string;
  subscriptionProgress: number | null;
  riskLevel: string;
  riskLevelName: string;
  icon: string | null;
  color: string | null;
  userSeqNo: string;
  coupleId: number;
  investmentProfileId: number;
  createdAt: string;
  updatedAt: string;
  products: Plan1QProductResponse[];
}

// Plan1Q 목표 상세 조회 응답 타입 (목록 조회에서도 사용)
export interface Plan1QGoalDetailResponse {
  goalId: number;
  goalName: string;
  goalDescription: string;
  targetAmount: number;
  currentAmount: number | null;
  totalExpectedReturn: number | null;
  actualReturnRate: number | null;     // 실제 계산된 수익률
  targetPeriod: number;
  maturityDate: string;
  monthlyAmount: number;
  status: string;
  statusName: string;
  subscriptionProgress: number | null;
  riskLevel: string;
  riskLevelName: string;
  icon: string | null;
  color: string | null;
  userSeqNo: string;
  coupleId: number;
  investmentProfileId: number;
  createdAt: string;
  updatedAt: string;
  products: Plan1QProductResponse[];
}

// 프론트엔드 내부 타입
export interface InvestmentQuestion {
  id: number;
  question: string;
  options: InvestmentOption[];
}

export interface InvestmentOption {
  id: number;
  text: string;
  optionValue: string; // 백엔드에서 기대하는 optionValue 추가
  score: number;
}

export interface InvestmentProfile {
  id: number;
  type: string;
  typeName: string;
  riskLevel: string;
  riskLevelName: string;
  score: number;
  expiredAt: string;
  isExpired: boolean;
}

// Plan1Q 템플릿 관련 타입
export interface Plan1QTemplateResponse {
  templateId: number;
  title: string;
  description: string;
  iconName: string;
  createdAt: string;
}

export interface Plan1QTemplate {
  id: number;
  title: string;
  description: string;
  iconName: string;
  createdAt: string;
}
