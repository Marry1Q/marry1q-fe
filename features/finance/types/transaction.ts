// 거래 내역 생성 요청 타입 (백엔드 CreateTransactionRequest와 일치)
export interface CreateTransactionRequest {
  amount: string; // BigDecimal을 string으로 처리
  transactionType: 'INCOME' | 'EXPENSE';
  description: string;
  memo?: string;
  transactionDate: string; // "yyyy-MM-dd" 형식
  transactionTime?: string; // "HH:mm:ss" 형식
  categoryId: number;
}

// 거래 내역 수정 요청 타입 (백엔드 UpdateTransactionRequest와 일치)
export interface UpdateTransactionRequest {
  amount?: string; // BigDecimal을 string으로 처리
  transactionType?: 'INCOME' | 'EXPENSE';
  description?: string;
  memo?: string;
  transactionDate?: string; // "yyyy-MM-dd" 형식
  transactionTime?: string; // "HH:mm:ss" 형식
  categoryId?: number;
}

// 거래 내역 응답 타입 (백엔드 TransactionResponse와 일치)
export interface TransactionResponse {
  transactionId: number;
  description: string;
  amount: string; // BigDecimal을 string으로 처리
  transactionType: 'INCOME' | 'EXPENSE';
  transactionDate: string; // "yyyy-MM-dd" 형식
  transactionTime?: string; // "HH:mm:ss" 형식
  memo?: string;
  categoryId: number;
  categoryName: string;
  iconName?: string; // 추가: 카테고리 아이콘 이름
  colorName?: string; // 추가: 카테고리 색상 이름
  userSeqNo: string;
  userName: string | null; // Customer JOIN으로 가져온 실제 사용자명 (미분류내역은 null)
  createdAt: string;
  updatedAt: string;
}

// 거래 내역 목록 응답 타입 (백엔드 TransactionListResponse와 일치)
export interface TransactionListResponse {
  transactions: TransactionResponse[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// 거래 내역 검색 파라미터 타입 (백엔드 TransactionSearchRequest와 일치)
export interface TransactionSearchParams {
  searchTerm?: string; // 설명, 메모에서 검색
  categoryId?: number;
  userSeqNo?: string;
  transactionType?: 'INCOME' | 'EXPENSE';
  startDate?: string; // "yyyy-MM-dd" 형식
  endDate?: string; // "yyyy-MM-dd" 형식
  page?: number; // 0부터 시작
  size?: number; // 기본값 10
}

// 예산 대시보드 응답 타입
export interface BudgetOverviewResponse {
  totalBudget: string;
  totalSpent: string;
  remainingBudget: string;
  totalUsageRate: number;
  categoryBudgets: Array<{
    categoryBudgetId: number;
    categoryId: number;
    categoryName: string;
    iconName?: string;
    colorName?: string;
    budgetAmount: string;
    spentAmount: string;
    remainingAmount: string;
    usageRate: number;
    createdAt: string;
    updatedAt: string;
  }>;
}
