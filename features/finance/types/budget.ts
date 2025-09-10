// 예산 대시보드 응답 타입 (백엔드 BudgetOverviewResponse와 일치)
export interface BudgetOverviewResponse {
  totalBudget: string; // BigDecimal을 string으로 처리
  totalSpent: string; // BigDecimal을 string으로 처리
  remainingBudget: string; // BigDecimal을 string으로 처리
  totalUsageRate: number;
  categoryBudgets: CategoryBudgetResponse[];
}

// 카테고리별 예산 응답 타입 (백엔드 CategoryBudgetResponse와 일치)
export interface CategoryBudgetResponse {
  categoryBudgetId: number;
  categoryId: number;
  categoryName: string;
  iconName?: string;
  colorName?: string;
  budgetAmount: string; // BigDecimal을 string으로 처리
  spentAmount: string; // BigDecimal을 string으로 처리
  remainingAmount: string; // BigDecimal을 string으로 처리
  usageRate: number;
  createdAt: string;
  updatedAt: string;
}

// 카테고리별 예산 생성 요청 타입 (백엔드 CreateCategoryBudgetRequest와 일치)
export interface CreateCategoryBudgetRequest {
  categoryId: number;
  budgetAmount: string; // BigDecimal을 string으로 처리
}

// 카테고리별 예산 수정 요청 타입 (백엔드 UpdateCategoryBudgetRequest와 일치)
export interface UpdateCategoryBudgetRequest {
  budgetAmount: string; // BigDecimal을 string으로 처리
}

// 카테고리별 예산 목록 응답 타입 (백엔드 CategoryBudgetListResponse와 일치)
export interface CategoryBudgetListResponse {
  categoryBudgets: CategoryBudgetResponse[];
  totalCount: number;
}
