import { CustomApiResponse } from '@/lib/api/client';
import {
  InvestmentQuestionResponse,
  InvestmentProfileResponse,
  Plan1QTemplateResponse,
  Plan1QGoalCreateResponse,
  Plan1QProductResponse,
  InvestmentQuestion,
  InvestmentProfile,
  Plan1QTemplate,
} from '../types';

// 투자성향 검사 질문 변환
export const mapInvestmentQuestionsResponse = (
  response: CustomApiResponse<InvestmentQuestionResponse[]>
): InvestmentQuestion[] => {
  if (!response.success || !response.data) {
    return [];
  }

  return response.data.map((item) => ({
    id: item.questionId,
    question: item.questionText,
    options: item.answerOptions.map((option) => ({
      id: option.optionId,
      text: option.optionText,
      optionValue: option.optionValue, // optionValue 추가
      score: option.score,
    })),
  }));
};

// 투자성향 프로필 변환
export const mapInvestmentProfileResponse = (
  response: CustomApiResponse<InvestmentProfileResponse>
): InvestmentProfile | null => {
  if (!response.success || !response.data) {
    return null;
  }

  return {
    id: response.data.investmentProfileId,
    type: response.data.profileType,
    typeName: response.data.profileTypeName,
    riskLevel: response.data.riskLevel,
    riskLevelName: response.data.riskLevelName,
    score: response.data.score,
    expiredAt: response.data.expiredAt,
    isExpired: response.data.isExpired,
  };
};

// Plan1Q 템플릿 변환
export const mapTemplatesResponse = (
  response: CustomApiResponse<Plan1QTemplateResponse[]>
): Plan1QTemplate[] => {
  if (!response.success || !response.data) {
    return [];
  }

  return response.data.map((item) => ({
    id: item.templateId,
    title: item.title,
    description: item.description,
    iconName: item.iconName,
    createdAt: item.createdAt,
  }));
};

// Plan1Q 상품 변환 (프론트엔드용)
export const mapPlan1QProduct = (product: Plan1QProductResponse) => ({
  id: product.productId,
  name: product.productName,
  type: product.productType,
  typeName: product.productTypeName,
  investmentRatio: product.investmentRatio,
  investmentAmount: product.investmentAmount,
  monthlyAmount: product.monthlyAmount,
  returnRate: product.returnRate,
  maturityDate: product.maturityDate,
  subscribed: product.subscribed,
  totalDeposit: product.totalDeposit,
  profit: product.profit,
  recommendationReason: product.recommendationReason,
  // 추가 계산된 필드들
  formattedInvestmentAmount: product.investmentAmount.toLocaleString(),
  formattedMonthlyAmount: product.monthlyAmount.toLocaleString(),
  formattedReturnRate: `${product.returnRate.toFixed(2)}%`,
  daysToMaturity: Math.ceil((new Date(product.maturityDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
});

// Plan1Q 목표 생성 응답 변환 (프론트엔드용)
export const mapPlan1QGoalCreateResponse = (
  response: CustomApiResponse<Plan1QGoalCreateResponse>
) => {
  if (!response.success || !response.data) {
    return null;
  }

  const data = response.data;
  
  return {
    // 기본 목표 정보
    goalId: data.goalId,
    goalName: data.goalName,
    goalDescription: data.goalDescription,
    targetAmount: data.targetAmount,
    targetPeriod: data.targetPeriod,
    maturityDate: data.maturityDate,
    monthlyPayment: data.monthlyAmount,
    status: data.status,
    statusName: data.statusName,
    riskLevel: data.riskLevel,
    riskLevelName: data.riskLevelName,
    
    // 포맷팅된 필드들
    formattedTargetAmount: data.targetAmount.toLocaleString(),
    formattedMonthlyPayment: data.monthlyAmount.toLocaleString(),
    formattedMaturityDate: new Date(data.maturityDate).toLocaleDateString('ko-KR'),
    
    // 계산된 필드들
    daysToMaturity: Math.ceil((new Date(data.maturityDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
    progressPercentage: data.currentAmount ? (data.currentAmount / data.targetAmount) * 100 : 0,
    
    // 상품 정보
    products: data.products.map(mapPlan1QProduct),
    
    // 상품 타입별 통계
    productTypeStats: data.products.reduce((acc, product) => {
      if (!acc[product.productType]) {
        acc[product.productType] = {
          typeName: product.productTypeName,
          count: 0,
          totalAmount: 0,
          totalRatio: 0,
        };
      }
      acc[product.productType].count++;
      acc[product.productType].totalAmount += product.investmentAmount;
      acc[product.productType].totalRatio += product.investmentRatio;
      return acc;
    }, {} as Record<string, { typeName: string; count: number; totalAmount: number; totalRatio: number }>),
    
    // 포트폴리오 요약
    portfolioSummary: {
      totalProducts: data.products.length,
      totalInvestmentAmount: data.products.reduce((sum, p) => sum + p.investmentAmount, 0),
      averageReturnRate: data.products.reduce((sum, p) => sum + p.returnRate, 0) / data.products.length,
      riskLevel: data.riskLevelName,
      monthlyPayment: data.monthlyAmount,
    },
  };
};
