import { 
  TransactionResponse, 
  TransactionListResponse, 
  BudgetOverviewResponse,
  CategoryBudgetResponse,
  CategoryResponse 
} from '../types';
import { parseBigDecimal, formatCurrency } from './currencyUtils';

// 거래 내역 변환 (백엔드 → 프론트엔드 사용 최적화)
export const mapTransactionResponse = (response: TransactionResponse) => {
  return {
    ...response,
    // BigDecimal → number로 변환
    amount: parseBigDecimal(response.amount),
    // 프론트엔드 전용 필드 추가
    formattedAmount: formatCurrency(response.amount),
    isIncome: response.transactionType === 'INCOME',
  };
};

// 거래 내역 목록 변환 (페이징 정보 포함)
export const mapTransactionListResponse = (response: TransactionListResponse) => {
  return {
    ...response,
    transactions: response.transactions.map(mapTransactionResponse),
  };
};

// 예산 대시보드 변환
export const mapBudgetOverviewResponse = (response: BudgetOverviewResponse) => {
  return {
    ...response,
    // BigDecimal → number로 변환
    totalBudget: parseBigDecimal(response.totalBudget),
    totalSpent: parseBigDecimal(response.totalSpent),
    remainingBudget: parseBigDecimal(response.remainingBudget),
    // 프론트엔드 전용 필드 추가
    formattedTotalBudget: formatCurrency(response.totalBudget),
    formattedTotalSpent: formatCurrency(response.totalSpent),
    formattedRemainingBudget: formatCurrency(response.remainingBudget),
    // 카테고리별 예산도 변환
    categoryBudgets: response.categoryBudgets.map(mapCategoryBudgetResponse),
  };
};

// 카테고리별 예산 변환
export const mapCategoryBudgetResponse = (response: CategoryBudgetResponse) => {
  const budgetAmount = parseBigDecimal(response.budgetAmount);
  const spentAmount = parseBigDecimal(response.spentAmount);
  
  return {
    ...response,
    // BigDecimal → number로 변환
    budgetAmount,
    spentAmount,
    remainingAmount: parseBigDecimal(response.remainingAmount),
    // 프론트엔드 전용 필드 추가
    formattedBudgetAmount: formatCurrency(response.budgetAmount),
    formattedSpentAmount: formatCurrency(response.spentAmount),
    formattedRemainingAmount: formatCurrency(response.remainingAmount),
    isOverBudget: spentAmount > budgetAmount,
  };
};

// 카테고리 변환
export const mapCategoryResponse = (response: CategoryResponse) => {
  return {
    ...response,
    // 프론트엔드 전용 필드 추가
    icon: getCategoryIcon(response.name),
    color: getCategoryColor(response.name),
  };
};

// 카테고리 목록 변환
export const mapCategoryListResponse = (response: { categories: CategoryResponse[]; totalCount: number }) => {
  return {
    ...response,
    categories: response.categories.map(mapCategoryResponse),
  };
};

// 카테고리별 예산 목록 변환
export const mapCategoryBudgetListResponse = (response: { categoryBudgets: CategoryBudgetResponse[]; totalCount: number }) => {
  return {
    ...response,
    categoryBudgets: response.categoryBudgets.map(mapCategoryBudgetResponse),
  };
};

// 프론트엔드 → 백엔드 변환 (거래 내역 생성/수정)
export const mapCreateTransactionRequest = (data: {
  amount: number;
  transactionType: 'INCOME' | 'EXPENSE';
  description: string;
  memo?: string;
  transactionDate: string;
  transactionTime?: string;
  categoryId: number;
}) => {
  return {
    ...data,
    amount: data.amount.toString(), // number → string (BigDecimal)
  };
};

export const mapUpdateTransactionRequest = (data: {
  amount?: number;
  transactionType?: 'INCOME' | 'EXPENSE';
  description?: string;
  memo?: string;
  transactionDate?: string;
  transactionTime?: string;
  categoryId?: number;
}) => {
  return {
    ...data,
    amount: data.amount?.toString(), // number → string (BigDecimal)
  };
};

// 예산 생성/수정 요청 변환
export const mapCreateCategoryBudgetRequest = (data: {
  categoryId: number;
  budgetAmount: number;
}) => {
  return {
    categoryId: data.categoryId,
    budgetAmount: data.budgetAmount.toString(), // number → string (BigDecimal)
  };
};

export const mapUpdateCategoryBudgetRequest = (data: {
  budgetAmount: number;
}) => {
  return {
    budgetAmount: data.budgetAmount.toString(), // number → string (BigDecimal)
  };
};

// 카테고리 생성/수정 요청 변환
export const mapCreateCategoryRequest = (data: { name: string }) => data;
export const mapUpdateCategoryRequest = (data: { name: string }) => data;

// 유틸리티 함수들
const getCategoryIcon = (categoryName: string): string => {
  const iconMap: Record<string, string> = {
    "식비": "🍽️",
    "교통비": "🚗",
    "쇼핑": "🛍️",
    "주거비": "🏠",
    "카페": "☕",
    "오락": "🎮",
    "업무": "💼",
    "의료": "🏥",
    "선물": "🎁",
    "수입": "💰",
    "웨딩홀": "💒",
    "드레스": "👗",
    "스튜디오": "📸",
    "기타": "📦",
  };
  return iconMap[categoryName] || "📦";
};

const getCategoryColor = (categoryName: string): string => {
  const colorMap: Record<string, string> = {
    "식비": "text-orange-500",
    "교통비": "text-blue-500",
    "쇼핑": "text-purple-500",
    "주거비": "text-red-500",
    "카페": "text-amber-500",
    "오락": "text-pink-500",
    "업무": "text-gray-500",
    "의료": "text-green-500",
    "선물": "text-rose-500",
    "수입": "text-green-500",
    "웨딩홀": "text-red-500",
    "드레스": "text-purple-500",
    "스튜디오": "text-blue-500",
    "기타": "text-gray-500",
  };
  return colorMap[categoryName] || "text-gray-500";
};
